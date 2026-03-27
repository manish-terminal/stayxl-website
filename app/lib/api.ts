/**
 * Base API Client utility to handle requests to the AWS Go Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiFetch(endpoint: string, options: any = {}) {
  // Always use local origin for client-side /api calls to hit Next.js proxies
  const isClient = typeof window !== 'undefined';
  const url = (isClient && endpoint.startsWith('/api/'))
    ? endpoint 
    : (endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`);
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Get token from cookie if exists
  const token = typeof document !== 'undefined' 
    ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
    : null;

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
