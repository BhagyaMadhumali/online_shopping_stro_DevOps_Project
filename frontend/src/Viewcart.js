import React, { useState, useEffect } from "react";
import Hearder from "./Hearder";
import Footer  from "./Footer";
import { useNavigate } from "react-router-dom";

const P  = "#ec4899";
const PH = "#db2777";
const PL = "#fdf2f8";

function ViewCart() {
  const [cartItems,     setCartItems]     = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCheckout,  setShowCheckout]  = useState(false);
  const [showPayment,   setShowPayment]   = useState(false);
  const [showSuccess,   setShowSuccess]   = useState(false);
  const [loading,       setLoading]       = useState(true);
  const [address, setAddress] = useState({ no: "", street: "", city: "", province: "" });
  const [phone1,  setPhone1]  = useState("");
  const [phone2,  setPhone2]  = useState("");
  const [card,    setCard]    = useState({ bank: "", type: "", number: "", expiry: "", cvv: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }
      try {
        const res  = await fetch("http://localhost:5000/api/auth/cart/items", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok) setCartItems(data.map(i => ({ id: i.id, img: i.img || "/placeholder.jpg", name: i.productName, size: i.size, quantity: i.quantity, price: i.price })).reverse());
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const toggleSelect = item => {
    const has = selectedItems.find(i => i.id === item.id);
    setSelectedItems(has ? selectedItems.filter(i => i.id !== item.id) : [...selectedItems, item]);
  };
  const removeItem   = id  => { setCartItems(c => c.filter(i => i.id !== id)); setSelectedItems(s => s.filter(i => i.id !== id)); };
  const total        = selectedItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const capitalize   = t  => t.trim().charAt(0).toUpperCase() + t.trim().slice(1).toLowerCase();

  const placeOrder = () => {
    if (!selectedItems.length) { alert("Select at least one item."); return; }
    if (!address.no || !address.street || !address.city || !address.province) { alert("Fill in your complete address."); return; }
    if (!/^\d{10}$/.test(phone1) && !/^\d{10}$/.test(phone2)) { alert("Enter a valid 10-digit phone number."); return; }
    setShowPayment(true);
  };

  const confirmOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch("http://localhost:5000/api/auth/order/place", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: selectedItems, address, phone1, phone2 }),
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems(c => c.filter(i => !selectedItems.find(s => s.id === i.id)));
        setSelectedItems([]); setShowPayment(false); setShowCheckout(false); setShowSuccess(true);
        setAddress({ no: "", street: "", city: "", province: "" }); setPhone1(""); setPhone2("");
        setCard({ bank: "", type: "", number: "", expiry: "", cvv: "" });
      } else alert(data.message || "Failed to place order.");
    } catch { alert("Server error while placing order."); }
  };

  const iStyle = { width: "100%", padding: "11px 14px", borderRadius: 9, border: "1.5px solid #e5e7eb", fontSize: 14, color: "#1f1f1f", outline: "none", fontFamily: "inherit", background: "#fafafa", transition: "all 0.2s", boxSizing: "border-box" };
  const lStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };
  const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" };
  const modal   = { background: "#fff", borderRadius: 16, padding: "36px 32px", width: "100%", maxWidth: 500, maxHeight: "92vh", overflowY: "auto", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100 }}><Hearder /></div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: P, fontSize: 16, fontWeight: 600 }}>Loading your cart…</div>
      </div>
      <Footer />
    </div>
  );

  if (!cartItems.length) return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter',sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100 }}><Hearder /></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
        <div style={{ fontSize: 72, opacity: 0.15 }}>🛍️</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#111827" }}>Your cart is <span style={{ color: P }}>empty</span></h2>
        <p style={{ color: "#6b7280", fontSize: 15 }}>Find something you'll love.</p>
        <button onClick={() => navigate("/home")} style={{ background: `linear-gradient(135deg,${P},#f472b6)`, color: "#fff", border: "none", padding: "12px 32px", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(236,72,153,0.35)" }}>Shop Now</button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100 }}><Hearder /></div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 24px 60px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Shopping Cart</h1>
          <p style={{ color: "#6b7280", fontSize: 14 }}>{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} · Tick items to checkout</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
          {/* Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cartItems.map(item => {
              const sel = !!selectedItems.find(i => i.id === item.id);
              return (
                <div key={item.id} style={{
                  background: sel ? PL : "#fff", border: `1.5px solid ${sel ? "#fce7f3" : "#f3f4f6"}`,
                  borderRadius: 12, padding: "18px 20px",
                  display: "flex", gap: 16, alignItems: "center",
                  transition: "all 0.2s", boxShadow: sel ? "0 2px 12px rgba(236,72,153,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  {/* Checkbox */}
                  <div onClick={() => toggleSelect(item)} style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    border: `2px solid ${sel ? P : "#d1d5db"}`,
                    background: sel ? P : "#fff",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}>
                    {sel && <span style={{ color: "#fff", fontSize: 13, fontWeight: 800, lineHeight: 1 }}>✓</span>}
                  </div>
                  {/* Image */}
                  <div style={{ width: 80, height: 80, borderRadius: 9, overflow: "hidden", flexShrink: 0, background: "#f9fafb", border: "1px solid #f3f4f6" }}>
                    <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: "#111827", fontSize: 16, fontWeight: 600, marginBottom: 5 }}>{item.name}</h3>
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      <span style={{ color: "#6b7280", fontSize: 13 }}>Size: <strong style={{ color: "#374151" }}>{item.size}</strong></span>
                      <span style={{ color: "#6b7280", fontSize: 13 }}>Qty: <strong style={{ color: "#374151" }}>{item.quantity}</strong></span>
                    </div>
                  </div>
                  {/* Price + remove */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ color: P, fontSize: 18, fontWeight: 700, marginBottom: 5 }}>LKR {(item.price * item.quantity).toLocaleString()}</div>
                    <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 10 }}>LKR {item.price.toLocaleString()} × {item.quantity}</div>
                    <button onClick={() => removeItem(item.id)} style={{ background: "#fff", border: "1px solid #fee2e2", color: "#ef4444", padding: "5px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
                    >Remove</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div style={{ background: "#fff", border: "1.5px solid #f3f4f6", borderRadius: 14, padding: "26px 24px", position: "sticky", top: 90, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: 19, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Order Summary</h3>
            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 16, marginBottom: 16 }}>
              {!selectedItems.length ? (
                <p style={{ color: "#9ca3af", fontSize: 14, textAlign: "center", padding: "10px 0" }}>Tick items above to see total</p>
              ) : selectedItems.map(i => (
                <div key={i.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ color: "#6b7280", fontSize: 13, maxWidth: 170 }}>{i.name} ×{i.quantity}</span>
                  <span style={{ color: "#374151", fontSize: 13 }}>LKR {(i.price * i.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 16, marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#374151", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</span>
              <span style={{ color: P, fontSize: 22, fontWeight: 800 }}>LKR {total.toLocaleString()}</span>
            </div>
            <button onClick={() => setShowCheckout(true)} disabled={!selectedItems.length} style={{
              width: "100%", padding: "13px",
              background: selectedItems.length ? `linear-gradient(135deg,${P},#f472b6)` : "#f3f4f6",
              color: selectedItems.length ? "#fff" : "#9ca3af",
              border: "none", borderRadius: 9, fontSize: 15, fontWeight: 700,
              cursor: selectedItems.length ? "pointer" : "not-allowed",
              fontFamily: "inherit", transition: "all 0.2s",
              boxShadow: selectedItems.length ? "0 4px 16px rgba(236,72,153,0.30)" : "none",
            }}
              onMouseEnter={e => { if (selectedItems.length) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(236,72,153,0.35)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = selectedItems.length ? "0 4px 16px rgba(236,72,153,0.30)" : "none"; }}
            >Proceed to Checkout</button>
            <p style={{ color: "#9ca3af", fontSize: 11, textAlign: "center", marginTop: 10 }}>🔒 Secure & encrypted checkout</p>
          </div>
        </div>
      </div>

      {/* Checkout modal */}
      {showCheckout && (
        <div style={overlay}>
          <div style={modal}>
            <button onClick={() => setShowCheckout(false)} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", color: "#9ca3af", fontSize: 22, cursor: "pointer" }}>✕</button>
            <h3 style={{ fontSize: 21, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Shipping Address</h3>
            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 24 }}>Where should we deliver your order?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                <div><label style={lStyle}>No.</label><input value={address.no} onChange={e => setAddress({ ...address, no: e.target.value })} placeholder="12" style={iStyle} onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }} /></div>
                <div><label style={lStyle}>Street</label><input value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} placeholder="Colombo Road" style={iStyle} onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={lStyle}>City</label><input value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} placeholder="Colombo" style={iStyle} onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }} /></div>
                <div><label style={lStyle}>Province</label><input value={address.province} onChange={e => setAddress({ ...address, province: e.target.value })} placeholder="Western" style={iStyle} onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={lStyle}>Phone 1</label><input value={phone1} onChange={e => setPhone1(e.target.value.replace(/\D/g, ""))} placeholder="0771234567" maxLength={10} style={iStyle} onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }} /></div>
                <div><label style={lStyle}>Phone 2 (opt.)</label><input value={phone2} onChange={e => setPhone2(e.target.value.replace(/\D/g, ""))} placeholder="Optional" maxLength={10} style={iStyle} onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }} /></div>
              </div>
            </div>
            <div style={{ marginTop: 20, padding: "14px 16px", background: PL, border: "1px solid #fce7f3", borderRadius: 9, display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#374151", fontSize: 13, fontWeight: 700 }}>Order Total</span>
              <span style={{ color: P, fontSize: 20, fontWeight: 800 }}>LKR {total.toLocaleString()}</span>
            </div>
            <button onClick={placeOrder} style={{ width: "100%", marginTop: 18, padding: "13px", background: `linear-gradient(135deg,${P},#f472b6)`, color: "#fff", border: "none", borderRadius: 9, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(236,72,153,0.30)" }}
              onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg,${PH},${P})`}
              onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg,${P},#f472b6)`}
            >Continue to Payment →</button>
          </div>
        </div>
      )}

      {/* Payment modal */}
      {showPayment && (
        <div style={overlay}>
          <div style={modal}>
            <button onClick={() => setShowPayment(false)} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", color: "#9ca3af", fontSize: 22, cursor: "pointer" }}>✕</button>
            <h3 style={{ fontSize: 21, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Payment Details</h3>
            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 20 }}>Your payment info is securely encrypted 🔒</p>
            {/* Card preview */}
            <div style={{ background: `linear-gradient(135deg, ${P}, #f472b6)`, borderRadius: 12, padding: "20px 22px", marginBottom: 22 }}>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 14 }}>FASHIONSTORE CARD</div>
              <div style={{ color: "#fff", fontFamily: "monospace", fontSize: 18, letterSpacing: "0.18em", marginBottom: 12 }}>{card.number ? card.number.replace(/(\d{4})/g, "$1 ").trim() : "•••• •••• •••• ••••"}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>EXP: {card.expiry || "MM/YY"}</span>
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>CVV: •••</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={lStyle}>Bank</label>
                  <select value={card.bank} onChange={e => setCard({ ...card, bank: e.target.value })} style={{ ...iStyle, cursor: "pointer", appearance: "none" }} onFocus={e => { e.target.style.borderColor = P; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; }}>
                    <option value="">Select</option>
                    {["BOC","Sampath","HNB","Commercial","NSB","Seylan"].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div><label style={lStyle}>Card Type</label>
                  <select value={card.type} onChange={e => setCard({ ...card, type: e.target.value })} style={{ ...iStyle, cursor: "pointer", appearance: "none" }} onFocus={e => { e.target.style.borderColor = P; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; }}>
                    <option value="">Select</option>
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                  </select>
                </div>
              </div>
              <div><label style={lStyle}>Card Number</label><input value={card.number} onChange={e => setCard({ ...card, number: e.target.value.replace(/\D/g, "").slice(0, 16) })} placeholder="•••• •••• •••• ••••" style={iStyle} onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={lStyle}>Expiry (MM/YY)</label><input value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} placeholder="MM/YY" maxLength={5} style={iStyle} onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }} /></div>
                <div><label style={lStyle}>CVV</label><input type="password" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })} placeholder="•••" maxLength={3} style={iStyle} onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }} /></div>
              </div>
            </div>
            <button onClick={confirmOrder} style={{ width: "100%", marginTop: 22, padding: "13px", background: `linear-gradient(135deg,${P},#f472b6)`, color: "#fff", border: "none", borderRadius: 9, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(236,72,153,0.30)" }}
              onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg,${PH},${P})`}
              onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg,${P},#f472b6)`}
            >Confirm & Pay — LKR {total.toLocaleString()}</button>
          </div>
        </div>
      )}

      {/* Success modal */}
      {showSuccess && (
        <div style={overlay}>
          <div style={{ ...modal, textAlign: "center", padding: "52px 40px" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: PL, border: `2px solid #fce7f3`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 32 }}>✅</div>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Order Placed! 🎉</h3>
            <p style={{ color: "#6b7280", fontSize: 15, marginBottom: 30 }}>Your order has been confirmed. We'll notify you when it ships.</p>
            <button onClick={() => { setShowSuccess(false); navigate("/home"); }} style={{ background: `linear-gradient(135deg,${P},#f472b6)`, color: "#fff", border: "none", padding: "12px 36px", borderRadius: 9, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Continue Shopping</button>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: #9ca3af !important; }
        select option { background: #fff; color: #374151; }
      `}</style>
      <Footer />
    </div>
  );
}
export default ViewCart;