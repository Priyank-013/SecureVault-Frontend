import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import PasswordStrength from "../components/PasswordStrength";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.register(email, password);
      if (!response.ok) throw new Error(await api.parseError(response));

      setSuccess("Account created. Redirecting to login...");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login"), 1600);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
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
          <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>Create your vault</h2>
          <p className="text-secondary" style={{ fontSize: "12.5px", marginBottom: "20px" }}>
            Start storing secrets securely
          </p>

          {error && <div className="alert-error">{error}</div>}
          {success && <div className="alert-success">{success}</div>}

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
      placeholder="Min 6 characters"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="input-field"
      style={{ paddingRight: "40px" }}
      required
      minLength="6"
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
  <PasswordStrength password={password} />
</div>
           <div>
  <label className="field-label">Confirm password</label>
  <div style={{ position: "relative" }}>
    <input
      type={showConfirmPassword ? "text" : "password"}
      placeholder="••••••••"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="input-field"
      style={{ paddingRight: "40px" }}
      required
      disabled={loading}
    />
    <button
      type="button"
      onClick={() => setShowConfirmPassword((prev) => !prev)}
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
      {showConfirmPassword ? (
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
            <button type="submit" className="btn-primary" style={{ justifyContent: "center", marginTop: "4px" }} disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-secondary" style={{ marginTop: "18px", fontSize: "13px", textAlign: "center" }}>
            Already have an account?{" "}
            <span className="text-accent" style={{ cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("/login")}>
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
