import BlogForm from "@/components/blog/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Create Blog
      </h1>

      <BlogForm />
    </div>
  );
}