/**
 * cache_manager.js
 * High-Performance Client-Side Static Caching Engine (Zero-Hammering Strategy)
 * Caches scrip masters, sector lists, static research targets & historical baselines
 * in browser localStorage with TTL, preventing redundant API calls and rate limits.
 */

(function (window) {
  'use strict';

  const CACHE_PREFIX = 'bl_cache_';

  const BreadthCache = {
    /**
     * Get item from local cache if valid and not expired
     */
    get(key) {
      try {
        const raw = localStorage.getItem(CACHE_PREFIX + key);
        if (!raw) return null;
        const record = JSON.parse(raw);
        const now = Date.now();
        if (record.expiry && now > record.expiry) {
          localStorage.removeItem(CACHE_PREFIX + key);
          return null;
        }
        return record.data;
      } catch (err) {
        console.warn(`[BreadthCache] Read error for key "${key}":`, err);
        return null;
      }
    },

    /**
     * Store data in localStorage with TTL in minutes
     * ttlMinutes: default 60 mins (pass null or 0 for permanent)
     */
    set(key, data, ttlMinutes = 60) {
      try {
        const now = Date.now();
        const record = {
          data: data,
          savedAt: now,
          expiry: ttlMinutes ? now + (ttlMinutes * 60 * 1000) : null
        };
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(record));
        return true;
      } catch (err) {
        // Handle QuotaExceededError by clearing old caches
        if (err && (err.name === 'QuotaExceededError' || err.code === 22)) {
          console.warn('[BreadthCache] Quota exceeded, purging expired caches...');
          BreadthCache.purgeExpired();
          try {
            localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, savedAt: Date.now(), expiry: null }));
            return true;
          } catch (e) {
            return false;
          }
        }
        console.warn(`[BreadthCache] Write error for key "${key}":`, err);
        return false;
      }
    },

    /**
     * Stale-While-Revalidate / Cache-First fetcher
     * Checks cache first; if present, calls onSuccess immediately;
     * then optionally triggers background refresh if forceRefresh or expired.
     */
    async getOrFetch(key, fetchFn, ttlMinutes = 60, forceRefresh = false) {
      if (!forceRefresh) {
        const cached = BreadthCache.get(key);
        if (cached !== null) {
          return cached;
        }
      }

      try {
        const freshData = await fetchFn();
        if (freshData !== null && freshData !== undefined) {
          BreadthCache.set(key, freshData, ttlMinutes);
        }
        return freshData;
      } catch (err) {
        // Fallback to expired cache if network fails!
        console.warn(`[BreadthCache] Network fetch failed for "${key}", checking fallback cache...`, err);
        try {
          const raw = localStorage.getItem(CACHE_PREFIX + key);
          if (raw) {
            const record = JSON.parse(raw);
            console.info(`[BreadthCache] Rescued with fallback cache for "${key}".`);
            return record.data;
          }
        } catch (e) {}
        throw err;
      }
    },

    /**
     * Remove specific cached item
     */
    remove(key) {
      try {
        localStorage.removeItem(CACHE_PREFIX + key);
      } catch (e) {}
    },

    /**
     * Clean up all expired cache entries
     */
    purgeExpired() {
      try {
        const now = Date.now();
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(CACHE_PREFIX)) {
            try {
              const record = JSON.parse(localStorage.getItem(k));
              if (record && record.expiry && now > record.expiry) {
                localStorage.removeItem(k);
              }
            } catch (e) {
              localStorage.removeItem(k);
            }
          }
        }
      } catch (e) {}
    },

    /**
     * Clear all Breadth Lab caches
     */
    clearAll() {
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(CACHE_PREFIX)) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        console.info(`[BreadthCache] Purged ${keysToRemove.length} cached keys.`);
      } catch (e) {}
    }
  };

  // Run cleanup once on load
  setTimeout(() => BreadthCache.purgeExpired(), 3000);

  window.BreadthCache = BreadthCache;
})(window);
