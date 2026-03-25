import React from "react";
import { Link } from "react-router-dom";

const P   = "#ec4899";
const PH  = "#db2777";
const PD  = "#9d174d";   // darkest pink — footer bg start
const PD2 = "#be185d";   // mid dark pink

export default function Footer() {
  const cols = [
    {
      title: "Information",
      links: [
        { label: "About Us",             to: "/about"      },
        { label: "Delivery Information", to: "/"           },
        { label: "Exchange & Refund",    to: "/"           },
        { label: "Size Guide",           to: "/"           },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { label: "Contact Us", to: "/contact-us" },
        { label: "Our Stores", to: "/"           },
        { label: "FAQ",        to: "/"           },
        { label: "Site Map",   to: "/"           },
      ],
    },
    {
      title: "My Account",
      links: [
        { label: "Cart",          to: "/viewcart" },
        { label: "Order History", to: "/profile"  },
        { label: "Wish List",     to: "/vistlist" },
        { label: "Profile",       to: "/profile"  },
      ],
    },
  ];

  return (
    <footer style={{
      background: `linear-gradient(160deg, ${PD} 0%, ${PD2} 35%, ${PH} 70%, ${P} 100%)`,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      position: "relative", overflow: "hidden",
    }}>

      {/* Decorative circles */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "40%", left: "45%", width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

      {/* Main grid */}
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "56px 32px 40px",
        display: "grid",
        gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
        gap: 40,
        position: "relative", zIndex: 1,
      }}>

        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "rgba(255,255,255,0.20)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 19, color: "#fff",
            }}>F</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>FashionStore</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.70)", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>Your Style</div>
            </div>
          </div>

          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 13, lineHeight: 1.85, maxWidth: 240, marginBottom: 22 }}>
            Curated fashion for everyone. Quality pieces, fresh styles every season.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", gap: 10 }}>
            {["📘", "📸", "🐦", "▶️"].map((icon, i) => (
              <div key={i} style={{
                width: 38, height: 38, borderRadius: 9,
                background: "rgba(255,255,255,0.12)",
                border: "1.5px solid rgba(255,255,255,0.22)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, cursor: "pointer", transition: "all 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.50)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >{icon}</div>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {cols.map(col => (
          <div key={col.title}>
            <h4 style={{
              color: "#fff", fontSize: 11, fontWeight: 800,
              letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20,
            }}>{col.title}</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {col.links.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} style={{
                    color: "rgba(255,255,255,0.72)", fontSize: 13, textDecoration: "none",
                    transition: "all 0.18s", display: "flex", alignItems: "center", gap: 7,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.paddingLeft = "4px"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.72)"; e.currentTarget.style.paddingLeft = "0px"; }}
                  >
                    <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>›</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 1 }}>
        <div style={{ height: 1, background: "rgba(255,255,255,0.18)" }} />
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "18px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 10,
        position: "relative", zIndex: 1,
      }}>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>© 2025 FashionStore. All rights reserved.</p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy Policy", "Terms of Use", "Cookies"].map(item => (
            <span key={item} style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, cursor: "pointer", transition: "color 0.18s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
            >{item}</span>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          footer div[style*="1.6fr"] { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          footer div[style*="1.6fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}