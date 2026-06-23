"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Heart, Share2, Plus, Hash } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const CHANNELS = [
  { id: "general", name: "General Discussion", color: "#3b82f6", bg: "#eff6ff" },
  { id: "internships", name: "Internships & Jobs", color: "#10b981", bg: "#ecfdf5" },
  { id: "moots", name: "Moot Courts", color: "#f59e0b", bg: "#fef3c7" },
  { id: "academics", name: "Academics & Exams", color: "#8b5cf6", bg: "#f3e8ff" },
];

const INITIAL_POSTS = [
  {
    id: "p1",
    authorId: "s1",
    authorName: "Priya Sharma",
    authorRole: "student",
    channel: "internships",
    content: "Any tips for the tier-1 firm interview rounds? Particularly the technical HR round at CAM.",
    likes: 12,
    comments: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likedByMe: false,
  },
  {
    id: "p2",
    authorId: "m1",
    authorName: "Rohan Mehta",
    authorRole: "mentor",
    channel: "general",
    content: "Just published a new guide on drafting commercial contracts. Check the resources tab. Happy to answer any questions here!",
    likes: 45,
    comments: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    likedByMe: true,
  },
];

export default function CommunityPage() {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState("all");
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostChannel, setNewPostChannel] = useState("general");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredPosts = activeChannel === "all" ? posts : posts.filter(p => p.channel === activeChannel);

  const handlePost = () => {
    if (!newPostContent.trim() || !user) return;
    const post = {
      id: Math.random().toString(),
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      channel: newPostChannel,
      content: newPostContent,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      likedByMe: false,
    };
    setPosts([post, ...posts]);
    setNewPostContent("");
    setIsDialogOpen(false);
    toast.success("Post published!");
  };

  const handleLike = (id: string) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.likedByMe ? p.likes - 1 : p.likes + 1, likedByMe: !p.likedByMe };
      }
      return p;
    }));
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto", fontFamily: "var(--font-jakarta,system-ui,sans-serif)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 8 }}>Community</h1>
          <p style={{ fontSize: 16, color: "#64748b", maxWidth: 600 }}>
            Discuss, collaborate, and grow with a network of ambitious law students and mentors.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "linear-gradient(135deg,#1e3a5f,#2563eb)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.25)", transition: "transform .15s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = ""}
          >
            <Plus size={18} /> New Post
          </DialogTrigger>
          <DialogContent style={{ borderRadius: 20, padding: 32 }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>Create a Post</DialogTitle>
            </DialogHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 8 }}>Select Channel</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {CHANNELS.map(c => (
                    <button key={c.id} onClick={() => setNewPostChannel(c.id)}
                      style={{ padding: "10px", borderRadius: 10, border: `1px solid ${newPostChannel === c.id ? c.color : "#e2e8f0"}`, background: newPostChannel === c.id ? c.bg : "#fff", color: newPostChannel === c.id ? c.color : "#475569", fontWeight: newPostChannel === c.id ? 700 : 500, fontSize: 13, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                      <Hash size={14} /> {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 8 }}>Your Message</label>
                <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} placeholder="What's on your mind?"
                  style={{ width: "100%", padding: "14px", borderRadius: 12, border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: 14, minHeight: 120, resize: "vertical", outline: "none", fontFamily: "inherit" }}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <button onClick={handlePost} disabled={!newPostContent.trim()}
                style={{ width: "100%", padding: "14px", background: newPostContent.trim() ? "linear-gradient(135deg,#1e3a5f,#2563eb)" : "#cbd5e1", color: "#fff", border: "none", borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: newPostContent.trim() ? "pointer" : "not-allowed" }}>
                Publish Post
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 32 }}>
        {/* Left sidebar - Channels */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, paddingLeft: 12 }}>Channels</div>
          
          <button onClick={() => setActiveChannel("all")}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, border: "none", background: activeChannel === "all" ? "#1e3a5f" : "transparent", color: activeChannel === "all" ? "#fff" : "#475569", fontWeight: activeChannel === "all" ? 700 : 500, fontSize: 14, cursor: "pointer", textAlign: "left" }}>
            <Hash size={16} /> All Posts
          </button>
          
          {CHANNELS.map(c => (
            <button key={c.id} onClick={() => setActiveChannel(c.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, border: "none", background: activeChannel === c.id ? c.bg : "transparent", color: activeChannel === c.id ? c.color : "#475569", fontWeight: activeChannel === c.id ? 700 : 500, fontSize: 14, cursor: "pointer", textAlign: "left", transition: "background .15s" }}
              onMouseEnter={e => { if (activeChannel !== c.id) e.currentTarget.style.background = "#f1f5f9" }}
              onMouseLeave={e => { if (activeChannel !== c.id) e.currentTarget.style.background = "transparent" }}>
              <Hash size={16} /> {c.name}
            </button>
          ))}
        </div>

        {/* Right - Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {filteredPosts.map(post => {
            const channelInfo = CHANNELS.find(c => c.id === post.channel);
            
            return (
              <div key={post.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(15,30,58,0.03)" }} className="card-hover">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar style={{ width: 44, height: 44, border: "2px solid #f1f5f9" }}>
                      <AvatarFallback style={{ background: post.authorRole === "mentor" ? "#8b5cf6" : "#3b82f6", color: "#fff", fontWeight: 700 }}>
                        {post.authorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{post.authorName}</span>
                        {post.authorRole === "mentor" && (
                          <span style={{ fontSize: 10, fontWeight: 800, background: "#ede9fe", color: "#6d28d9", padding: "2px 8px", borderRadius: 99, textTransform: "uppercase" }}>Mentor</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{formatDistanceToNow(new Date(post.createdAt))} ago</div>
                    </div>
                  </div>
                  {channelInfo && (
                    <div style={{ fontSize: 11, fontWeight: 700, background: channelInfo.bg, color: channelInfo.color, padding: "4px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 4 }}>
                      <Hash size={12} /> {channelInfo.name}
                    </div>
                  )}
                </div>
                
                <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.6, marginBottom: 20 }}>{post.content}</p>
                
                <div style={{ display: "flex", alignItems: "center", gap: 20, borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
                  <button onClick={() => handleLike(post.id)}
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: post.likedByMe ? "#ef4444" : "#64748b", fontWeight: 600, fontSize: 13, transition: "color .15s" }}>
                    <Heart size={18} fill={post.likedByMe ? "#ef4444" : "none"} style={{ transition: "transform .2s", transform: post.likedByMe ? "scale(1.1)" : "scale(1)" }} /> 
                    {post.likes}
                  </button>
                  <button style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#64748b", fontWeight: 600, fontSize: 13, transition: "color .15s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#3b82f6"}
                    onMouseLeave={e => e.currentTarget.style.color = "#64748b"}>
                    <MessageSquare size={18} /> {post.comments} Comments
                  </button>
                  <button style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#64748b", fontWeight: 600, fontSize: 13, marginLeft: "auto" }}>
                    <Share2 size={16} /> Share
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
