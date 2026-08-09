import { useNavigate } from "react-router-dom";

function Home() {
  
  const navigate = useNavigate();


  const handleGuestMode = () => {
    sessionStorage.setItem("guestMode", "true");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/dashboard");
  };

  return (
    <div className="landing-wrap">
      <span className="landing-badge">🔐 Encrypted at rest · JWT auth</span>

      <h1 className="landing-title" style={{ letterSpacing: "-2px" }}>
        Secure<span>Vault</span>
      </h1>

      <p className="landing-sub">
        A developer secrets manager with AES encryption, access logs,
        and one-time share links — built for teams who take their .env files seriously.
      </p>

      <div style={{ display: "flex", gap: "12px", marginTop: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        <button className="btn-primary" onClick={() => navigate("/login")}>
          Log in
        </button>
        <button className="btn-secondary" onClick={() => navigate("/signup")}>
          Create account
        </button>
        <button className="btn-ghost" onClick={handleGuestMode}>
          👤 Explore as guest
        </button>
      </div>

      <p className="text-secondary" style={{ fontSize: "12.5px", marginTop: "8px" }}>
        No sign-up needed for guest mode — try every feature instantly.
      </p>
    </div>
  );
}

export default Home;