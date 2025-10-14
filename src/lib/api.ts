import { config } from "@/config";
import { getToken } from "@/services/session";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = config.apiBaseUrl?.replace(/\/$/, "") ?? "";
  const url = `${base}${path}`;
  const token = getToken();
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...authHeader, ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(text || res.statusText, res.status);
  }
  // Gracefully handle empty responses (e.g., 204 No Content) and non-JSON bodies
  if (res.status === 204) {
    return undefined as unknown as T;
  }
  const text = await res.text();
  if (!text) return undefined as unknown as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    // Fallback: return raw text if not JSON
    return text as unknown as T;
  }
}
