export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiErrorShape {
  success: false;
  error: string;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  const json = (await res.json()) as ApiSuccess<T> | ApiErrorShape;
  if ('success' in json && json.success) {
    return json.data;
  }
  const message = 'error' in json ? json.error : `Request failed with status ${res.status}`;
  throw new Error(message);
}


