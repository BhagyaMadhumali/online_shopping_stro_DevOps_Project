import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Adminlogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setMessage("Please fill in all fields."); return; }
    setLoading(true); setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/admindashboard");
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setMessage('Server error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #faf5ff 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      padding: "24px",
    }}>

      <div style={{ width: "100%", maxWidth: 900, display: "flex", gap: 0, borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(99,102,241,0.15)" }}>

        {/* Left decorative panel */}
        <div style={{
          flex: 1, background: "linear-gradient(160deg, #6366f1 0%, #7c3aed 60%, #a78bfa 100%)",
          padding: "52px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between",
          minWidth: 0,
        }} className="login-left-panel">

          {/* Logo */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, fontWeight: 800, color: "#fff",
              }}>A</div>
              <div>
                <div style={{ color: "#fff", fontSize: 17, fontWeight: 700, lineHeight: 1.1 }}>FashionStore</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin Portal</div>
              </div>
            </div>

            <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 700, lineHeight: 1.25, marginBottom: 16 }}>
              Manage your<br />store with ease
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.7, maxWidth: 300 }}>
              Access orders, manage inventory, respond to customers, and keep your store running smoothly.
            </p>
          </div>

          {/* Feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 40 }}>
            {[
              { icon: "📦", label: "Order Management",   desc: "View & update all orders" },
              { icon: "🗂️", label: "Product Inventory",  desc: "Add, edit, remove items"  },
              { icon: "💬", label: "Customer Support",   desc: "Reply to messages"         },
            ].map(({ icon, label, desc }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0,
                }}>{icon}</div>
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{label}</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div style={{
          width: 400, background: "#ffffff", padding: "52px 44px",
          display: "flex", flexDirection: "column", justifyContent: "center",
          flexShrink: 0,
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#eef2ff", borderRadius: 6, padding: "5px 12px",
            marginBottom: 24, width: "fit-content",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1" }} />
            <span style={{ color: "#6366f1", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin Login</span>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111827", marginBottom: 6, letterSpacing: "-0.01em" }}>
            Welcome back
          </h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 32 }}>
            Sign in to access the admin dashboard
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email" value={email} required
                onChange={e => { setEmail(e.target.value); setMessage(''); }}
                placeholder="admin@fashionstore.com"
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 8,
                  border: "1.5px solid #d1d5db", fontSize: 14, color: "#111827",
                  outline: "none", fontFamily: "inherit", transition: "border-color 0.2s",
                  boxSizing: "border-box", background: "#fff",
                }}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "#d1d5db"}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"} value={password} required
                  onChange={e => { setPassword(e.target.value); setMessage(''); }}
                  placeholder="••••••••"
                  style={{
                    width: "100%", padding: "11px 44px 11px 14px", borderRadius: 8,
                    border: "1.5px solid #d1d5db", fontSize: 14, color: "#111827",
                    outline: "none", fontFamily: "inherit", transition: "border-color 0.2s",
                    boxSizing: "border-box", background: "#fff",
                  }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#d1d5db"}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 17, padding: 0,
                }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Error */}
            {message && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: 8, padding: "10px 14px",
                color: "#dc2626", fontSize: 13,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                ⚠️ {message}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "12px",
              background: loading ? "#a5b4fc" : "linear-gradient(135deg, #6366f1, #7c3aed)",
              color: "#fff", border: "none", borderRadius: 8,
              fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "all 0.2s",
              boxShadow: loading ? "none" : "0 4px 14px rgba(99,102,241,0.35)",
              marginTop: 4,
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {loading ? "Signing in..." : "Sign In to Dashboard"}
            </button>
          </form>

          <div style={{
            marginTop: 28, paddingTop: 24, borderTop: "1px solid #f3f4f6",
            textAlign: "center",
          }}>
            <p style={{ color: "#6b7280", fontSize: 13 }}>
              Not an admin?{" "}
              <Link to="/" style={{ color: "#6366f1", textDecoration: "none", fontWeight: 600 }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
              >User Login →</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: #9ca3af !important; }
        @media (max-width: 680px) {
          .login-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default Adminlogin;