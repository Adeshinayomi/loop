"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ImagePlus, PenLine, LoaderCircle } from "lucide-react";
import { api, getToken } from "@/lib/api";
import type { Post } from "@/lib/types";
import { PostCard } from "./PostCard";
import { useAuth } from "./AuthProvider";
export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, user, ready } = useAuth();
  useEffect(() => {
    if (!ready) return;
    if (!token) {
      setLoading(false);
      return;
    }
    api<any>("/posts/getall", { token })
      .then((d) => setPosts(d.posts || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token, ready]);
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR LITTLE CORNER</p>
          <h1>A little closer to your world.</h1>
          <p className="muted">
            Good things happen when people share what matters.
          </p>
        </div>
      </div>
      <div className="quick-compose">
              {user?.profilePicture ? <img className="avatar" src={user.profilePicture} alt={user?.firstName} /> : <div className="avatar">{user?.firstName?.[0]?.toUpperCase()}</div>}
        <Link href="/create">What's on your mind?</Link>
        <Link href="/create" className="quick-photo">
          <ImagePlus size={17} /> Photo
        </Link>
      </div>
      {loading ? (
        <div className="loading">
          <LoaderCircle className="spin" /> Loading your feed...
        </div>
      ) : error ? (
        <div className="notice">
          {error}. Check that your backend is running and you're signed in.
        </div>
      ) : posts.length ? (
        <div className="post-list">
          {posts.map((p) => (
            <PostCard key={p._id} post={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <PenLine />
          </div>
          <h2>Your feed starts here.</h2>
          <p>
            Follow people or share your first post to get the conversation
            going.
          </p>
          <Link href="/create" className="button primary">
            Create a post
          </Link>
        </div>
      )}
    </>
  );
}
