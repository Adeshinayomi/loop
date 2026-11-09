"use client";
import { useState } from "react";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Send,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "./AuthProvider";
import type { Post } from "@/lib/types";
export function PostCard({ post }: { post: Post }) {
  const { token, user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likesCount || 0);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [error, setError] = useState("");
  const author: any = post.author
  console.log("author", author)
  const authorName = author?.firstName
    ? `${author.firstName} ${author.lastName || ""}`
    : author?.username || "Loop member";
  async function toggleLike() {
    if (!token) {
      setError("Sign in to like posts.");
      return;
    }
    try {
      if (liked) {
        await api(`/like/unlike/${post._id}`, { method: "DELETE", token });
        setLikes((x) => Math.max(0, x - 1));
      } else {
        await api(`/like/likepost/${post._id}`, { method: "POST", token });
        setLikes((x) => x + 1);
      }
      setLiked(!liked);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update like.");
    }
  }
  async function loadComments() {
    setShowComments(!showComments);
    if (!showComments && token) {
      try {
        const d: any = await api(`/comment/getcomments/${post._id}`, { token });
        setComments(d.comments || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load comments.");
      }
    }
  }
  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim() || !token) return;
    try {
      const d: any = await api(`/comment/add/${post._id}`, {
        method: "POST",
        token,
        body: JSON.stringify({ content: comment }),
      });
      setComments([d.comment, ...comments]);
      setComment("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not comment.");
    }
  }
  return (
    <article className="post-card">
      <div className="post-head">
              {author.profilePicture ? <img className="avatar" src={author.profilePicture} alt={author.firstName} /> : <div className="avatar profile-avatar">{author.firstName[0]?.toUpperCase()}</div>}
        <div className="post-author">
          <b>{authorName}</b>
          <small>
            @{author?.username || "loopmember"} ·{" "}
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : "Just now"}
          </small>
        </div>
        <button className="icon-button">
          <MoreHorizontal />
        </button>
      </div>
      {post.content && <p className="post-copy">{post.content}</p>}
      {post.images?.[0]?.url && (
        <img
          className="post-image"
          src={post.images[0].url}
          alt="Post attachment"
        />
      )}
      <div className="post-actions">
        <button onClick={toggleLike} className={liked ? "liked" : ""}>
          <Heart size={17} fill={liked ? "currentColor" : "none"} />
          {likes}
        </button>
        <button onClick={loadComments}>
          <MessageCircle size={17} />
          {post.commentsCount || comments.length || 0}
        </button>
        <button>
          <Share2 size={17} /> Share
        </button>
      </div>
      {error && <p className="error small">{error}</p>}
      {showComments && (
        <div className="comments">
          <form onSubmit={addComment} className="comment-form">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <button className="icon-button">
              <Send size={16} />
            </button>
          </form>
          {comments.map((c) => (
            <div className="comment-row" key={c._id}>
              <b>{c.author?.username || "Someone"}</b>
              <span>{c.content}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
