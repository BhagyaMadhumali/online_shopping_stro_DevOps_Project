import React, { useState, useEffect } from "react";
import Hearder from "./Hearder";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setLoading(false); return; }
        const res = await fetch("http://localhost:5000/api/auth/order/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setOrders(data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    const s = (status || "pending").toLowerCase();
    if (s === "delivered") return { color: "#4ade80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.2)" };
    if (s === "processing") return { color: "#D4A064", bg: "rgba(212,160,100,0.1)", border: "rgba(212,160,100,0.2)" };
    if (s === "shipped") return { color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)" };
    if (s === "cancelled") return { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" };
    return { color: "#8a7a6a", bg: "rgba(138,122,106,0.1)", border: "rgba(138,122,106,0.2)" };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", fontFamily: "'Montserrat', sans-serif" }}>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100 }}><Hearder /></div>

      <main style={{ paddingTop: 100, maxWidth: 1000, margin: "0 auto", padding: "100px 24px 80px" }}>
        {/* Header */}
        <div style={{
          marginBottom: 60,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)",
        }}>
          <p style={{ color: "#D4A064", fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
            Your Journey
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 4vw, 56px)",
            fontWeight: 300, color: "#F5EDD8",
          }}>
            Order <span style={{ fontStyle: "italic", color: "#D4A064", fontWeight: 700 }}>History</span>
          </h1>
          {!loading && (
            <p style={{ color: "#5a5050", fontSize: 13, marginTop: 8 }}>
              {orders.length} order{orders.length !== 1 ? "s" : ""} placed
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: 120, background: "#161616", borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.04)",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 64, opacity: 0.2, marginBottom: 24 }}>🧾</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, color: "#F5EDD8", fontWeight: 300, marginBottom: 12 }}>
              No Orders <span style={{ color: "#D4A064", fontStyle: "italic" }}>Yet</span>
            </h3>
            <p style={{ color: "#5a5050", fontSize: 14 }}>Your order history will appear here.</p>
          </div>
        )}

        {/* Orders */}
        {!loading && orders.map((order, idx) => {
          const status = getStatusColor(order.status);
          const grandTotal = (order.items || []).reduce((t, i) => t + i.price * i.quantity, 0);
          const isExpanded = expandedOrder === (order._id || order.id);
          const dateStr = order.date ? new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";

          return (
            <div key={order._id || order.id} style={{
              background: "#161616",
              border: `1px solid ${isExpanded ? "rgba(212,160,100,0.3)" : "rgba(255,255,255,0.05)"}`,
              borderRadius: 2, marginBottom: 16, overflow: "hidden",
              transition: "all 0.3s ease",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: `${idx * 0.08}s`,
            }}>
              {/* Order Header */}
              <div
                onClick={() => setExpandedOrder(isExpanded ? null : (order._id || order.id))}
                style={{
                  padding: "24px 28px", display: "flex", alignItems: "center",
                  justifyContent: "space-between", cursor: "pointer",
                  background: isExpanded ? "rgba(212,160,100,0.04)" : "transparent",
                  transition: "background 0.3s",
                }}
                onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: "#8a7a6a", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 4 }}>Order ID</div>
                    <div style={{ color: "#C8B8A2", fontSize: 12, fontFamily: "monospace" }}>
                      #{(order._id || order.id || "").toString().slice(-8).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#8a7a6a", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 4 }}>Date</div>
                    <div style={{ color: "#C8B8A2", fontSize: 12 }}>{dateStr}</div>
                  </div>
                  <div>
                    <div style={{ color: "#8a7a6a", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 4 }}>Items</div>
                    <div style={{ color: "#C8B8A2", fontSize: 12 }}>{(order.items || []).length}</div>
                  </div>
                  <div>
                    <div style={{ color: "#8a7a6a", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 4 }}>Total</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", color: "#D4A064", fontSize: 18 }}>
                      LKR {grandTotal.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{
                    background: status.bg, border: `1px solid ${status.border}`,
                    color: status.color, padding: "5px 14px", fontSize: 9,
                    letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, borderRadius: 20,
                  }}>
                    {order.status || "Pending"}
                  </span>
                  <span style={{
                    color: "#8a7a6a", fontSize: 16, transition: "transform 0.3s",
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}>⌄</span>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div style={{
                  borderTop: "1px solid rgba(212,160,100,0.1)",
                  padding: "24px 28px",
                }}>
                  {/* Address */}
                  {order.address && (
                    <div style={{ marginBottom: 24, padding: "16px 20px", background: "rgba(212,160,100,0.04)", border: "1px solid rgba(212,160,100,0.1)", borderRadius: 1 }}>
                      <div style={{ color: "#D4A064", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 6 }}>
                        📍 Delivery Address
                      </div>
                      <div style={{ color: "#C8B8A2", fontSize: 13 }}>
                        {order.address.no}, {order.address.street}, {order.address.city}, {order.address.province}
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {(order.items || []).map((item, i) => (
                      <div key={i} style={{
                        display: "flex", gap: 20, alignItems: "center",
                        paddingBottom: 16,
                        borderBottom: i < order.items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      }}>
                        <div style={{ width: 72, height: 72, flexShrink: 0, overflow: "hidden", borderRadius: 1, background: "#1a1a1a" }}>
                          <img
                            src={item.img || "https://via.placeholder.com/72x72.png?text=Item"}
                            alt={item.productName || item.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#F5EDD8", marginBottom: 4 }}>
                            {item.productName || item.name}
                          </div>
                          <div style={{ display: "flex", gap: 16 }}>
                            <span style={{ color: "#8a7a6a", fontSize: 11, letterSpacing: "0.1em" }}>Size: <span style={{ color: "#C8B8A2" }}>{item.size || "—"}</span></span>
                            <span style={{ color: "#8a7a6a", fontSize: 11, letterSpacing: "0.1em" }}>Qty: <span style={{ color: "#C8B8A2" }}>{item.quantity}</span></span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "'Cormorant Garamond', serif", color: "#D4A064", fontSize: 18 }}>
                            LKR {(item.price * item.quantity).toLocaleString()}
                          </div>
                          <div style={{ color: "#5a5050", fontSize: 11 }}>LKR {item.price?.toLocaleString()} each</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Grand total */}
                  <div style={{
                    marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(212,160,100,0.15)",
                    display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 24,
                  }}>
                    <span style={{ color: "#8a7a6a", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>Grand Total</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#D4A064" }}>
                      LKR {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,700&family=Montserrat:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}

export default OrderHistory;