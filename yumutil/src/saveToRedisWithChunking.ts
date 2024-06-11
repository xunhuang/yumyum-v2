import { Redis } from "@upstash/redis";
import dotenv from 'dotenv';

// this loads from .env file in current directory (not ~/.env)
dotenv.config();

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set");
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function saveToRedisWithChunking(
  result: Record<string, any>,
  tag: string
): Promise<void> {
  const chunks = chunkObject(result, 1000000); // 1 Mbytes
  for (const chunk of chunks) {
    try {
      console.log(`${tag} Chunk size: ${Object.keys(chunk).length} keys`);
      console.log(
        `${tag} Total size: ${new TextEncoder().encode(JSON.stringify(chunk)).length
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

function chunkObject(obj: Record<string, any>, chunkSizeInBytes: number): Record<string, any>[] {
  const chunks: Record<string, any>[] = [];
  let chunk: Record<string, any> = {};

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
