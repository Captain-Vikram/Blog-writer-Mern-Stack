import { Schema, model, Types } from "mongoose";

export interface IBlog {
  title: string;
  content: string;
  author: Types.ObjectId; // User ref
}

const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const Blog = model<IBlog>("Blog", blogSchema);
