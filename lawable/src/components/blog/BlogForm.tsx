"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createBlog, updateBlog, uploadBlogImage } from "@/lib/blog";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Blog } from "@/types/blog";

type BlogStatus = "draft" | "published";

type BlogFormState = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  status: BlogStatus;
  featured: boolean;
};

type BlogFormErrors = Partial<Record<keyof BlogFormState | "coverImage", string>>;

type BlogFormProps = {
  blog?: Blog;
};

const CATEGORIES = ["Career", "Internship", "Corporate Law", "Litigation"];

const emptyState: BlogFormState = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  status: "draft",
  featured: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getInitialState(blog?: Blog): BlogFormState {
  if (!blog) return emptyState;

  return {
    title: blog.title,
    excerpt: blog.excerpt,
    content: blog.content,
    category: blog.category,
    status: blog.status,
    featured: blog.featured,
  };
}

function validateBlogForm(values: BlogFormState, image: File | null): BlogFormErrors {
  const errors: BlogFormErrors = {};

  if (values.title.trim().length < 5) errors.title = "Title must be at least 5 characters.";
  if (values.excerpt.trim().length < 20) errors.excerpt = "Excerpt must be at least 20 characters.";
  if (values.content.trim().length < 50) errors.content = "Content must be at least 50 characters.";
  if (!values.category) errors.category = "Select a category.";
  if (image && !image.type.startsWith("image/")) errors.coverImage = "Cover image must be an image file.";
  if (image && image.size > 5 * 1024 * 1024) errors.coverImage = "Cover image must be smaller than 5 MB.";

  return errors;
}

export default function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [values, setValues] = useState<BlogFormState>(() => getInitialState(blog));
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<BlogFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [saveStep, setSaveStep] = useState("");

  const isEditing = Boolean(blog);
  const generatedSlug = useMemo(() => slugify(values.title), [values.title]);

  const updateField = <K extends keyof BlogFormState>(field: K, value: BlogFormState[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateBlogForm(values, image);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    if (!user) {
      toast.error("You must be signed in to save a blog.");
      return;
    }

    setLoading(true);
    setSaveStep(image ? "Uploading cover image..." : "Saving blog...");

    try {
      const coverImage = image ? await uploadBlogImage(image) : blog?.coverImage ?? "";
      setSaveStep("Saving blog...");
      const payload = {
        title: values.title.trim(),
        slug: generatedSlug,
        excerpt: values.excerpt.trim(),
        content: values.content.trim(),
        category: values.category,
        coverImage,
        featured: values.featured,
        status: values.status,
        author: blog?.author || user.name || user.email,
        deleted: blog?.deleted ?? false,
      };

      if (blog) {
        await updateBlog(blog.id, payload);
      } else {
        await createBlog(payload);
      }

      toast.success(values.status === "published" ? "Blog published." : "Draft saved.");
      router.push("/admin/blogs");
      router.refresh();
    } catch (error) {
      console.error("Save blog failed:", error);
      const message = error instanceof Error ? error.message : "Could not save blog. Check Firebase rules for Firestore and Storage.";
      toast.error(message);
    } finally {
      setLoading(false);
      setSaveStep("");
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={values.title}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="How to build a legal internship portfolio"
          disabled={loading}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title ? <p className="text-sm text-red-600">{errors.title}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" value={generatedSlug} readOnly disabled className="bg-slate-50" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={values.excerpt}
          onChange={(event) => updateField("excerpt", event.target.value)}
          placeholder="Short summary shown on blog cards."
          rows={3}
          disabled={loading}
          aria-invalid={Boolean(errors.excerpt)}
        />
        {errors.excerpt ? <p className="text-sm text-red-600">{errors.excerpt}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={values.content}
          onChange={(event) => updateField("content", event.target.value)}
          placeholder="Write the full blog content here."
          rows={10}
          disabled={loading}
          aria-invalid={Boolean(errors.content)}
        />
        {errors.content ? <p className="text-sm text-red-600">{errors.content}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={values.category}
            onChange={(event) => updateField("category", event.target.value)}
            disabled={loading}
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-invalid={Boolean(errors.category)}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category ? <p className="text-sm text-red-600">{errors.category}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={values.status}
            onChange={(event) => updateField("status", event.target.value as BlogStatus)}
            disabled={loading}
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">Cover Image</Label>
        <Input
          id="coverImage"
          type="file"
          accept="image/*"
          disabled={loading}
          onChange={(event) => {
            setImage(event.target.files?.[0] ?? null);
            setErrors((current) => ({ ...current, coverImage: undefined }));
          }}
          aria-invalid={Boolean(errors.coverImage)}
        />
        {blog?.coverImage && !image ? <p className="text-sm text-slate-500">Existing cover image will be kept.</p> : null}
        {errors.coverImage ? <p className="text-sm text-red-600">{errors.coverImage}</p> : null}
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={values.featured}
          onChange={(event) => updateField("featured", event.target.checked)}
          disabled={loading}
          className="h-4 w-4 rounded border-slate-300"
        />
        Featured Blog
      </label>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading || !generatedSlug} className="h-9 px-5">
          {loading ? saveStep || "Saving..." : isEditing ? "Save Changes" : values.status === "published" ? "Publish Blog" : "Save Draft"}
        </Button>
        <Button type="button" variant="outline" disabled={loading} onClick={() => router.push("/admin/blogs")} className="h-9 px-5">
          Cancel
        </Button>
      </div>
    </form>
  );
}