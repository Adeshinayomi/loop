"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, UserRound } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "./AuthProvider";
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const signup = mode === "signup";
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const { setSession } = useAuth();
  const change = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data: any = await api(signup ? "/users/create" : "/users/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (signup) {
        router.push("/login");
        return;
      }
      if (!data.token) throw new Error("The backend did not return a token.");
      setSession(data.token, data.user);
      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="auth-form">
      <div>
        <p className="eyebrow">
          {signup ? "YOUR PEOPLE ARE HERE" : "WELCOME BACK TO LOOP"}
        </p>
        <h1>
          {signup ? "Find your kind of people." : "Pick up where you left off."}
        </h1>
        <p className="muted">
          {signup
            ? "Create your corner of the internet."
            : "Your people, your conversations, your daily inspiration."}
        </p>
      </div>
      {signup && (
        <div className="field-grid">
          <label>
            First name
            <input
              name="firstName"
              required
              value={form.firstName}
              onChange={change}
              placeholder="Jane"
            />
          </label>
          <label>
            Last name
            <input
              name="lastName"
              required
              value={form.lastName}
              onChange={change}
              placeholder="Doe"
            />
          </label>
        </div>
      )}
      {signup && (
        <label>
          Username
          <input
            name="username"
            required
            value={form.username}
            onChange={change}
            placeholder="janedoe"
          />
        </label>
      )}
      <label>
        Email address
        <span className="input-icon">
          <Mail size={17} />
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={change}
            placeholder="jane@example.com"
          />
        </span>
      </label>
      <label>
        Password
        <span className="input-icon">
          <Lock size={17} />
          <input
            name="password"
            type={show ? "text" : "password"}
            minLength={6}
            required
            value={form.password}
            onChange={change}
            placeholder="At least 6 characters"
          />
          <button
            type="button"
            className="icon-button"
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </span>
      </label>
      {error && <p className="error">{error}</p>}
      {!signup && (
        <div className="between small">
          <label className="check">
            <input type="checkbox" /> Remember me
          </label>
          <span className="accent">Forgot password?</span>
        </div>
      )}
      <button className="button primary full" disabled={busy}>
        {busy ? "Please wait..." : signup ? "Create my account" : "Sign in"}
      </button>
      <p className="muted small center">
        {signup ? "Already have an account? " : "New around here? "}
        <Link className="accent" href={signup ? "/login" : "/signup"}>
          {signup ? "Sign in" : "Join Loop"}
        </Link>
      </p>
    </form>
  );
}
