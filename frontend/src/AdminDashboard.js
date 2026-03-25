import React, { useEffect, useState } from "react";
import AdminNavigationbar from "./AdminNavigationbar";

export default function AdminDashboard() {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter]         = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setLoading(false); return; }
        const res = await fetch("http://localhost:5000/api/order/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok || res.status === 200) {
          setOrders(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/order/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch (err) { console.error(err); }
  };

  const filteredOrders = filter === "All"
    ? orders
    : orders.filter(o => (o.status || "Unread") === filter);

  const totalOrders  = orders.length;
  const unreadCount  = orders.filter(o => !o.status || o.status === "Unread").length;
  const readCount    = orders.filter(o => o.status === "Read").length;
  const totalRevenue = orders.reduce((t, o) => t + (o.items || []).reduce((s, i) => s + i.price * i.quantity, 0), 0);

  const statCards = [
    { label: "Total Orders",   value: totalOrders,                       icon: "📋", color: "#6366f1", bg: "#eef2ff" },
    { label: "Unread",         value: unreadCount,                       icon: "🔔", color: "#f59e0b", bg: "#fffbeb" },
    { label: "Read",           value: readCount,                         icon: "✅", color: "#10b981", bg: "#ecfdf5" },
    { label: "Total Revenue",  value: `Rs. ${totalRevenue.toLocaleString()}`, icon: "💰", color: "#8b5cf6", bg: "#f5f3ff" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <AdminNavigationbar />
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 60px" }}>

        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Order Management</h1>
          <p style={{ color: "#6b7280", fontSize: 14 }}>Monitor and process all customer orders</p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          {statCards.map(({ label, value, icon, color, bg }) => (
            <div key={label} style={{
              background: "#fff", borderRadius: 12, padding: "20px 22px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: bg, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 22, flexShrink: 0,
              }}>{icon}</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1.1 }}>{value}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3, fontWeight: 500 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["All", "Unread", "Read"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "8px 20px", borderRadius: 8,
              background: filter === f ? "#6366f1" : "#fff",
              color: filter === f ? "#fff" : "#6b7280",
              border: filter === f ? "1.5px solid #6366f1" : "1.5px solid #e5e7eb",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", transition: "all 0.18s",
            }}
              onMouseEnter={e => { if (filter !== f) { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#6366f1"; } }}
              onMouseLeave={e => { if (filter !== f) { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; } }}
            >{f}</button>
          ))}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: 88, background: "#fff", borderRadius: 12,
                border: "1px solid #e5e7eb",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filteredOrders.length === 0 && (
          <div style={{
            background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb",
            padding: "64px 24px", textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#374151", marginBottom: 8 }}>No orders found</h3>
            <p style={{ color: "#6b7280", fontSize: 14 }}>Orders will appear here once customers start placing them.</p>
          </div>
        )}

        {/* Orders List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredOrders.map((order) => {
            const isExpanded = expandedId === order._id;
            const isUnread   = !order.status || order.status === "Unread";
            const grand      = (order.items || []).reduce((t, i) => t + i.price * i.quantity, 0);
            const dateStr    = new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            const timeStr    = new Date(order.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            return (
              <div key={order._id} style={{
                background: "#fff",
                border: `1.5px solid ${isExpanded ? "#6366f1" : isUnread ? "#fde68a" : "#e5e7eb"}`,
                borderRadius: 12,
                boxShadow: isExpanded ? "0 4px 20px rgba(99,102,241,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
                overflow: "hidden", transition: "all 0.2s",
              }}>
                {/* Unread top bar */}
                {isUnread && (
                  <div style={{ height: 3, background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }} />
                )}

                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : order._id)}
                  style={{
                    padding: "18px 22px",
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", cursor: "pointer",
                    gap: 16, flexWrap: "wrap",
                    background: isExpanded ? "#fafafa" : "transparent",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap", flex: 1, minWidth: 0 }}>
                    {/* Order ID */}
                    <div style={{ minWidth: 120 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Order ID</div>
                      <div style={{ fontSize: 12, color: "#374151", fontFamily: "monospace", fontWeight: 600 }}>
                        #{order._id?.toString().slice(-8).toUpperCase()}
                      </div>
                    </div>
                    {/* Customer */}
                    <div style={{ minWidth: 160 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Customer</div>
                      <div style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>
                        {order.userId?.email || order.userEmail || "—"}
                      </div>
                    </div>
                    {/* Date */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Date</div>
                      <div style={{ fontSize: 13, color: "#374151" }}>{dateStr} · {timeStr}</div>
                    </div>
                    {/* Total */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Total</div>
                      <div style={{ fontSize: 16, color: "#6366f1", fontWeight: 700 }}>Rs. {grand.toLocaleString()}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* Status Badge */}
                    <span style={{
                      padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: isUnread ? "#fffbeb" : "#f0fdf4",
                      color: isUnread ? "#d97706" : "#16a34a",
                      border: `1px solid ${isUnread ? "#fde68a" : "#bbf7d0"}`,
                    }}>
                      {isUnread ? "⏳ Unread" : "✓ Read"}
                    </span>
                    {/* Toggle button */}
                    <button
                      onClick={e => { e.stopPropagation(); updateStatus(order._id, isUnread ? "Read" : "Unread"); }}
                      style={{
                        padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600,
                        background: isUnread ? "#f0fdf4" : "#fffbeb",
                        color: isUnread ? "#16a34a" : "#d97706",
                        border: `1px solid ${isUnread ? "#bbf7d0" : "#fde68a"}`,
                        cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
                      }}
                    >
                      {isUnread ? "Mark Read" : "Mark Unread"}
                    </button>
                    {/* Expand icon */}
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: isExpanded ? "#eef2ff" : "#f9fafb",
                      border: `1px solid ${isExpanded ? "#c7d2fe" : "#e5e7eb"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, color: isExpanded ? "#6366f1" : "#9ca3af",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.25s",
                    }}>⌄</div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid #f3f4f6", padding: "22px 22px 26px" }}>
                    {/* Address & Phone */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 22 }}>
                      <div style={{
                        background: "#f8fafc", border: "1px solid #e5e7eb",
                        borderRadius: 10, padding: "16px 18px",
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                          📍 Delivery Address
                        </div>
                        <div style={{ fontSize: 14, color: "#111827", lineHeight: 1.6 }}>
                          {order.address?.no}, {order.address?.street},<br />
                          {order.address?.city}, {order.address?.province}
                        </div>
                      </div>
                      <div style={{
                        background: "#f8fafc", border: "1px solid #e5e7eb",
                        borderRadius: 10, padding: "16px 18px",
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                          📞 Phone
                        </div>
                        <div style={{ fontSize: 14, color: "#111827" }}>
                          {order.phone1 || "—"}
                          {order.phone2 && <div style={{ color: "#6b7280", marginTop: 4 }}>{order.phone2}</div>}
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                      Order Items
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {(order.items || []).map((item, i) => (
                        <div key={i} style={{
                          display: "flex", gap: 14, alignItems: "center",
                          background: "#f8fafc", borderRadius: 10,
                          padding: "14px 16px", border: "1px solid #e5e7eb",
                        }}>
                          <div style={{
                            width: 64, height: 64, borderRadius: 8, overflow: "hidden",
                            background: "#e5e7eb", flexShrink: 0,
                            border: "1px solid #d1d5db",
                          }}>
                            <img
                              src={item.img || "https://via.placeholder.com/64?text=?"}
                              alt={item.productName || item.name}
                              style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 5 }}>
                              {item.productName || item.name}
                            </div>
                            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                              {[
                                { label: "Size",     value: item.size || "—" },
                                { label: "Qty",      value: item.quantity    },
                                { label: "Price",    value: `Rs. ${item.price?.toLocaleString()}` },
                              ].map(({ label, value }) => (
                                <span key={label} style={{ fontSize: 12, color: "#6b7280" }}>
                                  {label}: <strong style={{ color: "#374151" }}>{value}</strong>
                                </span>
                              ))}
                            </div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#6366f1" }}>
                              Rs. {(item.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Grand Total */}
                    <div style={{
                      marginTop: 16, padding: "14px 18px",
                      background: "#eef2ff", borderRadius: 10,
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      border: "1px solid #c7d2fe",
                    }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Grand Total</span>
                      <span style={{ fontSize: 20, fontWeight: 700, color: "#6366f1" }}>Rs. {grand.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
}