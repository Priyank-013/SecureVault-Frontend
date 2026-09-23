import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DEMO_STATES = [
  { key: "encrypted", label: "Encrypted", tone: "accent" },
  { key: "shared",    label: "Share link ready", tone: "accent" },
  { key: "expired",   label: "Link expired", tone: "neutral" },
];

const CAPTIONS = [
  "Secrets stay encrypted.",
  "Links expire after one use.",
  "Nothing touches plaintext.",
  "Every access is logged with IP and time.",
];

function TypingCaption() {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = CAPTIONS[textIndex];
    let timeout;

    if (!deleting && charIndex < full.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), 55);
    } else if (!deleting && charIndex === full.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), 30);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setTextIndex((i) => (i + 1) % CAPTIONS.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex]);

  return (
    <p className="demo-caption">
      <span className="typing-text">{CAPTIONS[textIndex].slice(0, charIndex)}</span>
      <span className="typing-cursor" />
    </p>
  );
}

function Home() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % DEMO_STATES.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const handleGuestMode = () => {
    sessionStorage.setItem("guestMode", "true");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/dashboard");
  };

  const current = DEMO_STATES[step];

  return (
    <div className="landing-wrap">
      <div className="landing-hero">
        <span className="landing-badge fade-in" style={{ animationDelay: "0.05s" }}>
          AES-256-GCM · JWT AUTH
        </span>

        <h1 className="landing-title fade-in" style={{ animationDelay: "0.1s" }}>
          Secure<span>Vault</span>
        </h1>

        <p className="landing-sub fade-in" style={{ animationDelay: "0.15s" }}>
          Store, protect, and share your secrets securely.
          Built for developers who take their{" "}
          <code className="landing-code">.env</code> files seriously.
        </p>

        <div className="landing-actions fade-in" style={{ animationDelay: "0.2s" }}>
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Log in
          </button>
          <button className="btn-secondary" onClick={() => navigate("/signup")}>
            Create account
          </button>
          <button className="btn-ghost" onClick={handleGuestMode}>
            Guest →
          </button>
        </div>
      </div>

      <div className="landing-demo">
        <div className="demo-card">
          <div className="demo-card-header">
            <span className={`demo-status demo-status-${current.tone}`}>
              {current.label}
            </span>
            <div className="demo-dots">
              {DEMO_STATES.map((s, i) => (
                <span
                  key={s.key}
                  className={`demo-dot ${i === step ? "active" : ""}`}
                />
              ))}
            </div>
          </div>

          <div className="demo-stage">
            {current.key === "encrypted" && (
              <div className="demo-state demo-fade" key="encrypted">
                <div className="demo-row">
                  <span className="demo-name mono">DATABASE_URL</span>
                  <span className="badge badge-accent">AES-256</span>
                </div>
                <div className="demo-value mono">
                  ••••••••••••••••••••••••
                </div>
                <div className="demo-actions">
                  <span className="demo-btn">Reveal</span>
                  <span className="demo-btn">Copy</span>
                  <span className="demo-btn">Share</span>
                </div>
              </div>
            )}

            {current.key === "shared" && (
              <div className="demo-state demo-fade" key="shared">
                <p className="demo-line text-secondary">
                  Single-use link created
                </p>
                <div className="demo-chip demo-chip-active mono">
                  Copy one-time link
                </div>
                <div className="demo-actions">
                  <span className="demo-btn">Cancel</span>
                </div>
              </div>
            )}

            {current.key === "expired" && (
              <div className="demo-state demo-fade" key="expired">
                <p className="demo-line text-secondary">
                  Link consumed by one viewer
                </p>
                <div className="demo-chip demo-chip-dead mono">
                  Link no longer valid
                </div>
                <div className="demo-actions">
                  <span className="demo-btn demo-btn-primary">Generate new</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <TypingCaption />
      </div>

      <div className="landing-features fade-in" style={{ animationDelay: "0.3s" }}>
        <span>AES-256-GCM</span>
        <span>JWT Auth</span>
        <span>Redis Cache</span>
        <span>One-Time Links</span>
        <span>Access Logs</span>
      </div>
    </div>
  );
}

export default Home;