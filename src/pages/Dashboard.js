import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import AddSecretModal from "../components/AddSecretModal";
import Toast from "../components/Toast";
import { QRCodeSVG as QRCode } from "qrcode.react";

let guestIdCounter = 1000;

function initials(email) {
  if (!email) return "G";
  return email.slice(0, 2).toUpperCase();
}

function Dashboard() {
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");
  const [revealed, setRevealed] = useState({});
  const [view, setView] = useState("secrets");
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [showQR, setShowQR] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");

  const loadDemoSecrets = useCallback(() => {
    setSecrets([
      { id: 1, name: "AWS_ACCESS_KEY", value: "sk_demo_123456789", encrypted: true },
      { id: 2, name: "DB_PASSWORD", value: "demo_db_pass_2024", encrypted: true },
      { id: 3, name: "JWT_SECRET", value: "demo_jwt_secret_key", encrypted: true },
    ]);
    setLoading(false);
  }, []);

  const loadRealSecrets = useCallback(async (tok) => {
    try {
      const response = await api.getSecrets(tok);
      if (!response.ok) throw new Error("Failed to fetch secrets");
      const data = await response.json();
      setSecrets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
    const guestMode = sessionStorage.getItem("guestMode");

    if (guestMode === "true") {
        setIsGuest(true);
        loadDemoSecrets();
        return;
    }

    if (!token) {
        navigate("/login");
        return;
    }

    loadRealSecrets(token);
}, [loadDemoSecrets, loadRealSecrets, navigate, token]);

  const handleAddSecret = async (name, value) => {
    if (isGuest) {
      const newSecret = { id: guestIdCounter++, name, value, encrypted: true };
      setSecrets((prev) => [newSecret, ...prev]);
      setToast("Secret added (demo — not saved)");
      return;
    }
    try {
      const response = await api.addSecret(token, name, value);
      if (!response.ok) throw new Error(await api.parseError(response));
      await loadRealSecrets(token);
      setToast("Secret saved");
    } catch (err) {
      setToast(err.message || "Could not save secret");
    }
  };

  const handleDelete = async (id) => {
    if (isGuest) {
      setSecrets((prev) => prev.filter((s) => s.id !== id));
      setToast("Secret removed (demo — not saved)");
      return;
    }
    try {
      const response = await api.deleteSecret(token, id);
      if (!response.ok) throw new Error(await api.parseError(response));
      setSecrets((prev) => prev.filter((s) => s.id !== id));
      setToast("Secret deleted");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast("Copied to clipboard");
    } catch {
      setToast("Could not copy — copy manually");
    }
  };

  const handleShare = async (id) => {
    if (isGuest) {
      setToast("Share not available in guest mode");
      return;
    }
    try {
      const response = await api.shareSecret(token, id);
      if (!response.ok) throw new Error(await api.parseError(response));
      const data = await response.json();
      const backendLink = data.link || "";
      const shareToken = backendLink.split("/").filter(Boolean).pop();
      const frontendLink = `${window.location.origin}/shared/${shareToken}`;
      setShareLink(frontendLink);
      setShowQR(true);
    } catch (err) {
      setToast(err.message || "Could not create share link");
    }
  };

  const handleViewLogs = async (id) => {
    if (isGuest) {
      setToast("Access logs not available in guest mode");
      return;
    }
    try {
      const response = await api.getLogs(token, id);
      if (!response.ok) throw new Error("Failed to fetch logs");
      const data = await response.json();
      setLogs(data);
      setView("logs");
    } catch (err) {
      setToast(err.message);
    }
  };

  const toggleReveal = (id) => {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    sessionStorage.removeItem("guestMode");
    navigate("/");
  };

  const filteredSecrets = secrets.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p className="text-secondary">Loading vault...</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          🔐 SecureVault
        </div>

        <div className={`sidebar-link ${view === "secrets" ? "active" : ""}`} onClick={() => setView("secrets")}>
          🗝️ Secrets
        </div>
        <div className={`sidebar-link ${view === "logs" ? "active" : ""}`} onClick={() => setView("logs")}>
          📜 Access logs
        </div>
        <div className="sidebar-link" onClick={() => setToast("Settings — coming soon!")}>
          ⚙️ Settings
        </div>

        <div className="sidebar-footer">
          {isGuest ? (
            <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => navigate("/signup")}>
              Sign up to save
            </button>
          ) : (
            <button className="btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={handleLogout}>
              Log out
            </button>
          )}
        </div>
      </aside>

      <div className="main-content">
        <div className="topbar">
          <div>
            <h1 style={{ fontSize: "17px", fontWeight: 700 }}>
              {view === "logs" ? "Access Logs" : "Secrets"}
            </h1>
            <p className="text-secondary" style={{ fontSize: "12.5px", marginTop: "2px" }}>
              {isGuest ? "Guest mode — fully interactive, nothing is saved" : "Manage your encrypted environment variables"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="avatar">{initials(userEmail)}</div>
            {isGuest && <span className="badge badge-neutral">Guest</span>}
          </div>
        </div>

        <div style={{ padding: "24px 28px", maxWidth: "820px" }}>
          {error && <div className="alert-error">{error}</div>}

          {view === "secrets" && (
            <>
              <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
                <button className="btn-secondary" onClick={() => setShowModal(true)}>
                  + Add secret
                </button>
                <input
                  type="text"
                  placeholder="Search secrets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                  style={{ maxWidth: "220px" }}
                />
              </div>

              {filteredSecrets.length === 0 ? (
                <div className="card empty-state">
                  <p className="text-secondary">
                    {searchQuery ? "No secrets match your search." : "No secrets yet. Add your first one above."}
                  </p>
                </div>
              ) : (
                <div className="secret-list">
                  {filteredSecrets.map((secret) => (
                    <div key={secret.id} className="secret-row">
                      <div style={{ minWidth: "180px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span className="mono" style={{ fontWeight: 600, fontSize: "13.5px" }}>{secret.name}</span>
                          <span className="badge badge-accent">{secret.encrypted ? "AES-256" : "plain"}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                          <span className="secret-value-pill mono">
                            {revealed[secret.id] ? secret.value : "••••••••••••"}
                          </span>
                          <button className="btn-ghost" onClick={() => toggleReveal(secret.id)}>
                            {revealed[secret.id] ? "Hide" : "Reveal"}
                          </button>
                        </div>
                      </div>
                      <div className="secret-actions">
                        <button className="btn-ghost" onClick={() => handleCopy(secret.value)}>Copy</button>
                        <button className="btn-ghost" onClick={() => handleShare(secret.id)}>Share</button>
                        <button className="btn-ghost" onClick={() => handleViewLogs(secret.id)}>Logs</button>
                        <button className="btn-danger" onClick={() => handleDelete(secret.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {view === "logs" && (
            <>
              <button className="btn-ghost" style={{ marginBottom: "16px" }} onClick={() => setView("secrets")}>
                ← Back to secrets
              </button>
              <h2 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>Access Logs</h2>
              {logs.length === 0 ? (
                <div className="card empty-state">
                  <p className="text-secondary">No access logs yet.</p>
                </div>
              ) : (
                <div className="secret-list">
                  {logs.map((log) => (
                    <div key={log.id} className="secret-row">
                      <div>
                        <span className="mono" style={{ fontSize: "13px" }}>{log.ipAddress}</span>
                        <p className="text-secondary" style={{ fontSize: "12px", marginTop: "4px" }}>
                          {new Date(log.accessedAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="badge badge-accent">Viewed</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showQR && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000
        }}>
          <div className="card" style={{ width: "320px", textAlign: "center" }}>
            <h3 style={{ marginBottom: "16px", fontSize: "15px" }}>🔗 One-time Share Link</h3>
            <QRCode value={shareLink} size={200} style={{ margin: "0 auto 16px" }} />
            <p className="text-secondary" style={{ fontSize: "12px", marginBottom: "16px", wordBreak: "break-all" }}>
              {shareLink}
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn-secondary" style={{ flex: 1 }}
                onClick={() => { navigator.clipboard.writeText(shareLink); setToast("Link copied!"); }}>
                Copy link
              </button>
              <button className="btn-ghost" style={{ flex: 1 }}
                onClick={() => { setShowQR(false); setShareLink(""); }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && <AddSecretModal onClose={() => setShowModal(false)} onSubmit={handleAddSecret} />}
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

export default Dashboard;