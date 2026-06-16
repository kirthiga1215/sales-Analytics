"use client";

import { useEffect, useRef, useState } from "react";

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  depsOrImmediate: unknown = true
): UseAsyncState<T> {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: depsOrImmediate === true,
    error: null,
  });

  // Keep ref of previous data to prevent flicker
  const prevDataRef = useRef<T | null>(null);

  const execute = async () => {
    // Keep previous data while loading to prevent flicker
    setState((prev) => ({ data: prev.data, loading: true, error: null }));
    try {
      const response = await asyncFunction();
      prevDataRef.current = response;
      setState({ data: response, loading: false, error: null });
    } catch (error) {
      setState({
        data: prevDataRef.current,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  };

  const immediate =
    depsOrImmediate === true ||
    depsOrImmediate === undefined ||
    Array.isArray(depsOrImmediate);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, Array.isArray(depsOrImmediate) ? depsOrImmediate : []);

  return state;
}