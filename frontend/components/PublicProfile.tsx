
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { api } from "@/lib/api";
import { PostCard } from "./PostCard";
import type { Post, User } from "@/lib/types";

type PublicUser = User & {
  _id: string;
  isFollowing?: boolean;
  followersCount?: number;
  followingCount?: number;
};

export function PublicProfile({ userId }: { userId: string }) {
  const { token, user: currentUser } = useAuth();

  const [person, setPerson] = useState<PublicUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwnProfile = currentUserId === userId;

  // Fetch profile and posts
  const fetchProfile = useCallback(async () => {
    if (!token || !userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [profileData, postData] = await Promise.all([
        api<{ user: PublicUser }>(`/users/${userId}`, {
          token,
        }),

        api<{ posts: Post[] }>(`/posts/user/${userId}`, {
          token,
        }),
      ]);

      setPerson(profileData.user);
      setPosts(postData.posts || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load this profile."
      );

      setPerson(null);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!token || !userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [profileData, postData] = await Promise.all([
          api<{ user: PublicUser }>(`/users/${userId}`, {
            token,
          }),

          api<{ posts: Post[] }>(`/posts/user/${userId}`, {
            token,
          }),
        ]);

        if (!active) return;

        setPerson(profileData.user);
        setPosts(postData.posts || []);
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : "Could not load this profile."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [token, userId]);

  // Follow / Unfollow
  async function toggleFollow() {
    if (!token || !person || busy || isOwnProfile) return;

    setBusy(true);
    setError("");

    const wasFollowing = Boolean(person.isFollowing);

    try {
      if (wasFollowing) {
        await api(`/${userId}/unfollow`, {
          method: "DELETE",
          token,
        });
      } else {
        await api(`/${userId}/follow`, {
          method: "POST",
          token,
        });
      }

      setPerson((current) => {
        if (!current) return current;

        return {
          ...current,
          isFollowing: !wasFollowing,
          followersCount: Math.max(
            0,
            (current.followersCount || 0) +
              (wasFollowing ? -1 : 1)
          ),
        };
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update follow status."
      );
    } finally {
      setBusy(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="loading">
        Loading profile...
      </div>
    );
  }

  // Authentication state
  if (!token) {
    return (
      <div className="empty-state">
        <h2>Login required</h2>
        <p>Please log in to view this profile.</p>
        <Link href="/login" className="text-link">
          Go to login
        </Link>
      </div>
    );
  }

  // Error state
  if (error && !person) {
    return (
      <div className="empty-state">
        <h2>Couldn't open this profile</h2>
        <p>{error}</p>

        <button
          className="button primary"
          onClick={fetchProfile}
        >
          Try again
        </button>

        <Link href="/search" className="text-link">
          Back to search
        </Link>
      </div>
    );
  }

  if (!person) return null;

  const name =
    `${person.firstName || ""} ${person.lastName || ""}`.trim() ||
    person.username ||
    "Loop member";

  const avatar = person.profilePicture;

  return (
    <>
      {/* Profile heading */}
      <div className="page-heading">
        <p className="eyebrow">LOOP MEMBER</p>
        <h1>{name}</h1>
        <p className="muted">
          A little space that feels like them.
        </p>
      </div>

      {/* Cover */}
      <div className="profile-cover" />

      {/* Profile information */}
      <section className="profile-card">

        {/* Avatar */}
        {avatar ? (
          <img
            className="avatar profile-avatar profile-avatar-image"
            src={avatar}
            alt={`${name}'s profile picture`}
          />
        ) : (
          <div className="avatar profile-avatar">
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Name and follow button */}
        <div className="between profile-actions">
          <div>
            <h2>{name}</h2>
            <p className="muted">@{person.username}</p>
          </div>

          {!isOwnProfile && (
            <button
              className={
                person.isFollowing
                  ? "button outline"
                  : "button primary"
              }
              onClick={toggleFollow}
              disabled={busy}
            >
              {busy
                ? "Please wait..."
                : person.isFollowing
                  ? "Following"
                  : "Follow"}
            </button>
          )}

          {isOwnProfile && (
            <Link
              href="/settings"
              className="button outline"
            >
              Edit profile
            </Link>
          )}
        </div>

        {/* Bio */}
        <p>
          {person.bio || "This person hasn't added a bio yet."}
        </p>

        {person.location && (
          <p className="muted small">
            {person.location}
          </p>
        )}

        {/* Profile statistics */}
        <div className="stats-row">
          <span>
            <b>{posts.length}</b> posts
          </span>

          <span>
            <b>{person.followersCount || 0}</b> followers
          </span>

          <span>
            <b>{person.followingCount || 0}</b> following
          </span>
        </div>

        {error && (
          <p className="error">{error}</p>
        )}
      </section>

      {/* User posts */}
      <div className="section-title">
        <h2>{name.split(" ")[0]}'s posts</h2>
      </div>

      {posts.length > 0 ? (
        <div className="post-list">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <p>
            {name} hasn't shared anything on Loop yet.
          </p>
        </div>
      )}
    </>
  );
}
