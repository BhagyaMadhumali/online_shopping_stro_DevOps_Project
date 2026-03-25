import React, { useState, useEffect } from "react";
import Hearder from "./Hearder";
import Footer  from "./Footer";

const P  = "#ec4899";
const PH = "#db2777";
const PL = "#fdf2f8";

function Profile() {
  const [user, setUser] = useState({ firstName: "Bhagya", lastName: "Madhumali", email: "bhagya@email.com", streetNumber: "No. 123", streetName: "Colombo Road", city: "Colombo", province: "Western Province" });
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res  = await fetch("http://localhost:5000/api/auth/order/myorders", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok) {
          setOrders(data);
          if (data.length > 0) {
            const u = data[0].user || {}, a = data[0].address || {};
            setUser(p => ({ ...p, firstName: u.firstName || p.firstName, lastName: u.lastName || p.lastName, email: u.email || p.email, streetNumber: a.no || p.streetNumber, streetName: a.street || p.streetName, city: a.city || p.city, province: a.province || p.province }));
          }
        }
      } catch {}
    };
    load();
  }, []);

  const openModal = () => { setEditForm({ ...user }); setShowModal(true); };
  const handleUpdate = () => {
    setUpdateLoading(true);
    setTimeout(() => { setUser({ ...editForm }); setUpdateLoading(false); setUpdateSuccess(true); setTimeout(() => { setUpdateSuccess(false); setShowModal(false); }, 1500); }, 800);
  };

  const fullName   = `${user.firstName} ${user.lastName}`;
  const initials   = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const totalSpend = orders.reduce((t, o) => t + (o.items || []).reduce((s, i) => s + i.price * i.quantity, 0), 0);

  const iStyle = { width: "100%", padding: "11px 14px", borderRadius: 9, border: "1.5px solid #e5e7eb", fontSize: 14, color: "#1f1f1f", outline: "none", fontFamily: "inherit", background: "#fafafa", transition: "all 0.2s", boxSizing: "border-box" };
  const lStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100 }}><Hearder /></div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 24px 60px" }}>
        {/* Profile card */}
        <div style={{
          background: "#fff", border: "1.5px solid #f3f4f6", borderRadius: 16, padding: "28px 30px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 24, flexWrap: "wrap", gap: 20,
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)", borderTop: `4px solid ${P}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{
              width: 70, height: 70, borderRadius: "50%",
              background: `linear-gradient(135deg, ${P}, #f472b6)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, fontWeight: 800, color: "#fff", flexShrink: 0,
              boxShadow: "0 4px 16px rgba(236,72,153,0.35)",
            }}>{initials}</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{fullName}</h2>
                <span style={{ background: PL, border: "1px solid #fce7f3", color: P, fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20 }}>Member</span>
              </div>
              <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 2 }}>{user.email}</p>
              <p style={{ color: "#9ca3af", fontSize: 13 }}>📍 {user.streetNumber}, {user.streetName}, {user.city}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: P }}>{orders.length}</div>
              <div style={{ color: "#9ca3af", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Orders</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: P }}>LKR {(totalSpend / 1000).toFixed(0)}K</div>
              <div style={{ color: "#9ca3af", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Spent</div>
            </div>
            <button onClick={openModal} style={{ background: "#fff", border: "1.5px solid #fce7f3", color: P, padding: "9px 20px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s" }}
              onMouseEnter={e => { e.currentTarget.style.background = PL; e.currentTarget.style.borderColor = P; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#fce7f3"; }}
            >✏ Edit Profile</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, borderBottom: "1.5px solid #f3f4f6", marginBottom: 28 }}>
          {[{ key: "overview", label: "Overview" }, { key: "orders", label: `Orders (${orders.length})` }].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "11px 22px", fontSize: 14,
              color: activeTab === t.key ? P : "#6b7280",
              fontWeight: activeTab === t.key ? 700 : 500,
              borderBottom: `2px solid ${activeTab === t.key ? P : "transparent"}`,
              marginBottom: -2, fontFamily: "inherit", transition: "all 0.18s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { title: "Personal Information", rows: [{ l: "Full Name", v: fullName }, { l: "Email", v: user.email }] },
              { title: "Delivery Address",     rows: [{ l: "Street", v: `${user.streetNumber}, ${user.streetName}` }, { l: "City", v: user.city }, { l: "Province", v: user.province }] },
            ].map(card => (
              <div key={card.title} style={{ background: "#fff", border: "1.5px solid #f3f4f6", borderRadius: 12, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid #f9fafb" }}>{card.title}</h3>
                {card.rows.map(({ l, v }) => (
                  <div key={l} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #f9fafb" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>
            ))}

            {/* Quick actions */}
            <div style={{ background: "#fff", border: "1.5px solid #f3f4f6", borderRadius: 12, padding: "22px 24px", gridColumn: "1/-1", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 18 }}>Quick Actions</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12 }}>
                {[
                  { icon: "📦", label: "Order History",    action: () => setActiveTab("orders")                  },
                  { icon: "♡",  label: "Wish List",        action: () => window.location.href = "/vistlist"      },
                  { icon: "🛍️", label: "Shop Now",         action: () => window.location.href = "/home"          },
                  { icon: "✏",  label: "Edit Profile",     action: openModal                                     },
                ].map(({ icon, label, action }) => (
                  <button key={label} onClick={action} style={{
                    background: "#fafafa", border: "1.5px solid #f3f4f6",
                    borderRadius: 10, padding: "15px 14px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 10,
                    color: "#374151", fontSize: 14, fontWeight: 500, fontFamily: "inherit",
                    transition: "all 0.18s", textAlign: "left",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = PL; e.currentTarget.style.borderColor = "#fce7f3"; e.currentTarget.style.color = P; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#f3f4f6"; e.currentTarget.style.color = "#374151"; }}
                  >
                    <span style={{ fontSize: 20 }}>{icon}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div>
            {orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 56, opacity: 0.15, marginBottom: 16 }}>📦</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>No orders yet</h3>
                <p style={{ color: "#9ca3af", fontSize: 14 }}>Your order history will appear here.</p>
              </div>
            ) : orders.map(order => {
              const grand = (order.items || []).reduce((t, i) => t + i.price * i.quantity, 0);
              const isExp = expandedOrder === (order._id || order.id);
              return (
                <div key={order._id || order.id} style={{ background: "#fff", border: `1.5px solid ${isExp ? "#fce7f3" : "#f3f4f6"}`, borderRadius: 12, marginBottom: 12, overflow: "hidden", transition: "all 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div onClick={() => setExpandedOrder(isExp ? null : (order._id || order.id))} style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", flexWrap: "wrap", gap: 12, background: isExp ? PL : "#fff" }}>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                      {[
                        { l: "Order ID", v: `#${(order._id || order.id || "").toString().slice(-8).toUpperCase()}`, mono: true },
                        { l: "Date", v: order.date ? new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—" },
                        { l: "Items", v: (order.items || []).length },
                      ].map(({ l, v, mono }) => (
                        <div key={l}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{l}</div>
                          <div style={{ fontSize: 13, color: "#374151", fontFamily: mono ? "monospace" : "inherit", fontWeight: 600 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: P }}>LKR {grand.toLocaleString()}</span>
                      <span style={{ color: "#9ca3af", fontSize: 18, transform: isExp ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s", display: "inline-block" }}>⌄</span>
                    </div>
                  </div>
                  {isExp && (
                    <div style={{ borderTop: "1px solid #f3f4f6", padding: "18px 22px" }}>
                      {order.address && (
                        <div style={{ background: PL, border: "1px solid #fce7f3", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#6b7280", fontSize: 13 }}>
                          📍 {order.address.no}, {order.address.street}, {order.address.city}, {order.address.province}
                        </div>
                      )}
                      {(order.items || []).map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 0", borderBottom: i < order.items.length - 1 ? "1px solid #f9fafb" : "none" }}>
                          <div style={{ width: 58, height: 58, borderRadius: 8, overflow: "hidden", background: "#f3f4f6", flexShrink: 0, border: "1px solid #f3f4f6" }}>
                            <img src={item.img || "https://via.placeholder.com/58?text=?"} alt={item.productName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ color: "#111827", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{item.productName || item.name}</div>
                            <div style={{ display: "flex", gap: 14 }}>
                              <span style={{ color: "#6b7280", fontSize: 12 }}>Size: <strong style={{ color: "#374151" }}>{item.size || "—"}</strong></span>
                              <span style={{ color: "#6b7280", fontSize: 12 }}>Qty: <strong style={{ color: "#374151" }}>{item.quantity}</strong></span>
                            </div>
                          </div>
                          <div style={{ color: P, fontSize: 16, fontWeight: 700 }}>LKR {(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 14, borderTop: "1px solid #f3f4f6" }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 2 }}>Grand Total</div>
                          <div style={{ color: P, fontSize: 22, fontWeight: 800 }}>LKR {grand.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "36px 32px", width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", color: "#9ca3af", fontSize: 22, cursor: "pointer" }}>✕</button>
            <h3 style={{ fontSize: 21, fontWeight: 800, color: "#111827", marginBottom: 24 }}>Edit Profile</h3>
            {updateSuccess ? (
              <div style={{ textAlign: "center", padding: "28px 0" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: PL, border: "2px solid #fce7f3", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 26 }}>✅</div>
                <p style={{ color: P, fontWeight: 700, fontSize: 14, letterSpacing: "0.06em" }}>PROFILE UPDATED!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div><label style={lStyle}>First Name</label><input value={editForm.firstName || ""} onChange={e => setEditForm({ ...editForm, firstName: e.target.value })} style={iStyle} onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }} /></div>
                  <div><label style={lStyle}>Last Name</label><input value={editForm.lastName || ""} onChange={e => setEditForm({ ...editForm, lastName: e.target.value })} style={iStyle} onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }} /></div>
                </div>
                <div><label style={lStyle}>Email</label><input type="email" value={editForm.email || ""} onChange={e => setEditForm({ ...editForm, email: e.target.value })} style={iStyle} onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }} /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                  <div><label style={lStyle}>Street No.</label><input value={editForm.streetNumber || ""} onChange={e => setEditForm({ ...editForm, streetNumber: e.target.value })} style={iStyle} onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }} /></div>
                  <div><label style={lStyle}>Street Name</label><input value={editForm.streetName || ""} onChange={e => setEditForm({ ...editForm, streetName: e.target.value })} style={iStyle} onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }} /></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div><label style={lStyle}>City</label><input value={editForm.city || ""} onChange={e => setEditForm({ ...editForm, city: e.target.value })} style={iStyle} onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }} /></div>
                  <div><label style={lStyle}>Province</label><input value={editForm.province || ""} onChange={e => setEditForm({ ...editForm, province: e.target.value })} style={iStyle} onFocus={e => { e.target.style.borderColor = P; e.target.style.background = PL; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }} /></div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                  <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "11px", borderRadius: 9, background: "#fff", border: "1.5px solid #e5e7eb", color: "#6b7280", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                  <button onClick={handleUpdate} disabled={updateLoading} style={{ flex: 2, padding: "11px", borderRadius: 9, background: updateLoading ? "#f9a8d4" : `linear-gradient(135deg,${P},#f472b6)`, color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: updateLoading ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: updateLoading ? "none" : "0 4px 14px rgba(236,72,153,0.30)" }}>
                    {updateLoading ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: #9ca3af !important; }
      `}</style>
      <Footer />
    </div>
  );
}
export default Profile;