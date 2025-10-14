import { STORAGE_KEYS } from "@/config";

export type JsonValue = any;

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const storage = {
  get<T>(key: string, fallback: T): T {
    return safeParse<T>(localStorage.getItem(key), fallback);
  },
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key: string): void {
    localStorage.removeItem(key);
  },
  keys: STORAGE_KEYS,
};
