export const config = {
  // Future: point this to your backend API. E.g., http://localhost:3000/api
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
};

export const STORAGE_KEYS = {
  users: "users",
  currentUser: "currentUser",
  blogs: "blogs",
} as const;
