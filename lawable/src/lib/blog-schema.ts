import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.string().min(1, "Select a category"),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
});

export type BlogFormData = z.infer<typeof blogSchema>;