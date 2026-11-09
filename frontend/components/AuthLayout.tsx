import { Logo } from "./Logo";
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-page">
      <header className="auth-top">
        <Logo />
        <span className="muted small">Your little corner of the internet.</span>
      </header>
      <section className="auth-grid">
        <div className="auth-visual">
          <div className="visual-copy">
            <p>GOOD PEOPLE. GOOD ENERGY.</p>
            <h2>
              Your people.
              <br />
              Your perspective.
              <br />
              Your little corner.
            </h2>
            <span>Good company starts here.</span>
          </div>
        </div>
        <div className="auth-panel">{children}</div>
      </section>
    </main>
  );
}
