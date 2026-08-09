function getStrength(password) {
  if (!password) return { label: "", score: 0 };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Weak", score: 1 };
  if (score <= 3) return { label: "Medium", score: 2 };
  return { label: "Strong", score: 3 };
}

function PasswordStrength({ password }) {
  const { label, score } = getStrength(password);

  if (!password) return null;

  const colors = {
    1: "var(--danger)",
    2: "#e3b341",
    3: "var(--accent)",
  };

  return (
    <div style={{ marginTop: "6px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {[1, 2, 3].map((bar) => (
          <div
            key={bar}
            style={{
              height: "3px",
              flex: 1,
              borderRadius: "2px",
              background: bar <= score ? colors[score] : "var(--border-color)",
              transition: "background 0.2s ease",
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: "11.5px", color: colors[score] || "var(--text-secondary)", fontWeight: 600 }}>
        {label}
      </span>
    </div>
  );
}

export default PasswordStrength;