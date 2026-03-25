import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const P  = "#ec4899"; // pink main
const PH = "#db2777"; // pink hover
const PL = "#fdf2f8"; // pink light bg

export default function Hearder() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [cartCount,   setCartCount]   = useState(0);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/home?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navLinks = [
    { label: "Home",  path: "/home"  },
    { label: "Women", path: "/women" },
    { label: "Men",   path: "/men"   },
    { label: "Kids",  path: "/kids"  },
  ];

  const isActive = (path) =>
    typeof window !== "undefined" && window.location.pathname === path;

  return (
    <>
      <header style={{
        background: "#ffffff",
        borderBottom: scrolled ? `2px solid ${P}` : "2px solid #fce7f3",
        boxShadow: scrolled ? "0 2px 16px rgba(236,72,153,0.10)" : "0 1px 4px rgba(0,0,0,0.06)",
        transition: "all 0.25s ease",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        position: "relative", zIndex: 50,
      }}>
        {/* Pink top accent line */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${P}, #f472b6, #fbbf24, #f472b6, ${P})` }} />

        <div style={{
          maxWidth: 1280, margin: "0 auto",
          padding: "0 24px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 64,
        }}>
          {/* Logo */}
          <Link to="/home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: `linear-gradient(135deg, ${P}, #f472b6)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 18, color: "#fff",
              boxShadow: `0 2px 10px rgba(236,72,153,0.35)`,
              flexShrink: 0,
            }}>F</div>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#1f1f1f", letterSpacing: "0.02em" }}>Fashion</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: P, letterSpacing: "0.18em", textTransform: "uppercase" }}>Store</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }} className="desk-nav">
            {navLinks.map(({ label, path }) => {
              const active = isActive(path);
              return (
                <Link key={label} to={path} style={{ textDecoration: "none" }}>
                  <div style={{
                    padding: "8px 16px", borderRadius: 8, fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    color: active ? P : "#4b5563",
                    background: active ? PL : "transparent",
                    borderBottom: `2px solid ${active ? P : "transparent"}`,
                    transition: "all 0.18s", cursor: "pointer",
                  }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = P; e.currentTarget.style.background = PL; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "#4b5563"; e.currentTarget.style.background = "transparent"; } }}
                  >{label}</div>
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Search */}
            <form onSubmit={handleSearch} style={{ position: "relative" }} className="desk-search">
              <input
                ref={searchRef} type="text" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                style={{
                  background: "#fafafa", border: "1.5px solid #f3f4f6",
                  color: "#1f1f1f", fontSize: 13, padding: "8px 38px 8px 14px",
                  borderRadius: 8, width: 200, outline: "none",
                  fontFamily: "inherit", transition: "all 0.2s",
                }}
                onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; e.target.style.width = "230px"; }}
                onBlur={e => { e.target.style.borderColor = "#f3f4f6"; e.target.style.background = "#fafafa"; e.target.style.width = "200px"; }}
              />
              <button type="submit" style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: P, cursor: "pointer", fontSize: 17, padding: 0,
              }}>⌕</button>
            </form>

            {/* Icon buttons */}
            {[
              { to: "/viewcart", icon: "🛍", label: "Cart", count: cartCount },
              { to: "/vistlist",  icon: "♡",  label: "Wish" },
              { to: "/profile",   icon: "👤", label: "Profile" },
            ].map(({ to, icon, count }) => (
              <Link key={to} to={to} style={{ textDecoration: "none", position: "relative" }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 9,
                  background: "#f9fafb", border: "1.5px solid #f3f4f6",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#6b7280", fontSize: 19, cursor: "pointer", transition: "all 0.18s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = PL; e.currentTarget.style.borderColor = "#fce7f3"; e.currentTarget.style.color = P; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#f3f4f6"; e.currentTarget.style.color = "#6b7280"; }}
                >
                  {icon}
                  {count > 0 && (
                    <span style={{
                      position: "absolute", top: -5, right: -5,
                      background: P, color: "#fff",
                      fontSize: 10, fontWeight: 700, borderRadius: "50%",
                      width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center",
                      border: "2px solid #fff",
                    }}>{count}</span>
                  )}
                </div>
              </Link>
            ))}

            {/* Logout */}
            <Link to="/" style={{ textDecoration: "none" }}>
              <button style={{
                background: "white", border: `1.5px solid #fce7f3`,
                color: P, padding: "7px 16px", borderRadius: 8,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = P; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = P; }}
                onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = P; e.currentTarget.style.borderColor = "#fce7f3"; }}
              >Logout</button>
            </Link>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="burger-btn" style={{
              display: "none", background: "none", border: "none",
              color: P, fontSize: 24, cursor: "pointer", padding: 4,
            }}>☰</button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: "#fff", borderTop: "1px solid #fce7f3", padding: "10px 20px 14px" }}>
            {navLinks.map(({ label, path }) => (
              <Link key={label} to={path} style={{ textDecoration: "none", display: "block" }} onClick={() => setMenuOpen(false)}>
                <div style={{ padding: "10px 12px", color: "#374151", fontSize: 15, fontWeight: 500, borderRadius: 8, marginBottom: 4 }}
                  onMouseEnter={e => { e.currentTarget.style.color = P; e.currentTarget.style.background = PL; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#374151"; e.currentTarget.style.background = "transparent"; }}
                >{label}</div>
              </Link>
            ))}
          </div>
        )}
      </header>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: #9ca3af !important; }
        @media (max-width: 768px) {
          .desk-nav    { display: none !important; }
          .desk-search { display: none !important; }
          .burger-btn  { display: block !important; }
        }
      `}</style>
    </>
  );
}