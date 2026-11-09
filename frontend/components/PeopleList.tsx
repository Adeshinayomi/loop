"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

type DiscoverableUser = User & { _id: string; isFollowing?: boolean };
type UsersResponse = { users: DiscoverableUser[] };

function displayName(user: User) {
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return fullName || user.username || "Loop member";
}

function Avatar({ user }: { user: User }) {
  const name = displayName(user);
  return user.profilePicture ? (
    <img className="avatar person-avatar-image" src={user.profilePicture} alt={`${name}'s profile`} />
  ) : (
    <span className="avatar">{name.charAt(0).toUpperCase()}</span>
  );
}

export function PeopleList({ query = "", limit = 10, compact = false }: { query?: string; limit?: number; compact?: boolean }) {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<DiscoverableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyIds, setBusyIds] = useState<string[]>([]);

  useEffect(() => {
    if (!token) {
      setUsers([]);
      setLoading(false);
      return;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ q: query.trim(), limit: String(limit) });
        const data = await api<UsersResponse>(`/users/search?${params.toString()}`, { token });
        if (active) setUsers(data.users || []);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Could not load users.");
      } finally {
        if (active) setLoading(false);
      }
    }, query.trim() ? 250 : 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, limit, token]);

  async function toggleFollow(person: DiscoverableUser) {
    if (!token || busyIds.includes(person._id)) return;
    setBusyIds((ids) => [...ids, person._id]);
    try {
      if (person.isFollowing) {
        await api(`/${person._id}/unfollow`, { method: "DELETE", token });
      } else {
        await api(`/${person._id}/follow`, { method: "POST", token });
      }
      setUsers((current) => current.map((item) => item._id === person._id
        ? { ...item, isFollowing: !item.isFollowing, followersCount: Math.max(0, (item.followersCount || 0) + (item.isFollowing ? -1 : 1)) }
        : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update follow status.");
    } finally {
      setBusyIds((ids) => ids.filter((id) => id !== person._id));
    }
  }

  if (loading) return <p className="muted small people-state">Finding people on Loop...</p>;
  if (error) return <p className="error people-state">{error}</p>;
  if (!users.length) return <p className="muted small people-state">{query.trim() ? "No users matched your search." : "No other users to suggest yet. Invite someone to join Loop!"}</p>;

  return (
    <div className={compact ? "people-list people-list-compact" : "people-list"}>
      {users.map((person) => {
        const name = displayName(person);
        const isSelf = person._id === (currentUser?._id || currentUser?.id);
        return (
          <div className="person-row" key={person._id}>
            <Link href={`/profile/${person._id}`} className="person-avatar-link" aria-label={`View ${name}'s profile`}>
              <Avatar user={person} />
            </Link>
            <div className="person-info">
              <Link href={`/profile/${person._id}`} className="person-name-link"><b>{name}</b></Link>
              <small>@{person.username || "loopmember"}</small>
              {!compact && person.bio ? <small className="person-bio">{person.bio}</small> : null}
            </div>
            {!isSelf && (
              <button
                type="button"
                className={person.isFollowing ? "button outline small-button" : "button primary small-button"}
                onClick={() => toggleFollow(person)}
                disabled={busyIds.includes(person._id)}
              >
                {busyIds.includes(person._id) ? "..." : person.isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
