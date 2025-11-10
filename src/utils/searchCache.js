// src/utils/searchCache.js
const MAX_CACHE_SIZE = 50; 
const CACHE_TTL = 5 * 60 * 1000; // 5 menit

export const searchCache = new Map(); // Cache in-memory

export const getFromCache = (key) => {
  if (!searchCache.has(key)) return null;

  const entry = searchCache.get(key);
  const now = Date.now();

  // Hapus data lama (expired)
  if (now - entry.timestamp > CACHE_TTL) {
    searchCache.delete(key);
    return null;
  }

  return entry.data;
};

export const setToCache = (key, data) => {
  // Batasi ukuran cache (agar tidak memory leak)
  if (searchCache.size >= MAX_CACHE_SIZE) {
    // Hapus entri terlama (FIFO)
    const firstKey = searchCache.keys().next().value;
    searchCache.delete(firstKey);
  }

  searchCache.set(key, {
    data,
    timestamp: Date.now(),
  });
};