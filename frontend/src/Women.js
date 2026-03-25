import React, { useEffect, useState } from "react";
import Hearder from "./Hearder";
import Footer  from "./Footer";
import { useNavigate } from "react-router-dom";

// ── Design tokens (match the rest of your app) ──────
const P   = "#ec4899";   // pink main
const PH  = "#db2777";   // pink hover
const PL  = "#fdf2f8";   // pink light bg
const PLL = "#fce7f3";   // pink border

/**
 * Shared CategoryPage — used by Women, Men, Kids
 * Pass:  category="women" | "men" | "kids"
 */
export function CategoryPage({ category }) {
  const [allProducts, setAllProducts] = useState([]);
  const [sortOrder,   setSortOrder]   = useState("");
  const [loading,     setLoading]     = useState(true);
  const [hoveredId,   setHoveredId]   = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const label = category.charAt(0).toUpperCase() + category.slice(1);

  const meta = {
    women: { emoji: "👗", tagline: "Elegant styles for every occasion",        note: "New arrivals added every week"        },
    men:   { emoji: "👔", tagline: "Refined clothing for the modern man",       note: "Premium fabrics · tailored fits"      },
    kids:  { emoji: "🎒", tagline: "Fun, comfortable styles for little ones",   note: "Durable · washable · kid-approved"    },
  };
  const { emoji, tagline, note } = meta[category] || meta.women;

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/auth/products")
      .then(r  => r.json())
      .then(data => {
        setAllProducts(data.filter(p => p.category?.toLowerCase() === category.toLowerCase()));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  const getFirstPrice = (sizes, price) => {
    if (price) return price;
    if (!sizes) return 0;
    const f = Object.values(sizes)[0];
    return f ? f.price : 0;
  };

  const getFirstImage = (images) =>
    images?.length > 0 ? `http://localhost:5000/uploads/${images[0]}` : "/placeholder.jpg";

  const displayed = [...allProducts]
    .filter(p =>
      !searchQuery ||
      p.productName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const pa = getFirstPrice(a.sizes, a.price);
      const pb = getFirstPrice(b.sizes, b.price);
      if (sortOrder === "lowToHigh") return pa - pb;
      if (sortOrder === "highToLow") return pb - pa;
      return 0;
    });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f9fafb",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* Sticky header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <Hearder />
      </div>

      {/* ══ HERO BANNER ══════════════════════════════════ */}
      <section style={{
        background: `linear-gradient(160deg, #9d174d 0%, #be185d 30%, #db2777 65%, #ec4899 100%)`,
        padding: "52px 24px 48px",
        position: "relative", overflow: "hidden",
        borderBottom: "none",
      }}>
        {/* Giant emoji watermark */}
        <div style={{
          position: "absolute", right: "4%", top: "50%",
          transform: "translateY(-50%)",
          fontSize: 180, lineHeight: 1,
          opacity: 0.10, pointerEvents: "none", userSelect: "none",
        }}>{emoji}</div>

        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
            <span onClick={() => navigate("/home")} style={{ color: "rgba(255,255,255,0.90)", cursor: "pointer", fontWeight: 500, textDecoration: "underline" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.90)"}
            >Home</span>
            <span style={{ color: "rgba(255,255,255,0.45)" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.75)" }}>{label}'s Collection</span>
          </div>

          {/* Category badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: 24, padding: "6px 16px", marginBottom: 18,
          }}>
            <span style={{ fontSize: 16 }}>{emoji}</span>
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {label}'s Collection
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(32px,5vw,58px)", fontWeight: 800,
            color: "#ffffff", lineHeight: 1.1,
            letterSpacing: "-0.025em", marginBottom: 12,
            textShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}>
            {label}'s <span style={{ color: "rgba(255,255,255,0.88)" }}>Fashion</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, marginBottom: 24, maxWidth: 480 }}>{tagline}</p>

          {/* Meta dots */}
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              loading ? "Loading…" : `${allProducts.length} pieces available`,
              note,
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.80)", flexShrink: 0 }} />
                <span style={{ color: "rgba(255,255,255,0.80)", fontSize: 13 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STICKY FILTER BAR ═══════════════════════════ */}
      <div style={{
        background: "#ffffff",
        borderBottom: "1px solid #f3f4f6",
        padding: "12px 24px",
        position: "sticky", top: 64, zIndex: 50,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          gap: 14, flexWrap: "wrap",
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 340 }}>
            <span style={{
              position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af", fontSize: 16, pointerEvents: "none",
            }}>⌕</span>
            <input
              type="text" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}'s items…`}
              style={{
                width: "100%", padding: "9px 14px 9px 38px",
                background: "#fafafa", border: "1.5px solid #e5e7eb",
                color: "#111827", borderRadius: 8, fontSize: 13,
                outline: "none", fontFamily: "inherit",
                transition: "all 0.2s", boxSizing: "border-box",
              }}
              onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }}
              onBlur={e  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }}
            />
          </div>

          {/* Right: count + sort */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ color: "#6b7280", fontSize: 13, whiteSpace: "nowrap" }}>
              <strong style={{ color: "#374151" }}>{displayed.length}</strong> result{displayed.length !== 1 ? "s" : ""}
            </span>
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{
              background: "#fff", border: "1.5px solid #e5e7eb",
              color: "#374151", padding: "9px 16px", borderRadius: 8,
              fontSize: 13, fontFamily: "inherit", outline: "none", cursor: "pointer",
              transition: "border-color 0.2s",
            }}
              onFocus={e => e.target.style.borderColor = P}
              onBlur={e  => e.target.style.borderColor = "#e5e7eb"}
            >
              <option value="">Sort By</option>
              <option value="lowToHigh">Price: Low → High</option>
              <option value="highToLow">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* ══ PRODUCTS GRID ═══════════════════════════════ */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 24px 80px" }}>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(268px,1fr))", gap: 20 }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                height: 440, background: "#fff", borderRadius: 12,
                border: "1.5px solid #f3f4f6",
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 80}ms`,
              }} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && displayed.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 72, opacity: 0.12, marginBottom: 20 }}>{emoji}</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 10 }}>
              No {label.toLowerCase()}'s products found
            </h3>
            <p style={{ color: "#6b7280", fontSize: 15, marginBottom: 28 }}>
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search.`
                : "Check back soon — new items are added regularly."}
            </p>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{
                background: "#fff", border: `1.5px solid ${PLL}`, color: P,
                padding: "10px 24px", borderRadius: 8,
                fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}>Clear Search</button>
            )}
          </div>
        )}

        {/* Product cards */}
        {!loading && displayed.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(268px,1fr))", gap: 20 }}>
            {displayed.map((p, i) => {
              const isHov  = hoveredId === p._id;
              const price  = getFirstPrice(p.sizes, p.price);
              const imgSrc = getFirstImage(p.images);
              const sizes  = p.sizes ? Object.keys(p.sizes) : [];

              return (
                <div
                  key={p._id || p.id}
                  onMouseEnter={() => setHoveredId(p._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    background: "#fff",
                    border: `1.5px solid ${isHov ? PLL : "#f3f4f6"}`,
                    borderRadius: 12, overflow: "hidden", cursor: "pointer",
                    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                    transform: isHov ? "translateY(-6px)" : "translateY(0)",
                    boxShadow: isHov
                      ? "0 14px 36px rgba(236,72,153,0.13)"
                      : "0 1px 4px rgba(0,0,0,0.05)",
                    animation: `fadeInUp 0.45s ease ${i * 55}ms both`,
                  }}
                >
                  {/* ── Image ── */}
                  <div style={{ height: 360, overflow: "hidden", position: "relative" }}>
                    <img
                      src={imgSrc}
                      alt={p.productName}
                      style={{
                        width: "100%", height: "100%",
                        objectFit: "cover", objectPosition: "top",
                        transition: "transform 0.5s ease",
                        transform: isHov ? "scale(1.06)" : "scale(1)",
                      }}
                    />

                    {/* Category badge */}
                    <div style={{
                      position: "absolute", top: 12, left: 12,
                      background: "rgba(255,255,255,0.92)", color: P,
                      padding: "4px 12px", borderRadius: 20,
                      fontSize: 11, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.06em",
                      border: `1px solid ${PLL}`,
                    }}>{label}</div>

                    {/* Low stock badge */}
                    {p.sizes && Object.values(p.sizes).every(s => s.quantity < 5 && s.quantity > 0) && (
                      <div style={{
                        position: "absolute", top: 12, right: 12,
                        background: "#fef3c7", color: "#d97706",
                        padding: "4px 10px", borderRadius: 6,
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
                        border: "1px solid #fde68a",
                      }}>LOW STOCK</div>
                    )}

                    {/* Hover overlay — Add to Cart */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "rgba(0,0,0,0.40)",
                      display: "flex", alignItems: "flex-end", padding: 14,
                      opacity: isHov ? 1 : 0,
                      transition: "opacity 0.25s",
                    }}>
                      <button
                        onClick={() => navigate(`/addtocart/${p._id || p.id}`, { state: { product: p } })}
                        style={{
                          width: "100%",
                          background: `linear-gradient(135deg, ${P}, #f472b6)`,
                          color: "#fff", border: "none",
                          padding: "13px", borderRadius: 9,
                          fontSize: 14, fontWeight: 700, cursor: "pointer",
                          fontFamily: "inherit",
                          transform: isHov ? "translateY(0)" : "translateY(14px)",
                          transition: "all 0.25s ease 0.04s",
                          boxShadow: "0 4px 16px rgba(236,72,153,0.40)",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg,${PH},${P})`}
                        onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg,${P},#f472b6)`}
                      >
                        🛍️ Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* ── Card info ── */}
                  <div style={{ padding: "16px 18px 20px" }}>
                    <h3 style={{
                      color: "#111827", fontSize: 16, fontWeight: 600,
                      marginBottom: 6, lineHeight: 1.35,
                    }}>{p.productName}</h3>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ color: P, fontSize: 17, fontWeight: 700 }}>
                        LKR {price ? price.toLocaleString() : "N/A"}
                      </span>
                    </div>

                    {/* Size pills */}
                    {sizes.length > 0 && (
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {sizes.slice(0, 5).map(sz => (
                          <span key={sz} style={{
                            border: "1px solid #e5e7eb", color: "#9ca3af",
                            fontSize: 10, padding: "3px 8px", borderRadius: 5,
                            fontWeight: 600, letterSpacing: "0.04em",
                          }}>{sz}</span>
                        ))}
                        {sizes.length > 5 && (
                          <span style={{ color: "#9ca3af", fontSize: 10, padding: "3px 0" }}>+{sizes.length - 5}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: #9ca3af !important; }
        select option { background: #fff; color: #374151; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

// ── Default export ───────────────────────────────────
export default function Women() {
  return <CategoryPage category="women" />;
}