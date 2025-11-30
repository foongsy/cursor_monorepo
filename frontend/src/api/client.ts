/**
 * API Client Service
 * Type-safe API client using auto-generated types from OpenAPI spec
 */

import type { components } from './types';

export const API_URL = import.meta.env.VITE_API_URL || '';

// Type-safe response types from OpenAPI spec
export type Article = components['schemas']['Article'];
export type ArticleDetail = components['schemas']['ArticleDetail'];
export type ArticleCategory = components['schemas']['ArticleCategory'];
export type ArticlesResponse = components['schemas']['ArticlesResponse'];
export type HealthResponse = components['schemas']['HealthResponse'];
export type MessageResponse = components['schemas']['MessageResponse'];

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Helper function to build query string from parameters
 */
function buildQueryString(params: Record<string, string | number | boolean | null | undefined>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = null;
      }

      throw new ApiError(
        response.status,
        response.statusText,
        `API request failed: ${response.status} ${response.statusText}`,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network errors or other fetch failures
    throw new ApiError(
      0,
      'Network Error',
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}

// ============================================================================
// News API Endpoints
// ============================================================================

/**
 * Parameters for fetching paginated news
 */
export interface FetchNewsParams {
  page?: number;
  limit?: number;
  category?: ArticleCategory;
  search?: string;
  sort_by?: 'publishedAt' | 'title' | 'category';
  sort_order?: 'asc' | 'desc';
}

/**
 * Fetch paginated news articles with filtering and sorting
 * 
 * @param params - Query parameters for filtering and pagination
 * @param signal - Optional AbortSignal for cancelling the request
 * @returns Promise with ArticlesResponse containing articles and pagination metadata
 * 
 * @example
 * ```ts
 * const news = await fetchNews({ page: 1, limit: 10, category: 'Anime' });
 * ```
 */
export async function fetchNews(
  params: FetchNewsParams = {},
  signal?: AbortSignal
): Promise<ArticlesResponse> {
  const queryString = buildQueryString(params);
  return fetchApi<ArticlesResponse>(`/api/news${queryString}`, { signal });
}

/**
 * Fetch the latest news articles
 * 
 * @param limit - Maximum number of articles to return (default: 10, max: 50)
 * @param signal - Optional AbortSignal for cancelling the request
 * @returns Promise with array of ArticleDetail
 * 
 * @example
 * ```ts
 * const latestNews = await fetchLatestNews(5);
 * ```
 */
export async function fetchLatestNews(
  limit: number = 10,
  signal?: AbortSignal
): Promise<ArticleDetail[]> {
  const queryString = buildQueryString({ limit });
  return fetchApi<ArticleDetail[]>(`/api/news/latest${queryString}`, { signal });
}

/**
 * Fetch a single news article by ID
 * 
 * @param id - The unique article identifier
 * @param signal - Optional AbortSignal for cancelling the request
 * @returns Promise with ArticleDetail
 * @throws {ApiError} If article is not found (404)
 * 
 * @example
 * ```ts
 * const article = await fetchNewsById('650043');
 * ```
 */
export async function fetchNewsById(
  id: string,
  signal?: AbortSignal
): Promise<ArticleDetail> {
  return fetchApi<ArticleDetail>(`/api/news/${id}`, { signal });
}

/**
 * Fetch all news articles in a specific category
 * 
 * @param category - The category name (e.g., "Anime", "Exhibition", "Movie")
 * @param signal - Optional AbortSignal for cancelling the request
 * @returns Promise with array of ArticleDetail
 * @throws {ApiError} If category is not found (404)
 * 
 * @example
 * ```ts
 * const animeNews = await fetchNewsByCategory('Anime');
 * ```
 */
export async function fetchNewsByCategory(
  category: string,
  signal?: AbortSignal
): Promise<ArticleDetail[]> {
  return fetchApi<ArticleDetail[]>(`/api/news/category/${encodeURIComponent(category)}`, { signal });
}

/**
 * Fetch list of all available article categories
 * 
 * @param signal - Optional AbortSignal for cancelling the request
 * @returns Promise with array of category names
 * 
 * @example
 * ```ts
 * const categories = await fetchCategories();
 * // ['Exhibition', 'New Series', 'Anime', 'Event', ...]
 * ```
 */
export async function fetchCategories(
  signal?: AbortSignal
): Promise<string[]> {
  return fetchApi<string[]>('/api/categories', { signal });
}

// ============================================================================
// Health & Status Endpoints
// ============================================================================

/**
 * Fetch health status from the API
 * 
 * @param signal - Optional AbortSignal for cancelling the request
 * @returns Promise with HealthResponse
 * 
 * @example
 * ```ts
 * const health = await fetchHealth();
 * // { status: 'ok', environment: 'development' }
 * ```
 */
export async function fetchHealth(
  signal?: AbortSignal
): Promise<HealthResponse> {
  return fetchApi<HealthResponse>('/health', { signal });
}

/**
 * Fetch root message from the API
 * 
 * @param signal - Optional AbortSignal for cancelling the request
 * @returns Promise with MessageResponse
 * 
 * @example
 * ```ts
 * const root = await fetchRoot();
 * // { message: 'Welcome to the Monorepo API' }
 * ```
 */
export async function fetchRoot(
  signal?: AbortSignal
): Promise<MessageResponse> {
  return fetchApi<MessageResponse>('/', { signal });
}

