import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await api.login(email, password);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Login failed. Please check your credentials.");
    }

    const data = await response.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("userEmail", data.email);
    sessionStorage.removeItem("guestMode");
    navigate("/dashboard");

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-wrap">
      <div style={{ width: "360px" }}>
        <div className="auth-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <span className="auth-logo-mark">🔐</span>
          SecureVault
        </div>

        <div className="card">
          <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>Welcome back</h2>
          <p className="text-secondary" style={{ fontSize: "12.5px", marginBottom: "20px" }}>
            Log in to access your vault
          </p>

          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="field-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  style={{ paddingRight: "40px" }}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  tabIndex={-1}
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
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ justifyContent: "center", marginTop: "4px" }} 
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-secondary" style={{ marginTop: "18px", fontSize: "13px", textAlign: "center" }}>
            Don't have an account?{" "}
            <span className="text-accent" style={{ cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("/signup")}>
              Sign up
            </span>
          </p>
          <p className="text-secondary" style={{ marginTop: "8px", fontSize: "13px", textAlign: "center" }}>
            <span
              className="text-accent"
              style={{ cursor: "pointer", fontWeight: 600 }}
              onClick={() => {
                sessionStorage.setItem("guestMode", "true");
                navigate("/dashboard");
              }}
            >
              Continue as guest →
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;