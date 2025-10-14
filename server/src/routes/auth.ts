import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import type { Request, Response } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: "Missing fields" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "Email already registered" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, passwordHash });
  return res.status(201).json({ id: user._id, username: user.username, email: user.email });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({}, process.env.JWT_SECRET || "dev_secret", { subject: user._id.toString(), expiresIn: "7d" });
  return res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
});

router.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId).select("username email");
  if (!user) return res.status(404).json({ error: "Not found" });
  return res.json({ id: user._id, username: user.username, email: user.email });
});

export default router;
