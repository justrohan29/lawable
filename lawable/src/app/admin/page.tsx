"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, FileText, Upload } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy, doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, "blog"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setPosts(data);
    } catch (error) {
      console.warn("Failed to fetch blog posts. Mocking data.");
      setPosts([
        { id: "b1", title: "How to draft a term sheet", status: "published", author: "Admin", createdAt: new Date() },
        { id: "b2", title: "Navigating corporate law internships", status: "draft", author: "Admin", createdAt: new Date() }
      ]);
    }
    setLoading(false);
  };

  const createPost = async () => {
    try {
      const newId = `post_${Date.now()}`;
      await setDoc(doc(db, "blog", newId), {
        title: "Untitled Post",
        content: "",
        status: "draft",
        author: "Admin",
        createdAt: new Date(),
      });
      toast.success("Created new draft");
      fetchPosts();
    } catch (error) {
      toast.error("Failed to create post. Check Firebase keys.");
    }
  };

  return (
    <div className="p-8 pb-24 font-[family-name:var(--font-jakarta)] max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Blog Editor</h1>
          <p className="text-slate-500">Create content to drive SEO and educate the community.</p>
        </div>
        <button 
          onClick={createPost}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-blue-500/20"
        >
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium animate-pulse">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <FileText size={28} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No blog posts found</h3>
            <p className="text-slate-500 mb-6 max-w-md">Start writing articles to drive SEO traffic to your platform.</p>
            <button onClick={createPost} className="text-blue-600 font-bold hover:underline">Write a Post</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {post.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        post.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {post.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {post.author}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors mr-2">
                        <Edit size={16} />
                      </button>
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
