"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  ImagePlus,
  Send,
  UserRound,
  Settings as SettingsIcon,
  Compass,
  Users,
  Bell,
  MessageCircle,
  Camera,
  Save,
  Lock,
  SlidersHorizontal,
  Clock3,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "./AuthProvider";
import { PostCard } from "./PostCard";
import { PeopleList } from "./PeopleList";
import type { Post } from "@/lib/types";
export function CreatePost() {
  const { token } = useAuth();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setMsg("Please sign in first.");
      return;
    }
    const body = new FormData();
    body.append("content", content);
    Array.from(images || []).forEach((f) => body.append("images", f));
    setBusy(true);
    try {
      await api("/posts/createpost", { method: "POST", token, body });
      setMsg("Your post has been published.");
      setContent("");
      setImages(null);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not publish post.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Heading
        eyebrow="CREATE A POST"
        title="A moment worth sharing."
        subtitle="Share a thought, a photo, or something that made your day."
      />
      <form className="surface-card create-form" onSubmit={submit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening in your world?"
          rows={7}
        />
        <label className="upload-box">
          <ImagePlus /> Add photos (up to 5)
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => setImages(e.target.files)}
          />
        </label>
        {images?.length ? (
          <p className="muted small">{images.length} image(s) selected</p>
        ) : null}
        <div className="between">
          <span className="muted small">Be kind. Keep it Loop.</span>
          <button disabled={busy} className="button primary">
            {busy ? "Publishing..." : "Publish post"}
          </button>
        </div>
        {msg && <p className="notice">{msg}</p>}
      </form>
    </>
  );
}
export function Explore() {
  const { token, ready } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [activeTab, setActiveTab] = useState<"for-you" | "recent" | "popular">("for-you");
  const [peopleQuery, setPeopleQuery] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    if (!ready) return;
    if (!token) {
      setPosts([]);
      setLoading(false);
      setError("Please sign in to explore Loop.");
      return;
    }
    let active = true;
    setLoading(true);
    setError("");
    api<{ posts: Post[] }>("/posts/getall", { token })
      .then((data) => {
        if (active) setPosts(data.posts || []);
      })
      .catch((err) => {
        if (active)
          setError(
            err instanceof Error
              ? err.message
              : "Could not load Explore posts.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token, ready, reloadKey]);
const explorePosts = [...posts].sort((a, b) => {
  const dateA = new Date(a.createdAt || 0).getTime();
  const dateB = new Date(b.createdAt || 0).getTime();

  if (activeTab === "recent") {
    return dateB - dateA;
  }

  if (activeTab === "popular") {
    return (b.likesCount || 0) - (a.likesCount || 0)
      || (b.commentsCount || 0) - (a.commentsCount || 0)
      || dateB - dateA;
  }

  // For You: engagement + freshness
  const now = Date.now();

  const score = (post: Post) => {
    const ageInHours = Math.max(
      (now - new Date(post.createdAt || 0).getTime()) / 3600000,
      1
    );

    const engagement =
      (post.likesCount || 0) * 2 +
      (post.commentsCount || 0) * 3;

    return engagement / Math.pow(ageInHours + 2, 0.5);
  };

  return score(b) - score(a);
});
  return (
    <>
      <Heading
        eyebrow="EXPLORE"
        title="Follow your curiosity."
        subtitle="Discover posts, perspectives and people from across Loop."
      />
      <div className="explore-banner">
        <div>
          <span>YOUR NEXT RABBIT HOLE</span>
          <h2>
            There is a whole world
            <br />
            waiting to be discovered.
          </h2>
        </div>
      </div>
      <section className="explore-people surface-card">
        <div className="between">
          <div>
            <h2>Find people</h2>
            <p className="muted small">
              Search for people you haven't connected with yet.
            </p>
          </div>
          <Users size={20} />
        </div>
        <label className="search-box explore-search">
          <Search size={17} />
          <input
            value={peopleQuery}
            onChange={(e) => setPeopleQuery(e.target.value)}
            placeholder="Search names or usernames..."
            aria-label="Search people on Loop"
          />
        </label>
        <PeopleList query={peopleQuery} limit={8} />
      </section>
      <div className="section-title explore-feed-heading">
        <div>
          <h2>Discover posts</h2>
          <p className="muted small">See what the Loop community is sharing.</p>
        </div>
        <button
          className="icon-button explore-refresh"
          type="button"
          onClick={() => setReloadKey((x) => x + 1)}
          disabled={loading}
          aria-label="Refresh posts"
        >
          <RefreshCw size={17} />
        </button>
      </div>
<div className="flex gap-3">
  <button
    onClick={() => setActiveTab("for-you")}
    className={activeTab === "for-you" ? "active-tab" : "inactive-tab"}
  >
    For You
  </button>

  <button
    onClick={() => setActiveTab("recent")}
    className={activeTab === "recent" ? "active-tab" : "inactive-tab"}
  >
    Recent
  </button>

  <button
    onClick={() => setActiveTab("popular")}
    className={activeTab === "popular" ? "active-tab" : "inactive-tab"}
  >
    Popular
  </button>
</div>
      {loading ? (
        <div className="loading">Loading posts from Loop...</div>
      ) : error ? (
        <div className="empty-state">
          <h3>Explore couldn't load</h3>
          <p>{error}</p>
          <button
            className="button primary"
            onClick={() => setReloadKey((x) => x + 1)}
          >
            Try again
          </button>
        </div>
      ) : explorePosts.length ? (
        <div className="post-list">
          {explorePosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>Nothing to explore just yet</h3>
          <p>When people share public posts, you'll find them here.</p>
        </div>
      )}
    </>
  );
}
export function SearchPage() {
  return (
    <div className="surface-card">
      <h2>Search</h2>
      <PeopleList limit={20} />
    </div>
  );
}
export function Profile() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (token)
      api<any>("/posts/getposts", { token })
        .then((d) => setPosts(d.posts || []))
        .catch(() => {});
  }, [token]);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api("/users/update", {
        method: "PUT",
        token,
        body: JSON.stringify({
          firstName: user?.firstName,
          lastName: user?.lastName,
          bio,
          location,
        }),
      });
      setMsg("Profile updated.");
      setEditing(false);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not update profile.");
    }
  }
  return (
    <>
      <Heading
        eyebrow="YOUR PROFILE"
        title={user?.username ? `@${user.username}` : "Your profile"}
        subtitle="A little space that feels like you."
      />
      <div className="profile-cover" />
      <div className="profile-card">
      {user?.profilePicture ? <img className="avatar profile-avatar profile-avatar-image" src={user.profilePicture} alt={user.firstName} /> : <div className="avatar profile-avatar">{user?.firstName?.[0]?.toUpperCase()}</div>}
        <div className="between profile-actions">
          <div>
            <h2>
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="muted">@{user?.username || "loopuser"}</p>
          </div>
          <button
            className="button outline"
            onClick={() => setEditing(!editing)}
          >
            Edit profile
          </button>
        </div>
        <p>{bio || "Add a little about yourself."}</p>
        <p className="muted small">{location}</p>
        <div className="stats-row">
          <span>
            <b>{posts.length}</b> posts
          </span>
          <span>
            <b>{user?.followersCount || 0}</b> followers
          </span>
          <span>
            <b>{user?.followingCount || 0}</b> following
          </span>
        </div>
        {editing && (
          <form onSubmit={save} className="edit-form">
            <label>
              Bio
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={250}
              />
            </label>
            <label>
              Location
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </label>
            <button className="button primary">Save changes</button>
          </form>
        )}
        {msg && <p className="notice">{msg}</p>}
      </div>
      <div className="section-title">
        <h2>Your posts</h2>
      </div>
      {posts.length ? (
        posts.map((p) => <PostCard key={p._id} post={p} />)
      ) : (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <Link href="/create" className="text-link">
            Share your first moment →
          </Link>
        </div>
      )}
    </>
  );
}
export function Connections() {
  const { user } = useAuth();
  return (
    <>
      <Heading
        eyebrow="YOUR CONNECTIONS"
        title="Your corner of the internet."
        subtitle="The people who make Loop feel like home."
      />
      <div className="two-cards">
        <div className="surface-card">
          <div className="between">
            <h2>Followers</h2>
            <span className="accent">0</span>
          </div>
          <PeopleList limit={8} />
        </div>
        <div className="surface-card">
          <div className="between">
            <h2>Following</h2>
            <span className="accent">{user?.followingCount || 0}</span>
          </div>
          <PeopleList limit={8} />
        </div>
      </div>
    </>
  );
}
export function Messages() {
  const [selected, setSelected] = useState("");
  return (
    <>
      <Heading
        eyebrow="MESSAGES"
        title="Good conversations start with hello."
        subtitle="Your private conversations, all in one place."
      />
      <div className="messages-layout">
        <div className="surface-card message-list">
          <h2>Messages</h2>
          {["Maya Chen", "Alex Morgan", "Sam Rivera"].map((n) => (
            <button
              className={`conversation ${selected === n ? "selected" : ""}`}
              key={n}
              onClick={() => setSelected(n)}
            >
              <div className="avatar">{n[0]}</div>
              <span>
                <b>{n}</b>
                <small>Say hello and start a conversation</small>
              </span>
            </button>
          ))}
        </div>
        <div className="surface-card message-empty">
          <MessageCircle size={36} />
          <h2>{selected || "A good conversation starts with hello."}</h2>
          <p className="muted">
            Messaging UI preview. Your backend does not currently expose message
            endpoints, so messages are not sent or stored yet.
          </p>
        </div>
      </div>
    </>
  );
}
export function Notifications() {
  return (
    <>
      <Heading
        eyebrow="NOTIFICATIONS"
        title="You're part of the conversation."
        subtitle="A little update from your Loop community."
      />
      <div className="surface-card notification-list">
        {[
          "Maya Chen started following you.",
          "Alex Morgan liked your post.",
          "Sam Rivera commented: This is such a good perspective.",
          "Nora Williams mentioned you in a conversation.",
        ].map((n, i) => (
          <div className="notification" key={n}>
            <div className="avatar">{["M", "A", "S", "N"][i]}</div>
            <div>
              <p>{n}</p>
              <small className="muted">{i + 1}h ago</small>
            </div>
            <span className="unread-dot" />
          </div>
        ))}
      </div>
      <p className="muted tiny">
        These are sample notifications. Notification endpoints are not present
        in the supplied backend.
      </p>
    </>
  );
}
export function Settings() {
  const { user, token, logout } = useAuth();
  const [tab, setTab] = useState("Account");
  const [msg, setMsg] = useState("");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  async function change(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api("/users/changepassword", {
        method: "PATCH",
        token,
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      setMsg("Password changed successfully.");
      setCurrent("");
      setNext("");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not change password.");
    }
  }
  return (
    <>
      <Heading
        eyebrow="SETTINGS"
        title="Make Loop work for you."
        subtitle="Manage your account and preferences."
      />
      <div className="settings-layout">
        <div className="surface-card settings-tabs">
          {["Account", "Privacy & safety", "Notifications"].map((t) => (
            <button
              onClick={() => setTab(t)}
              className={tab === t ? "selected" : ""}
              key={t}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="surface-card settings-main">
          <h2>{tab}</h2>
          {tab === "Account" ? (
            <>
              <p className="muted small">
                Your personal information and sign-in details.
              </p>
              <div className="setting-line">
                <span>Username</span>
                <b>@{user?.username || "loopuser"}</b>
              </div>
              <div className="setting-line">
                <span>Email address</span>
                <b>{user?.email || "Not available"}</b>
              </div>
              <form onSubmit={change} className="edit-form">
                <h3>Change password</h3>
                <label>
                  Current password
                  <input
                    type="password"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    required
                  />
                </label>
                <label>
                  New password
                  <input
                    type="password"
                    minLength={6}
                    value={next}
                    onChange={(e) => setNext(e.target.value)}
                    required
                  />
                </label>
                <button className="button primary">Update password</button>
              </form>
            </>
          ) : (
            <div className="setting-line">
              <span>
                {tab === "Privacy & safety"
                  ? "Profile visibility"
                  : "Email notifications"}
              </span>
              <span className="muted">
                Preference controls will be connected when backend settings are
                available.
              </span>
            </div>
          )}
          {msg && <p className="notice">{msg}</p>}
          <button className="button outline" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
function Heading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="muted">{subtitle}</p>
    </div>
  );
}
