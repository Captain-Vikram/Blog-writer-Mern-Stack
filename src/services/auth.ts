import { storage } from "@/lib/storage";
import { User } from "@/types";
import { apiFetch } from "@/lib/api";
import { setSession, clearSession } from "@/services/session";

export async function signup(user: User): Promise<{ success: true } | { success: false; message: string }> {
  try {
    const res = await apiFetch<{ id: string; username: string; email: string }>(`/auth/signup`, {
      method: "POST",
      body: JSON.stringify(user),
    });
    // keep local mirror for now
    const users = storage.get<User[]>(storage.keys.users, []);
    users.push({ ...user, id: res.id, password: undefined });
    storage.set(storage.keys.users, users);
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e?.message || "Signup failed" };
  }
}

export async function login(email: string, password: string): Promise<{ success: true; user: User } | { success: false; message: string }> {
  try {
    const res = await apiFetch<{ token: string; user: { id: string; username: string; email: string } }>(`/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const user: User = { id: res.user.id, username: res.user.username, email: res.user.email };
    setSession(res.token, user);
    return { success: true, user };
  } catch (e: any) {
    return { success: false, message: e?.message || "Invalid credentials" };
  }
}

export async function logout(): Promise<void> {
  clearSession();
}

export function getCurrentUser(): User | null {
  return storage.get<User | null>(storage.keys.currentUser, null);
}
