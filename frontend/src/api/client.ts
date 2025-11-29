import type { components } from './types';

export const API_URL = import.meta.env.VITE_API_URL || '';

// Type-safe response types from OpenAPI spec
type HelloResponse = components['schemas']['HelloResponse'];
type HealthResponse = components['schemas']['HealthResponse'];
type MessageResponse = components['schemas']['MessageResponse'];

/**
 * Fetch hello message from the API
 * @param signal - Optional AbortSignal for cancelling the request
 * @returns Promise with HelloResponse
 */
export const fetchHello = async (signal?: AbortSignal): Promise<HelloResponse> => {
  const response = await fetch(`${API_URL}/api/hello`, { signal });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

/**
 * Fetch health status from the API
 * @param signal - Optional AbortSignal for cancelling the request
 * @returns Promise with HealthResponse
 */
export const fetchHealth = async (signal?: AbortSignal): Promise<HealthResponse> => {
  const response = await fetch(`${API_URL}/health`, { signal });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

/**
 * Fetch root message from the API
 * @param signal - Optional AbortSignal for cancelling the request
 * @returns Promise with MessageResponse
 */
export const fetchRoot = async (signal?: AbortSignal): Promise<MessageResponse> => {
  const response = await fetch(`${API_URL}/`, { signal });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

