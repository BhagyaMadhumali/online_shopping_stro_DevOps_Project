import React, { useState, useEffect } from "react";
import Hearder from "./Hearder";
import Footer  from "./Footer";
import { useLocation } from "react-router-dom";

const P  = "#ec4899";
const PH = "#db2777";
const PL = "#fdf2f8";

function Addtocart() {
  const location        = useLocation();
  const productFromState = location.state?.product;

  const [product,      setProduct]      = useState(productFromState);
  const [selectedSize, setSelectedSize] = useState(location.state?.initialSize || null);
  const [quantity,     setQuantity]     = useState(location.state?.initialQuantity || 1);
  const [cartItemId]                    = useState(location.state?.cartItemId || null);
  const [error,        setError]        = useState("");
  const [imageIndex,   setImageIndex]   = useState(0);
  const [showSuccess,  setShowSuccess]  = useState(false);
  const [adding,       setAdding]       = useState(false);

  useEffect(() => {
    if (!productFromState) return;
    fetch(`http://localhost:5000/api/auth/products/${productFromState._id}`)
      .then(r => r.json()).then(d => setProduct(d)).catch(() => {});
  }, [productFromState?._id]);

  if (!product) return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100 }}><Hearder /></div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 16 }}>No product selected.</div>
      <Footer />
    </div>
  );

  const images = product.images?.length > 0
    ? product.images.map(img => img.startsWith("http") ? img : `http://localhost:5000/uploads/${img}`)
    : ["/placeholder.jpg"];

  const getPriceForSize = (size) => {
    if (!product.sizes) return "N/A";
    if (size && product.sizes[size]) return product.sizes[size].price.toLocaleString();
    const f = Object.values(product.sizes)[0];
    return f ? f.price.toLocaleString() : "N/A";
  };
  const getStockForSize = (size) => (!product.sizes || !size) ? 0 : (product.sizes[size]?.quantity || 0);
  const inStock = selectedSize
    ? getStockForSize(selectedSize) > 0
    : product.sizes && Object.values(product.sizes).some(s => s.quantity > 0);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token)                         { setError("Please log in to add items to cart."); return; }
    if (!selectedSize || quantity < 1)  { setError("Please select a size."); return; }
    const stock = product.sizes[selectedSize]?.quantity || 0;
    if (quantity > stock)               { setError(`Only ${stock} items available in size ${selectedSize}.`); return; }

    setAdding(true); setError("");
    const price  = product.sizes[selectedSize].price;
    const url    = cartItemId ? `http://localhost:5000/api/auth/cart/${cartItemId}` : "http://localhost:5000/api/auth/cart/add";
    const method = cartItemId ? "PUT" : "POST";

    try {
      const res  = await fetch(url, {
        method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: product._id, productName: product.productName, size: selectedSize, quantity, price }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to add to cart."); setAdding(false); return; }
      setShowSuccess(true);
    } catch { setError("Server error. Please try again."); }
    setAdding(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100 }}><Hearder /></div>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 60px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontSize: 13, color: "#9ca3af" }}>
          <span onClick={() => window.history.back()} style={{ color: P, cursor: "pointer", fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
          >← Back</span>
          <span>›</span>
          <span style={{ textTransform: "capitalize" }}>{product.category}</span>
          <span>›</span>
          <span style={{ color: "#374151", fontWeight: 500 }}>{product.productName}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
          {/* Images */}
          <div>
            <div style={{ borderRadius: 16, overflow: "hidden", background: "#f9fafb", border: "1.5px solid #f3f4f6", marginBottom: 14, height: 480, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={images[imageIndex]} alt={product.productName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            </div>
            {images.length > 1 && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {images.map((img, i) => (
                  <div key={i} onClick={() => setImageIndex(i)} style={{
                    width: 72, height: 72, borderRadius: 9, overflow: "hidden",
                    border: `2px solid ${i === imageIndex ? P : "#f3f4f6"}`,
                    cursor: "pointer", background: "#f9fafb", flexShrink: 0, transition: "border-color 0.18s",
                    boxShadow: i === imageIndex ? "0 0 0 3px rgba(236,72,153,0.15)" : "none",
                  }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            {product.category && (
              <span style={{ background: PL, border: "1px solid #fce7f3", color: P, fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {product.category}
              </span>
            )}

            <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, color: "#111827", marginTop: 14, marginBottom: 8, letterSpacing: "-0.01em" }}>
              {product.productName}
            </h1>

            <div style={{ fontSize: 28, fontWeight: 800, color: P, marginBottom: 18 }}>
              LKR {getPriceForSize(selectedSize)}
            </div>

            {/* Stock indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: inStock ? "#22c55e" : "#ef4444" }} />
              <span style={{ color: inStock ? "#16a34a" : "#dc2626", fontSize: 14, fontWeight: 600 }}>
                {inStock ? (selectedSize ? `${getStockForSize(selectedSize)} in stock` : "In Stock") : "Out of Stock"}
              </span>
            </div>

            {/* Size selector */}
            {product.sizes && (
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Size {selectedSize && <span style={{ color: P }}>— {selectedSize} selected</span>}
                </label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {Object.entries(product.sizes).map(([size, { quantity }]) => {
                    const available = quantity > 0;
                    const selected  = selectedSize === size;
                    return (
                      <button key={size} onClick={() => { if (available) { setSelectedSize(size); setError(""); } }} disabled={!available} style={{
                        width: 52, height: 52, borderRadius: 9,
                        border: selected ? `2px solid ${P}` : "1.5px solid #e5e7eb",
                        background: selected ? PL : "#fff",
                        color: available ? (selected ? P : "#374151") : "#d1d5db",
                        fontSize: 14, fontWeight: 700, cursor: available ? "pointer" : "not-allowed",
                        fontFamily: "inherit", transition: "all 0.15s",
                        textDecoration: !available ? "line-through" : "none",
                        boxShadow: selected ? "0 0 0 3px rgba(236,72,153,0.15)" : "none",
                      }}>
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Quantity</label>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {["-", "+"].map((sym, i) => (
                  <button key={sym} onClick={() => setQuantity(q => i === 0 ? Math.max(1, q - 1) : Math.min(selectedSize ? getStockForSize(selectedSize) : 99, q + 1))} style={{
                    width: 40, height: 40, borderRadius: 9, background: "#fff",
                    border: "1.5px solid #e5e7eb", color: "#374151", fontSize: 20,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = P; e.currentTarget.style.color = P; e.currentTarget.style.background = PL; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; e.currentTarget.style.background = "#fff"; }}
                  >{sym}</button>
                ))}
                <span style={{ fontSize: 20, fontWeight: 800, color: "#111827", minWidth: 28, textAlign: "center" }}>{quantity}</span>
              </div>
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 9, padding: "11px 14px", color: "#dc2626", fontSize: 14, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                ⚠️ {error}
              </div>
            )}

            <button onClick={handleAddToCart} disabled={!inStock || adding} style={{
              width: "100%", padding: "14px",
              background: (!inStock || adding) ? "#f3f4f6" : `linear-gradient(135deg,${P},#f472b6)`,
              color: (!inStock || adding) ? "#9ca3af" : "#fff",
              border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700,
              cursor: (!inStock || adding) ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "all 0.2s",
              boxShadow: (!inStock || adding) ? "none" : "0 4px 18px rgba(236,72,153,0.40)",
              marginBottom: 14,
            }}
              onMouseEnter={e => { if (inStock && !adding) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(236,72,153,0.45)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = (!inStock || adding) ? "none" : "0 4px 18px rgba(236,72,153,0.40)"; }}
            >
              {adding ? "Adding…" : !inStock ? "Out of Stock" : "🛍️ Add to Cart"}
            </button>

            {/* Trust badges */}
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", paddingTop: 18, borderTop: "1px solid #f3f4f6" }}>
              {[
                { icon: "🔒", text: "Secure Payment"  },
                { icon: "🚚", text: "Fast Delivery"   },
                { icon: "↩️", text: "Easy Returns"    },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span style={{ color: "#6b7280", fontSize: 13, fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Success modal */}
      {showSuccess && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "44px 40px", textAlign: "center", maxWidth: 360, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: PL, border: "2px solid #fce7f3", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>🛍️</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Added to Cart! 🎉</h3>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 26 }}>
              <strong style={{ color: "#374151" }}>{product.productName}</strong> ({selectedSize}) has been added to your cart.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setShowSuccess(false); window.history.back(); }} style={{ flex: 1, padding: "11px", borderRadius: 9, background: "#fff", border: "1.5px solid #e5e7eb", color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Keep Shopping
              </button>
              <button onClick={() => { setShowSuccess(false); window.location.href = "/viewcart"; }} style={{ flex: 1, padding: "11px", borderRadius: 9, background: `linear-gradient(135deg,${P},#f472b6)`, color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                View Cart →
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @media (max-width: 768px) { div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
export default Addtocart;