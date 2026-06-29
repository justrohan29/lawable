"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getPublishedBlogs } from "@/lib/blog";
import { Blog } from "@/types/blog";

export default function PublicBlogPage() {
  const params = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadBlog() {
      try {
        const blogs = await getPublishedBlogs();
        const match = (blogs as Blog[]).find((item) => item.slug === params.slug) ?? null;
        if (active) setBlog(match);
      } catch (error) {
        console.error("Failed to load blog:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBlog();

    return () => {
      active = false;
    };
  }, [params.slug]);

  if (loading) return <div className="mx-auto max-w-3xl p-8">Loading blog...</div>;

  if (!blog) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-8">
        <h1 className="text-3xl font-bold text-slate-900">Blog not found</h1>
        <Link href="/blog" className="text-sm font-semibold text-blue-600">
          Back to blogs
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl space-y-6 p-8">
      <Link href="/blog" className="text-sm font-semibold text-blue-600">
        Back to blogs
      </Link>

      {blog.coverImage ? (
        <img src={blog.coverImage} alt={blog.title} className="aspect-video w-full rounded-lg object-cover" />
      ) : null}

      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{blog.category}</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">{blog.title}</h1>
        <p className="text-lg text-slate-600">{blog.excerpt}</p>
      </div>

      <div className="whitespace-pre-wrap text-base leading-8 text-slate-800">{blog.content}</div>
    </article>
  );
}