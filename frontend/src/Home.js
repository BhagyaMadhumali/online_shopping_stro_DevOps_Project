import React, { useEffect, useState } from "react";
import Hearder from "./Hearder";
import Footer  from "./Footer";
import { useNavigate } from "react-router-dom";

const P   = "#ec4899";
const PH  = "#db2777";
const PL  = "#fdf2f8";
const PLL = "#fce7f3";
const CATS = ["All", "Women", "Men", "Kids"];

export default function Home() {
  const [products,       setProducts]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder,      setSortOrder]      = useState("");
  const [searchQuery,    setSearchQuery]    = useState("");
  const [hoveredId,      setHoveredId]      = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const q   = url.searchParams.get("search");
    if (q) setSearchQuery(q);
    fetch("http://localhost:5000/api/auth/products")
      .then(r => r.json())
      .then(d => { setProducts(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getFirstPrice = sizes => {
    if (!sizes) return "N/A";
    const f = Object.values(sizes)[0];
    return f ? f.price : "N/A";
  };
  const getFirstImage = images =>
    images?.length > 0 ? `http://localhost:5000/uploads/${images[0]}` : "/placeholder.jpg";

  const filtered = products
    .filter(p => activeCategory === "All" || p.category?.toLowerCase() === activeCategory.toLowerCase())
    .filter(p => !searchQuery || p.productName?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const pa = getFirstPrice(a.sizes), pb = getFirstPrice(b.sizes);
      if (sortOrder === "lowToHigh") return pa - pb;
      if (sortOrder === "highToLow") return pb - pa;
      return 0;
    });

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100 }}><Hearder /></div>

      {/* ── Hero ── */}
      <section style={{
        background: `linear-gradient(160deg, #be185d 0%, #db2777 30%, #ec4899 65%, #f472b6 100%)`,
        padding: "80px 24px 72px",
        textAlign: "center", position: "relative", overflow: "hidden",
        borderBottom: "none",
      }}>
        {/* decorative circles */}
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "-5%", width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 22,
            background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: 24, padding: "7px 20px",
          }}>
            <span style={{ fontSize: 16 }}>✨</span>
            <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>New Season Collection</span>
          </div>

          <h1 style={{ fontSize: "clamp(38px,6vw,76px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 10, letterSpacing: "-0.025em", textShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
            Define Your
          </h1>
          <h1 style={{ fontSize: "clamp(38px,6vw,76px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.025em", textShadow: "0 2px 12px rgba(0,0,0,0.15)", opacity: 0.95 }}>
            Style. 💕
          </h1>
          <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 16, maxWidth: 460, margin: "0 auto 40px", lineHeight: 1.75 }}>
            Explore handpicked collections for Women, Men, and Kids — fresh styles delivered with love.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => document.getElementById("products").scrollIntoView({ behavior: "smooth" })} style={{
              background: "#fff", color: P,
              border: "none", padding: "13px 32px", borderRadius: 9,
              fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 4px 20px rgba(0,0,0,0.20)", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.20)"; }}
            >Shop Now</button>
            <button onClick={() => navigate("/women")} style={{
              background: "transparent", color: "#fff",
              border: "2px solid rgba(255,255,255,0.7)", padding: "13px 32px", borderRadius: 9,
              fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.borderColor = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)"; }}
            >Explore Collection</button>
          </div>
        </div>
      </section>

      {/* ── Category cards ── */}
      <section style={{ background: "#fff", padding: "48px 24px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Women", icon: "👗", path: "/women" },
            { label: "Men",   icon: "👔", path: "/men"   },
            { label: "Kids",  icon: "🎒", path: "/kids"  },
          ].map(({ label, icon, path }) => (
            <div key={label} onClick={() => navigate(path)} style={{
              background: "#fff", border: "1.5px solid #f3f4f6",
              borderRadius: 12, padding: "22px 44px", cursor: "pointer",
              textAlign: "center", transition: "all 0.2s", minWidth: 160,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = PL; e.currentTarget.style.borderColor = "#fce7f3"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(236,72,153,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#f3f4f6"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
              <div style={{ color: "#374151", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Products ── */}
      <main id="products" style={{ background: "#fff", padding: "48px 24px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12, background: PL, border: "1px solid #fce7f3", borderRadius: 20, padding: "5px 14px" }}>
              <span style={{ color: P, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Our Collection</span>
            </div>
            <h2 style={{ fontSize: "clamp(24px,3vw,40px)", fontWeight: 800, color: "#111827", letterSpacing: "-0.01em" }}>Featured Pieces</h2>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CATS.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  padding: "8px 20px", borderRadius: 8,
                  background: activeCategory === cat ? P : "#fff",
                  color: activeCategory === cat ? "#fff" : "#6b7280",
                  border: activeCategory === cat ? `1.5px solid ${P}` : "1.5px solid #e5e7eb",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.18s",
                  boxShadow: activeCategory === cat ? "0 2px 10px rgba(236,72,153,0.25)" : "none",
                }}
                  onMouseEnter={e => { if (activeCategory !== cat) { e.currentTarget.style.borderColor = P; e.currentTarget.style.color = P; e.currentTarget.style.background = PL; } }}
                  onMouseLeave={e => { if (activeCategory !== cat) { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.background = "#fff"; } }}
                >{cat}</button>
              ))}
            </div>
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{
              background: "#fff", border: "1.5px solid #e5e7eb", color: "#374151",
              padding: "9px 18px", borderRadius: 8, fontSize: 13, fontFamily: "inherit",
              outline: "none", cursor: "pointer",
            }}
              onFocus={e => e.target.style.borderColor = P}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"}
            >
              <option value="">Sort By</option>
              <option value="lowToHigh">Price: Low → High</option>
              <option value="highToLow">Price: High → Low</option>
            </select>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(272px,1fr))", gap: 20 }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ height: 420, background: "#f9fafb", borderRadius: 12, border: "1.5px solid #f3f4f6", animation: "pulse 1.5s ease-in-out infinite" }} />
              ))}
            </div>
          )}

          {/* Products grid */}
          {!loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(272px,1fr))", gap: 20 }}>
              {filtered.length === 0 ? (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#9ca3af", fontSize: 16 }}>
                  No products found.
                </div>
              ) : filtered.map((p, i) => {
                const price = getFirstPrice(p.sizes);
                const isHov = hoveredId === p._id;
                return (
                  <div key={p._id}
                    onMouseEnter={() => setHoveredId(p._id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      background: "#fff", border: `1.5px solid ${isHov ? P : "#f3f4f6"}`,
                      borderRadius: 12, overflow: "hidden", cursor: "pointer",
                      transition: "all 0.25s", transform: isHov ? "translateY(-5px)" : "translateY(0)",
                      boxShadow: isHov ? "0 12px 32px rgba(236,72,153,0.14)" : "0 1px 4px rgba(0,0,0,0.05)",
                      animation: `fadeUp 0.4s ease ${i * 55}ms both`,
                    }}
                  >
                    {/* Image */}
                    <div style={{ height: 320, overflow: "hidden", position: "relative" }}>
                      <img src={getFirstImage(p.images)} alt={p.productName} style={{
                        width: "100%", height: "100%", objectFit: "cover", objectPosition: "top",
                        transition: "transform 0.5s", transform: isHov ? "scale(1.05)" : "scale(1)",
                      }} />
                      {p.category && (
                        <div style={{
                          position: "absolute", top: 12, left: 12,
                          background: "rgba(255,255,255,0.92)", color: P,
                          padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                          textTransform: "uppercase", letterSpacing: "0.06em",
                          border: `1px solid #fce7f3`,
                          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
                        }}>{p.category}</div>
                      )}
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "rgba(0,0,0,0.42)",
                        display: "flex", alignItems: "flex-end", padding: 14,
                        opacity: isHov ? 1 : 0, transition: "opacity 0.25s",
                      }}>
                        <button onClick={() => navigate(`/addtocart/${p._id}`, { state: { product: p } })} style={{
                          width: "100%", background: `linear-gradient(135deg,${P},#f472b6)`, color: "#fff",
                          border: "none", padding: "12px", borderRadius: 9,
                          fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                          transform: isHov ? "translateY(0)" : "translateY(12px)",
                          transition: "all 0.25s ease 0.04s",
                        }}>🛍️ Add to Cart</button>
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: "16px 18px 20px" }}>
                      <h3 style={{ color: "#111827", fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{p.productName}</h3>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: P, fontSize: 17, fontWeight: 700 }}>
                          {price !== "N/A" ? `LKR ${Number(price).toLocaleString()}` : "N/A"}
                        </span>
                        {p.sizes && (
                          <div style={{ display: "flex", gap: 4 }}>
                            {Object.keys(p.sizes).slice(0, 3).map(sz => (
                              <span key={sz} style={{ border: "1px solid #e5e7eb", color: "#9ca3af", fontSize: 10, padding: "2px 7px", borderRadius: 4, fontWeight: 600 }}>{sz}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Trust badges */}
      <section style={{ background: PL, borderTop: "1px solid #fce7f3", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 28 }}>
          {[
            { icon: "🚚", title: "Free Delivery",  desc: "On orders over LKR 5,000" },
            { icon: "↩️", title: "Easy Returns",   desc: "30-day return policy"     },
            { icon: "🔒", title: "Secure Payment", desc: "100% encrypted"          },
            { icon: "💬", title: "24/7 Support",   desc: "We're here to help"      },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
              <div style={{ color: P, fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{title}</div>
              <div style={{ color: "#9ca3af", fontSize: 12 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: #9ca3af !important; }
        select option { background: #fff; color: #374151; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}