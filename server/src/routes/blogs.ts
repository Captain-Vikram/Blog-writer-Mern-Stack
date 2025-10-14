import { Router } from "express";
import type { Response } from "express";
import { Blog } from "../models/Blog.js";
import { requireAuth, AuthRequest } from "../middleware/auth.js";

const router = Router();

// List all blogs
router.get("/", async (_req, res) => {
  const blogs = await Blog.find().populate("author", "username email").sort({ createdAt: -1 });
  res.json(blogs);
});

// Get one blog
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("author", "username email");
  if (!blog) return res.status(404).json({ error: "Not found" });
  res.json(blog);
});

// Create blog (auth required)
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: "Missing fields" });
  const blog = await Blog.create({ title, content, author: req.userId! });
  res.status(201).json(blog);
});

// Update blog (owner only)
router.put("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ error: "Not found" });
  if (blog.author.toString() !== req.userId) return res.status(403).json({ error: "Forbidden" });
  blog.title = title ?? blog.title;
  blog.content = content ?? blog.content;
  await blog.save();
  res.json(blog);
});

// Delete blog (owner only)
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ error: "Not found" });
  if (blog.author.toString() !== req.userId) return res.status(403).json({ error: "Forbidden" });
  await blog.deleteOne();
  res.status(204).send();
});

export default router;
