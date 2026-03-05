import { useState, useEffect, useRef } from "react";
import { fetchHealth, type HealthData } from "@/lib/api";

const REFRESH_MS = 60_000; // re-poll every 60 s

interface UseHealthResult {
  data: HealthData | null;
  loading: boolean;
  error: boolean;
}

// Module-level cache so multiple components share the same result
let _cache: HealthData | null = null;
let _cacheAt = 0;
const _listeners = new Set<() => void>();
let _fetching = false;

async function _fetch() {
  if (_fetching) return;
  _fetching = true;
  try {
    const data = await fetchHealth();
    _cache = data;
    _cacheAt = Date.now();
    _listeners.forEach((fn) => fn());
  } catch {
    // leave cache as-is on error
  } finally {
    _fetching = false;
  }
}

export function useHealth(): UseHealthResult {
  const [data, setData] = useState<HealthData | null>(_cache);
  const [loading, setLoading] = useState(!_cache);
  const [error, setError] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    // Subscribe to shared updates
    const notify = () => {
      if (!mounted.current) return;
      if (_cache) { setData(_cache); setLoading(false); setError(false); }
    };
    _listeners.add(notify);

    // Kick off a fetch if cache is stale or empty
    const stale = Date.now() - _cacheAt > REFRESH_MS;
    if (!_cache || stale) {
      setLoading(true);
      _fetch().catch(() => {
        if (mounted.current) setError(true);
      }).finally(() => {
        if (mounted.current) setLoading(false);
      });
    }

    // Periodic refresh
    const interval = setInterval(() => {
      _fetch();
    }, REFRESH_MS);

    return () => {
      mounted.current = false;
      _listeners.delete(notify);
      clearInterval(interval);
    };
  }, []);

  return { data, loading, error };
}
