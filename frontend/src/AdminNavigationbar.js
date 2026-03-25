import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";

function AdminNavigationbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/admindashboard", label: "Orders",    icon: "📦" },
    { to: "/allitem",        label: "All Items", icon: "🗂️"  },
    { to: "/add-item",       label: "Add Item",  icon: "➕"  },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={{
        background: "#ffffff",
        borderBottom: "2px solid #6366f1",
        boxShadow: "0 2px 12px rgba(99,102,241,0.10)",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        position: "relative",
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}>

          {/* Brand */}
          <Link to="/admindashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 17, fontWeight: 800,
              boxShadow: "0 2px 8px rgba(99,102,241,0.30)",
            }}>A</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1e1b4b", letterSpacing: "0.01em", lineHeight: 1.1 }}>
                FashionStore
              </div>
              <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Admin Panel
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="desktop-nav">
            {navLinks.map(({ to, label, icon }) => (
              <Link key={to} to={to} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "8px 16px", borderRadius: 8,
                  fontSize: 14, fontWeight: isActive(to) ? 600 : 500,
                  color: isActive(to) ? "#6366f1" : "#4b5563",
                  background: isActive(to) ? "#eef2ff" : "transparent",
                  borderBottom: isActive(to) ? "2px solid #6366f1" : "2px solid transparent",
                  transition: "all 0.18s",
                  cursor: "pointer",
                }}
                  onMouseEnter={e => { if (!isActive(to)) { e.currentTarget.style.background = "#f5f3ff"; e.currentTarget.style.color = "#6366f1"; } }}
                  onMouseLeave={e => { if (!isActive(to)) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4b5563"; } }}
                >
                  <span>{icon}</span> {label}
                </div>
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 14px", borderRadius: 20,
              background: "#f0fdf4", border: "1px solid #bbf7d0",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ color: "#15803d", fontSize: 12, fontWeight: 600 }}>Active</span>
            </div>
            <Link to="/" style={{ textDecoration: "none" }}>
              <button style={{
                background: "white", border: "1.5px solid #e5e7eb",
                color: "#ef4444", padding: "7px 18px", borderRadius: 8,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.18s",
                display: "flex", alignItems: "center", gap: 6,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#fff1f2"; e.currentTarget.style.borderColor = "#fca5a5"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
              >
                ⎋ Logout
              </button>
            </Link>
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: "none", background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#6366f1" }}
              className="hamburger"
            >☰</button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            background: "#fff", borderTop: "1px solid #e5e7eb",
            padding: "12px 24px 16px",
          }}>
            {navLinks.map(({ to, label, icon }) => (
              <Link key={to} to={to} style={{ textDecoration: "none", display: "block" }} onClick={() => setMobileOpen(false)}>
                <div style={{
                  padding: "10px 12px", borderRadius: 8,
                  color: isActive(to) ? "#6366f1" : "#374151",
                  background: isActive(to) ? "#eef2ff" : "transparent",
                  fontSize: 14, fontWeight: 500, marginBottom: 4,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  {icon} {label}
                </div>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </>
  );
}

export default AdminNavigationbar;