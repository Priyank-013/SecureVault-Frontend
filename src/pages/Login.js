import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const emailRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.login(email, password);
      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email);
      sessionStorage.removeItem("guestMode");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    sessionStorage.setItem("guestMode", "true");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/dashboard");
  };

  return (
    <div className="login-page">

      <div className="login-shell">
        <div
          className="login-wordmark"
          onClick={() => navigate("/")}
        >
          Secure<span>Vault</span>
        </div>

        <p className="login-tagline">Log in to your vault</p>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className={`login-field ${focusedField === "email" ? "is-focused" : ""}`}>
            <label className="login-label" htmlFor="email">Email</label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className="login-input"
              required
              disabled={loading}
              spellCheck={false}
            />
            <span className="login-underline" />
          </div>

          <div className={`login-field ${focusedField === "password" ? "is-focused" : ""}`}>
            <label className="login-label" htmlFor="password">Password</label>
            <div className="login-password-row">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className="login-input"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPassword((s) => !s)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <span className="login-underline" />
          </div>

          <button
            type="submit"
            className="btn-primary login-submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="login-footer">
  <div className="login-footer-row">
    <span className="login-footer-text">Don't have a vault?</span>
    <button className="login-link-accent" onClick={() => navigate("/signup")}>
      Sign up →
    </button>
  </div>

  <div className="login-footer-divider" />

  <div className="login-footer-row login-footer-row-dim">
    <button className="login-link-dim" onClick={handleGuestMode}>
      or explore as guest →
    </button>
  </div>
</div>
      </div>
    </div>
  );
}

export default Login;