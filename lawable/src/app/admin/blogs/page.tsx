"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import BlogTable from "@/components/blog/BlogTable";
import { getBlogs } from "@/lib/blog";
import { Blog } from "@/types/blog";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBlogs = async () => {
    try {
      const data = await getBlogs();
      setBlogs(data as Blog[]);
    } catch (error) {
      console.error("Failed to load blogs:", error);
      toast.error("Could not load blogs.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadBlogs();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="p-8">Loading blogs...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Blog Management</h1>
          <p className="mt-1 text-sm text-slate-500">Create, edit, publish, and soft-delete Lawable articles.</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              loadBlogs();
            }}
            disabled={refreshing}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={16} /> {refreshing ? "Refreshing" : "Refresh"}
          </button>
          <Link href="/admin/blogs/new" className="inline-flex h-10 items-center rounded-lg bg-black px-5 text-sm font-semibold text-white hover:bg-slate-800">
            New Blog
          </Link>
        </div>
      </div>

      <BlogTable blogs={blogs} onDeleted={(blogId) => setBlogs((current) => current.filter((blog) => blog.id !== blogId))} />
    </div>
  );
}