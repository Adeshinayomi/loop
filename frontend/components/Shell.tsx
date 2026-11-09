"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Search,
  MessageCircle,
  Bell,
  UserRound,
  Settings,
  Plus,
  LogOut,
  Menu,
  X,
  Search as SearchIcon,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useAuth } from "./AuthProvider";
import { PeopleList } from "./PeopleList";
const nav = [
  ["Home", "/home", Home],
  ["Explore", "/explore", Compass],
  ["Search", "/search", SearchIcon],
  // ["Messages", "/messages", MessageCircle],
  // ["Notifications", "/notifications", Bell],
  // ["Profile", "/profile", UserRound],
  // ["Connections", "/connections", Users],
  ["Settings", "/settings", Settings],
] as const;
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const name = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`
    : user?.username || "Loop member";
  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="side-brand">
          <Logo />
          <button className="mobile-close" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
        <nav>
          {nav.map(([label, href, Icon]) => (
            <Link
              onClick={() => setOpen(false)}
              className={`nav-link ${path === href ? "active" : ""}`}
              href={href}
              key={href}
            >
              <Icon size={18} />
              {label}
              {/* {label === "Notifications" && <i className="dot" />} */}
            </Link>
          ))}
        </nav>
        <Link className="button primary compose-link" href="/create">
          <Plus size={17} /> Create post
        </Link>
        <div className="side-bottom">
          <div className="mini-user">
            {user?.profilePicture ? (
              <img className="avatar" src={user.profilePicture} alt={user.firstName} />
            ) : (
              <div className="avatar">{name.slice(0, 1).toUpperCase()}</div>
            )}
            <div>
              <b>{name}</b>
              <small>@{user?.username || "loopuser"}</small>
            </div>
          </div>
          <button className="logout" onClick={logout}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setOpen(true)}>
            <Menu />
          </button>
          <Logo />
          <div className="top-search">
            <Search size={16} />
            <Link href="/search">Search Loop, people and posts</Link>
          </div>
          <Link href="/profile" className="avatar top-avatar">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.firstName} className="rounded-full"/>
            ) : (
              <div>{name.slice(0, 1).toUpperCase()}</div>
            )}
          </Link>
        </header>
        <main className="content-layout">
          <section className="page-content">{children}</section>
          <aside className="right-rail">
            <div className="rail-card prompt-card">
              <span className="eyebrow">A LITTLE REMINDER</span>
              <h3>What made you pause today?</h3>
              <p className="muted small">
                Your perspective deserves a place here. Share a thought, a
                photo, or a little win.
              </p>
              <Link href="/create" className="text-link">
                Create a post →
              </Link>
            </div>
            <div className="rail-card">
              <div className="between">
                <h3>People you may know</h3>
                <Link href="/explore" className="text-link">
                  See all
                </Link>
              </div>
              <PeopleList limit={4} compact />
            </div>
            <div className="rail-card trends">
              <h3>What's happening</h3>
              {["#LittleThings", "#CreativeLife", "#WeekendReads"].map((x) => (
                <p key={x}>
                  {x}
                  <small>Trending in Loop</small>
                </p>
              ))}
            </div>
            <p className="muted tiny">About · Privacy · Terms · © 2026 Loop</p>
          </aside>
        </main>
      </div>
      {open && (
        <button
          className="mobile-scrim"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <nav className="mobile-nav">
        {nav.slice(0, 5).map(([label, href, Icon]) => (
          <Link
            href={href}
            key={href}
            className={path === href ? "active" : ""}
          >
            <Icon size={19} />
            <small>{label}</small>
          </Link>
        ))}
      </nav>
    </div>
  );
}
