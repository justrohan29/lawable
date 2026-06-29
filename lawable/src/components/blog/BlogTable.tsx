"use client";

import { useState } from "react";
import { toast } from "sonner";

import { deleteBlog } from "@/lib/blog";
import { Blog } from "@/types/blog";

interface Props {
  blogs: Blog[];
  onDeleted?: (blogId: string) => void;
}

export default function BlogTable({ blogs, onDeleted }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (blog: Blog) => {
    const confirmed = window.confirm(`Move "${blog.title}" to trash?`);
    if (!confirmed) return;

    setDeletingId(blog.id);

    try {
      await deleteBlog(blog.id);
      onDeleted?.(blog.id);
      toast.success("Blog moved to trash.");
    } catch (error) {
      console.error("Failed to delete blog:", error);
      toast.error("Could not delete blog. Check Firebase permissions and try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (blogs.length === 0) {
    return <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">No blogs found.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="p-3 text-left font-semibold">Cover</th>
            <th className="p-3 text-left font-semibold">Title</th>
            <th className="p-3 text-left font-semibold">Category</th>
            <th className="p-3 text-left font-semibold">Status</th>
            <th className="p-3 text-left font-semibold">Featured</th>
            <th className="p-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id} className="border-t border-slate-100 align-middle">
              <td className="p-3">
                {blog.coverImage ? (
                  <img src={blog.coverImage} alt={blog.title} className="h-16 w-20 rounded object-cover" />
                ) : (
                  <div className="flex h-16 w-20 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">
                    No image
                  </div>
                )}
              </td>

              <td className="max-w-xs p-3 font-medium text-slate-950">
                <div className="truncate">{blog.title}</div>
                <div className="truncate text-xs font-normal text-slate-500">/{blog.slug}</div>
              </td>

              <td className="p-3 text-slate-700">{blog.category}</td>

              <td className="p-3">
                <span
                  className={`rounded px-2 py-1 text-xs font-semibold ${
                    blog.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {blog.status}
                </span>
              </td>

              <td className="p-3 text-slate-700">{blog.featured ? "Yes" : "No"}</td>

              <td className="p-3">
                <div className="flex gap-2">
                  <a
                    href={`/admin/blogs/edit/${blog.id}`}
                    className="inline-flex h-8 items-center rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </a>

                  <button
                    type="button"
                    className="inline-flex h-8 items-center rounded-lg bg-red-600 px-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={deletingId === blog.id}
                    onClick={() => handleDelete(blog)}
                  >
                    {deletingId === blog.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}