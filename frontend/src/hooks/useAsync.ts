"use client";

import { useEffect, useState } from "react";

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

  const execute = async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await asyncFunction();
      setState({ data: response, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
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
  }, Array.isArray(depsOrImmediate) ? depsOrImmediate : []);

  return state;
}
