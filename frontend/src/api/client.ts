export const API_URL = import.meta.env.VITE_API_URL || '';

export const fetchHello = async (signal?: AbortSignal) => {
  const response = await fetch(`${API_URL}/api/hello`, { signal });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

