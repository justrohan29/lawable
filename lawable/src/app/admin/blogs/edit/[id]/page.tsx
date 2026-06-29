"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import BlogForm from "@/components/blog/BlogForm";
import { getBlog } from "@/lib/blog";
import { Blog } from "@/types/blog";
import { Button } from "@/components/ui/button";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadBlog() {
      try {
        const result = await getBlog(params.id);
        if (active) setBlog(result as Blog | null);
      } catch (error) {
        console.error("Failed to load blog for editing:", error);
        toast.error("Could not load this blog.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBlog();

    return () => {
      active = false;
    };
  }, [params.id]);

  if (loading) return <div className="p-8">Loading blog...</div>;

  if (!blog) {
    return (
      <div className="space-y-4 p-8">
        <h1 className="text-2xl font-bold">Blog not found</h1>
        <Button onClick={() => router.push("/admin/blogs")}>Back to Blogs</Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-8 text-3xl font-bold">Edit Blog</h1>
      <BlogForm blog={blog} />
    </div>
  );
}