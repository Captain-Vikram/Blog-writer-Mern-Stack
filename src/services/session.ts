import { storage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/config";
import type { User } from "@/types";

const TOKEN_KEY = "auth_token";

export function setSession(token: string, user: User) {
  storage.set(TOKEN_KEY, token);
  storage.set(STORAGE_KEYS.currentUser, user);
}

export function clearSession() {
  storage.remove(TOKEN_KEY);
  storage.remove(STORAGE_KEYS.currentUser);
}

export function getToken(): string | null {
  return storage.get<string | null>(TOKEN_KEY, null);
}

export function getSessionUser(): User | null {
  return storage.get<User | null>(STORAGE_KEYS.currentUser, null);
}
