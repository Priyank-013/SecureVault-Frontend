import { useState } from "react";

function AddSecretModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !value.trim()) {
      setError("Both fields are required.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit(name.trim(), value.trim());
      onClose();
    } catch (err) {
      setError(err.message || "Could not save secret.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: 700 }}>
          Add secret
        </h2>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label className="field-label">Secret Name</label>
            <input
              className="input-field mono"
              placeholder="e.g. Stripe API Key, DB Password, JWT Secret"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
              autoFocus
            />
          </div>

          <div>
            <label className="field-label">Secret Value</label>
            <input
              className="input-field mono"
              placeholder="Enter your secret value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={saving}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={saving}>
              {saving ? "Saving..." : "Save secret"}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSecretModal;