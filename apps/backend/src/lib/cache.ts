/* eslint-disable  @typescript-eslint/no-explicit-any */

type CacheEntry<T> = { value: T; expires: number };

const cache = new Map<string, CacheEntry<any>>();

export function getCached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) {
    console.log(`[CACHE HIT] ${key}`);   // ← add this
    return Promise.resolve(entry.value);
  }
  console.log(`[CACHE MISS] ${key}`);    // ← add this
  return fetcher().then((value) => {
    cache.set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
    console.log(`[CACHE SET] ${key} expires in ${ttlSeconds}s`);
    return value;
  });
}

export function clearCache(key?: string) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}