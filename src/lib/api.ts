import { useAuth } from './auth';

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithAuth(url: string, options: FetchOptions = {}) {
  const { accessToken } = useAuth.getState();
  const { requiresAuth = true, ...fetchOptions } = options;

  const headers = new Headers(options.headers);
  
  if (requiresAuth && accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.message || 'An error occurred',
      response.status,
      error
    );
  }

  return response.json();
}

export const api = {
  get: (url: string, options?: FetchOptions) => 
    fetchWithAuth(url, { ...options, method: 'GET' }),
    
  post: (url: string, data?: any, options?: FetchOptions) =>
    fetchWithAuth(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    }),

  put: (url: string, data?: any, options?: FetchOptions) =>
    fetchWithAuth(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    }),

  delete: (url: string, options?: FetchOptions) =>
    fetchWithAuth(url, { ...options, method: 'DELETE' }),
};