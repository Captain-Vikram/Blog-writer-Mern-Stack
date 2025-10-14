import { storage } from "@/lib/storage";
import { Blog } from "@/types";
import { apiFetch } from "@/lib/api";
import { getCurrentUser } from "@/services/auth";
import { config } from "@/config";

function seedIfEmpty(): Blog[] {
  const existing = storage.get<Blog[] | null>(storage.keys.blogs, null);
  if (existing && existing.length) return existing;

  const dummyBlogs: Blog[] = [
    {
      id: "1",
  title: "Welcome to Chronicle Blog",
      content:
  "This is your first blog post. Start writing your thoughts and share them with the world! Chronicle Blog provides a beautiful dark-mode interface perfect for late-night writing sessions.",
      author: "Admin",
      date: new Date().toISOString(),
    },
    {
      id: "2",
      title: "The Art of Minimalist Design",
      content:
        "Minimalism in design is not just about using less, it's about making every element count. In this post, we explore how minimalist principles can improve user experience and create more impactful designs.",
      author: "Design Team",
      date: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      title: "Building Modern Web Applications",
      content:
        "Modern web development has evolved significantly. With tools like React, TypeScript, and Tailwind CSS, creating beautiful and functional applications has never been easier. Let's dive into best practices.",
      author: "Dev Team",
      date: new Date(Date.now() - 172800000).toISOString(),
    },
  ];
  storage.set(storage.keys.blogs, dummyBlogs);
  return dummyBlogs;
}

export async function listBlogs(): Promise<Blog[]> {
  if (config.apiBaseUrl) {
    const apiBlogs = await apiFetch<any[]>(`/blogs`);
    return apiBlogs.map((b) => ({
      id: b._id,
      title: b.title,
      content: b.content,
      author: b.author?.username ?? "Unknown",
      authorId: b.author?._id,
      date: b.createdAt ?? new Date().toISOString(),
    }));
  }
  return storage.get<Blog[]>(storage.keys.blogs, seedIfEmpty());
}

export async function getBlog(id: string): Promise<Blog | null> {
  if (config.apiBaseUrl) {
    const b = await apiFetch<any>(`/blogs/${id}`);
    return {
      id: b._id,
      title: b.title,
      content: b.content,
      author: b.author?.username ?? "Unknown",
      authorId: b.author?._id,
      date: b.createdAt ?? new Date().toISOString(),
    };
  }
  const blogs = await listBlogs();
  return blogs.find((b) => b.id === id) ?? null;
}

export async function createBlog(partial: Pick<Blog, "title" | "content" | "author">): Promise<Blog> {
  if (config.apiBaseUrl) {
    const currentUser = getCurrentUser();
    const b = await apiFetch<any>(`/blogs`, {
      method: "POST",
      body: JSON.stringify({ title: partial.title, content: partial.content }),
    });
    return {
      id: b._id,
      title: b.title,
      content: b.content,
      author: partial.author,
      authorId: currentUser?.id,
      date: b.createdAt ?? new Date().toISOString(),
    };
  }
  const blogs = await listBlogs();
  const newBlog: Blog = {
    id: Date.now().toString(),
    title: partial.title,
    content: partial.content,
    author: partial.author,
    date: new Date().toISOString(),
  };
  const next = [newBlog, ...blogs];
  storage.set(storage.keys.blogs, next);
  return newBlog;
}

export async function deleteBlog(id: string): Promise<void> {
  if (config.apiBaseUrl) {
    await apiFetch(`/blogs/${id}`, { method: "DELETE" });
    return;
  }
  const blogs = await listBlogs();
  storage.set(storage.keys.blogs, blogs.filter((b) => b.id !== id));
}

export async function updateBlog(id: string, data: Partial<Pick<Blog, "title" | "content">>): Promise<Blog | null> {
  if (config.apiBaseUrl) {
    const b = await apiFetch<any>(`/blogs/${id}`, { method: "PUT", body: JSON.stringify(data) });
    return {
      id: b._id,
      title: b.title,
      content: b.content,
      author: b.author?.username ?? "Unknown",
      date: b.updatedAt ?? new Date().toISOString(),
    };
  }
  const blogs = await listBlogs();
  const idx = blogs.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  const updated: Blog = { ...blogs[idx], ...data } as Blog;
  blogs[idx] = updated;
  storage.set(storage.keys.blogs, blogs);
  return updated;
}
