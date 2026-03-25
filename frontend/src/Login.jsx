import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const P  = "#ec4899";
const PH = "#db2777";
const PL = "#fdf2f8";

function Login() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch("http://localhost:5000/api/auth/login/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Login failed. Please try again."); setLoading(false); return; }
      if (data.token)     localStorage.setItem("token",  data.token);
      if (data.user?._id) localStorage.setItem("userId", data.user._id);
      navigate("/home");
    } catch {
      setError("Server error. Please try again later.");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 9,
    border: "1.5px solid #e5e7eb", fontSize: 15, color: "#1f1f1f",
    outline: "none", fontFamily: "inherit", background: "#fafafa",
    transition: "border-color 0.2s, background 0.2s", boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fdf2f8 0%, #fff 50%, #fdf2f8 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: 24,
    }}>
      <div style={{
        width: "100%", maxWidth: 960,
        display: "flex", borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(236,72,153,0.12), 0 4px 16px rgba(0,0,0,0.06)",
      }}>
        {/* ── Left decorative panel ── */}
        <div className="login-left-panel" style={{
          flex: 1,
          background: `linear-gradient(160deg, ${P} 0%, #f472b6 50%, #fb7185 100%)`,
          padding: "52px 48px",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          position: "relative", overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />

          <div>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, color: "#fff" }}>F</div>
              <div>
                <div style={{ color: "#fff", fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>FashionStore</div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>Your Style, Your Way</div>
              </div>
            </div>

            <h1 style={{ color: "#fff", fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
              Welcome<br />Back! 👋
            </h1>
            <p style={{ color: "rgba(255,255,255,0.80)", fontSize: 15, lineHeight: 1.75, maxWidth: 300 }}>
              Sign in to explore curated collections, track your orders, and discover new arrivals.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 40 }}>
            {[
              { n: "500+", l: "Curated Pieces"  },
              { n: "50K+", l: "Happy Shoppers"  },
              { n: "Free", l: "Island Delivery" },
              { n: "100%", l: "Secure Checkout" },
            ].map(({ n, l }) => (
              <div key={l} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ color: "#fff", fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{n}</div>
                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div style={{
          width: "100%", maxWidth: 440, background: "#ffffff",
          padding: "52px 44px",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: PL, border: `1px solid #fce7f3`,
            borderRadius: 6, padding: "5px 12px", marginBottom: 22, width: "fit-content",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: P }} />
            <span style={{ color: P, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>User Login</span>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 6, letterSpacing: "-0.01em" }}>Sign In</h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 28 }}>
            No account?{" "}
            <Link to="/registerform" style={{ color: P, textDecoration: "none", fontWeight: 600 }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
            >Create one free →</Link>
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Email Address</label>
              <input type="email" value={email} required
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="your@email.com" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }}
                onBlur={e  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} value={password} required
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••" style={{ ...inputStyle, paddingRight: 46 }}
                  onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }}
                  onBlur={e  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: 18, padding: 0,
                }}
                  onMouseEnter={e => e.currentTarget.style.color = P}
                  onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
                >{showPass ? "🙈" : "👁️"}</button>
              </div>
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "11px 14px", color: "#dc2626", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "13px",
              background: loading ? "#f9a8d4" : `linear-gradient(135deg, ${P}, #f472b6)`,
              color: "#fff", border: "none", borderRadius: 9,
              fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "all 0.2s",
              boxShadow: loading ? "none" : "0 4px 16px rgba(236,72,153,0.40)",
              marginTop: 4,
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = `linear-gradient(135deg, ${PH}, ${P})`; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={e => { e.currentTarget.style.background = loading ? "#f9a8d4" : `linear-gradient(135deg, ${P}, #f472b6)`; e.currentTarget.style.transform = "translateY(0)"; }}
            >{loading ? "Signing in..." : "Sign In →"}</button>
          </form>

          <div style={{ marginTop: 26, paddingTop: 20, borderTop: "1px solid #f3f4f6", textAlign: "center" }}>
            <p style={{ color: "#9ca3af", fontSize: 13 }}>
              Admin access?{" "}
              <Link to="/adminlogin" style={{ color: "#6b7280", textDecoration: "none", fontWeight: 500 }}
                onMouseEnter={e => e.currentTarget.style.color = P}
                onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
              >Admin Login →</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: #9ca3af !important; }
        @media (max-width: 680px) { .login-left-panel { display: none !important; } }
      `}</style>
    </div>
  );
}
export default Login;