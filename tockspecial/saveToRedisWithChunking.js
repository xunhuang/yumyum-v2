const { Redis } = require("@upstash/redis");

// this loads from .env file in current directory (not ~/.env)
require('dotenv').config()

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

exports.saveToRedisWithChunking = async function saveToRedisWithChunking(
  result,
  tag
) {
  const chunks = chunkObject(result, 1000000); // 1 Mbytes
  for (const chunk of chunks) {
    try {
      console.log(`${tag} Chunk size: ${Object.keys(chunk).length} keys`);
      console.log(
        `${tag} Total size: ${
          new TextEncoder().encode(JSON.stringify(chunk)).length
        } bytes`
      );
      // Use a pipeline to set keys and their TTLs
      const pipeline = redis.pipeline();
      pipeline.mset(chunk);
      // for (const key of Object.keys(chunk)) {
      //   pipeline.expire(key, 3600); // Set TTL to 3600 seconds (1 hour)
      // }
      await pipeline.exec();
    } catch (e) {
      console.log("REDIS ERROR for " + e);
    }
  }
};

function chunkObject(obj, chunkSizeInBytes) {
  const chunks = [];
  let chunk = {};

  let currentChunkSize = 0;
  for (const [key, value] of Object.entries(obj)) {
    const entrySize = new TextEncoder().encode(
      JSON.stringify({ [key]: value })
    ).length;
    if (currentChunkSize + entrySize > chunkSizeInBytes) {
      chunks.push(chunk);
      chunk = {};
      currentChunkSize = 0;
    }
    chunk[key] = value;
    currentChunkSize += entrySize;
  }

  if (Object.keys(chunk).length > 0) {
    chunks.push(chunk);
  }

  return chunks;
}
