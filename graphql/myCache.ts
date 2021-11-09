const NodeCache = require("node-cache");

export const myCache = new NodeCache(
    { stdTTL: 60 * 15, checkperiod: 120 }
    // { stdTTL: 45, checkperiod: 120 } // 45 seconds for testing the cache
);
myCache.clear = () => {
    myCache.flushAll();
};
myCache.delete = (key: string) => {
    myCache.del(key);
};
