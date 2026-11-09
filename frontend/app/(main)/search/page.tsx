"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { PeopleList } from "@/components/PeopleList";

export default function Page() {
  const [query, setQuery] = useState("");
  return <>
    <div className="page-heading">
      <p className="eyebrow">SEARCH</p>
      <h1>Find your people.</h1>
      <p className="muted">Search Loop by name or username and discover people to connect with.</p>
    </div>
    <label className="search-box">
      <Search size={18} />
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or username..." aria-label="Search users" />
    </label>
    <div className="section-title"><h2>{query.trim() ? `People matching “${query}”` : "People you might like"}</h2></div>
    <div className="surface-card"><PeopleList query={query} limit={20} /></div>
  </>;
}
