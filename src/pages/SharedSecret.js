import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";

function SharedSecret() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");
  const [value, setValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleReveal = async () => {
    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await api.getSharedSecret(token);

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "This link is invalid or has already been used."
            : "Could not load this secret."
        );
      }

      let secretValue;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await response.json();
        secretValue = data.value || data.secret || JSON.stringify(data);
      } else {
        secretValue = await response.text();
      }

      setValue(secretValue);
      setStatus("ready");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
      setStatus("error");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // ignore silently
    }
  };

  return (
    <div className="auth-wrap">
      <div style={{ width: "380px" }}>
        <div className="auth-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <span className="auth-logo-mark">🔐</span>
          SecureVault
        </div>

        <div className="card">
          <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
            Shared secret
          </h2>
          <p className="text-secondary" style={{ fontSize: "12.5px", marginBottom: "20px" }}>
            This is a one-time link — it can only be viewed once.
          </p>

          {status === "idle" && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <p className="text-secondary" style={{ fontSize: "13px", marginBottom: "16px" }}>
                Click below to reveal the secret. Once revealed, this link will no longer work.
              </p>
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleReveal}>
                Reveal secret
              </button>
            </div>
          )}

          {status === "loading" && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <p className="text-secondary">Decrypting...</p>
            </div>
          )}

          {status === "ready" && (
            <div>
              <label className="field-label">Value</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span className="secret-value-pill mono" style={{ flex: 1, wordBreak: "break-all" }}>
                  {value}
                </span>
                <button className="btn-ghost" onClick={handleCopy}>Copy</button>
              </div>
              <div className="alert-success" style={{ marginTop: "16px" }}>
                This link has now been used and will not work again.
              </div>
            </div>
          )}

          {status === "error" && (
            <div>
              <div className="alert-error">{errorMsg}</div>
              <p className="text-secondary" style={{ fontSize: "13px", marginTop: "10px" }}>
                Ask the sender to generate a new share link.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SharedSecret;