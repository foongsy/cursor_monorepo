/**
 * Custom React hook for handling API calls with loading and error states
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiError } from '../api/client';

/**
 * State interface for API call
 */
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | Error | null;
}

/**
 * Options for useApi hook
 */
export interface UseApiOptions {
  /** Whether to execute the API call immediately on mount */
  immediate?: boolean;
}

/**
 * Custom hook for handling API calls with loading and error states
 * 
 * @param apiFunction - Async function that makes the API call
 * @param options - Configuration options
 * @returns Object containing data, loading, error states and execute function
 * 
 * @example
 * ```tsx
 * function NewsComponent() {
 *   const { data, loading, error, execute } = useApi(() => fetchNews({ limit: 10 }));
 * 
 *   useEffect(() => {
 *     execute();
 *   }, [execute]);
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!data) return null;
 * 
 *   return <div>{data.articles.length} articles</div>;
 * }
 * ```
 */
export function useApi<T>(
  apiFunction: (signal: AbortSignal) => Promise<T>,
  options: UseApiOptions = {}
): ApiState<T> & {
  execute: () => Promise<void>;
  reset: () => void;
} {
  const { immediate = false } = options;

  // Use ref to store the API function to avoid recreating execute on every render
  const apiFunctionRef = useRef(apiFunction);
  
  // Update the ref when the function changes
  useEffect(() => {
    apiFunctionRef.current = apiFunction;
  }, [apiFunction]);

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (): Promise<void> => {
    const abortController = new AbortController();

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const result = await apiFunctionRef.current(abortController.signal);
      setState({
        data: result,
        loading: false,
        error: null,
      });
    } catch (err) {
      // Don't update state if request was aborted
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err : new Error('Unknown error'),
      });
    }

    return () => {
      abortController.abort();
    };
  }, []); // Empty dependency array - execute function never changes

  const reset = useCallback((): void => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  // Execute immediately if requested (only on mount)
  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for API calls that execute immediately on mount
 * 
 * @param apiFunction - Async function that makes the API call
 * @returns Object containing data, loading, error states and refetch function
 * 
 * @example
 * ```tsx
 * function NewsComponent() {
 *   const { data, loading, error, refetch } = useApiImmediate(() => fetchNews({ limit: 10 }));
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!data) return null;
 * 
 *   return (
 *     <div>
 *       {data.articles.length} articles
 *       <button onClick={refetch}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useApiImmediate<T>(
  apiFunction: (signal: AbortSignal) => Promise<T>
): ApiState<T> & {
  refetch: () => Promise<void>;
  reset: () => void;
} {
  const result = useApi(apiFunction, { immediate: true });

  return {
    data: result.data,
    loading: result.loading,
    error: result.error,
    refetch: result.execute,
    reset: result.reset,
  };
}

