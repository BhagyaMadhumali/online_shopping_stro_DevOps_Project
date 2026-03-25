import React, { useState, useRef, useEffect } from "react";
import AdminNavigationbar from "./AdminNavigationbar";

const initialCustomers = [
  {
    customerId: 1,
    name: "Alice Perera",
    email: "alice@example.com",
    messages: [
      { id: 1, sender: "customer", text: "Do you deliver to Colombo?",  replied: true  },
      { id: 2, sender: "admin",    text: "Yes, we deliver island-wide!"                },
      { id: 3, sender: "customer", text: "Can I return items?",          replied: false },
    ],
    unread: true,
  },
  {
    customerId: 2,
    name: "Nimal Silva",
    email: "nimal@example.com",
    messages: [
      { id: 1, sender: "customer", text: "What sizes are available for Men's shirts?", replied: false },
    ],
    unread: true,
  },
  {
    customerId: 3,
    name: "Sithara Fernando",
    email: "sithara@example.com",
    messages: [
      { id: 1, sender: "customer", text: "Hi, when will the new collection arrive?",       replied: true  },
      { id: 2, sender: "admin",    text: "Our new season collection just dropped! Check the Women's section." },
      { id: 3, sender: "customer", text: "Thank you! Do you have it in petite sizes?",     replied: false },
    ],
    unread: true,
  },
];

function CustomerMessage() {
  const [customers,          setCustomers]          = useState(initialCustomers);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [replyText,          setReplyText]          = useState("");
  const [sending,            setSending]            = useState(false);
  const messagesEndRef = useRef(null);

  const selected = customers.find(c => c.customerId === selectedCustomerId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages.length]);

  const selectCustomer = (id) => {
    setCustomers(prev => prev.map(c => c.customerId === id ? { ...c, unread: false } : c));
    setSelectedCustomerId(id);
    setReplyText("");
  };

  const sendReply = () => {
    if (!replyText.trim() || !selected) return;
    setSending(true);
    setTimeout(() => {
      setCustomers(prev => prev.map(c => {
        if (c.customerId !== selected.customerId) return c;
        return {
          ...c,
          messages: [
            ...c.messages.map(m => m.sender === "customer" && !m.replied ? { ...m, replied: true } : m),
            { id: Date.now(), sender: "admin", text: replyText },
          ],
        };
      }));
      setReplyText("");
      setSending(false);
    }, 350);
  };

  const getUnread = (c) => c.messages.filter(m => m.sender === "customer" && !m.replied).length;
  const totalUnread = customers.reduce((t, c) => t + (c.unread ? getUnread(c) : 0), 0);

  const avatarColor = (name) => {
    const colors = ["#6366f1", "#7c3aed", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', 'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}><AdminNavigationbar /></div>

      <div style={{ flex: 1, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "28px 24px 28px", display: "flex", flexDirection: "column" }}>

        {/* Page Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Customer Messages</h1>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            {totalUnread > 0
              ? <><span style={{ color: "#dc2626", fontWeight: 600 }}>{totalUnread} unread message{totalUnread !== 1 ? "s" : ""}</span> — click a conversation to reply</>
              : "All conversations are up to date."
            }
          </p>
        </div>

        {/* Chat Layout */}
        <div style={{
          flex: 1, display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: 20,
          height: "calc(100vh - 220px)",
          minHeight: 480,
        }}>

          {/* Customer List */}
          <div style={{
            background: "#fff", borderRadius: 12,
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            <div style={{
              padding: "14px 18px", borderBottom: "1px solid #f3f4f6",
              background: "#fafafa",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
                Conversations
              </span>
              <span style={{
                background: "#eef2ff", color: "#6366f1",
                fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 10,
                border: "1px solid #c7d2fe",
              }}>{customers.length}</span>
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {customers.map(customer => {
                const unread     = getUnread(customer);
                const isSelected = selectedCustomerId === customer.customerId;
                const lastMsg    = customer.messages[customer.messages.length - 1];
                const color      = avatarColor(customer.name);

                return (
                  <div
                    key={customer.customerId}
                    onClick={() => selectCustomer(customer.customerId)}
                    style={{
                      padding: "14px 16px", cursor: "pointer",
                      borderBottom: "1px solid #f9fafb",
                      background: isSelected ? "#eef2ff" : "transparent",
                      borderLeft: `3px solid ${isSelected ? "#6366f1" : "transparent"}`,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#f5f3ff"; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                        background: color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 15, fontWeight: 700,
                      }}>
                        {customer.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{customer.name}</span>
                          {customer.unread && unread > 0 && (
                            <span style={{
                              background: "#dc2626", color: "#fff",
                              fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10,
                            }}>{unread}</span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>{customer.email}</div>
                      </div>
                    </div>
                    {lastMsg && (
                      <div style={{
                        fontSize: 12, color: "#6b7280",
                        paddingLeft: 48, overflow: "hidden",
                        textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {lastMsg.sender === "admin" ? "You: " : ""}{lastMsg.text}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Window */}
          <div style={{
            background: "#fff", borderRadius: 12,
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            {selected ? (
              <>
                {/* Chat Header */}
                <div style={{
                  padding: "14px 20px", borderBottom: "1px solid #f3f4f6",
                  background: "#fafafa",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: avatarColor(selected.name),
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 17, fontWeight: 700, flexShrink: 0,
                  }}>
                    {selected.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{selected.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{selected.email}</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <span style={{
                      background: "#f0fdf4", border: "1px solid #bbf7d0",
                      color: "#16a34a", fontSize: 11, fontWeight: 600,
                      padding: "4px 12px", borderRadius: 20,
                    }}>● Online</span>
                  </div>
                </div>

                {/* Messages Area */}
                <div style={{
                  flex: 1, overflowY: "auto",
                  padding: "20px 20px", display: "flex",
                  flexDirection: "column", gap: 10,
                  background: "#fdfdfd",
                }}>
                  {selected.messages.map(msg => {
                    const isAdmin = msg.sender === "admin";
                    return (
                      <div key={msg.id} style={{
                        display: "flex",
                        justifyContent: isAdmin ? "flex-end" : "flex-start",
                        gap: 8,
                        alignItems: "flex-end",
                      }}>
                        {/* Customer avatar */}
                        {!isAdmin && (
                          <div style={{
                            width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                            background: avatarColor(selected.name),
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 11, fontWeight: 700,
                          }}>
                            {selected.name.charAt(0)}
                          </div>
                        )}

                        <div style={{ maxWidth: "65%" }}>
                          <div style={{
                            padding: "10px 14px",
                            borderRadius: isAdmin ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                            background: isAdmin ? "#6366f1" : "#f3f4f6",
                            color: isAdmin ? "#fff" : "#111827",
                            fontSize: 14, lineHeight: 1.55,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                          }}>
                            {msg.text}
                          </div>
                          {msg.sender === "customer" && msg.replied && (
                            <div style={{ fontSize: 10, color: "#10b981", marginTop: 3, marginLeft: 4, fontWeight: 600 }}>
                              ✓ Replied
                            </div>
                          )}
                        </div>

                        {/* Admin avatar */}
                        {isAdmin && (
                          <div style={{
                            width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                            background: "#6366f1",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 10, fontWeight: 800,
                          }}>A</div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Box */}
                <div style={{
                  padding: "14px 16px", borderTop: "1px solid #f3f4f6",
                  background: "#fff", display: "flex", gap: 10, alignItems: "flex-end",
                }}>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                    placeholder="Type your reply... (Enter to send, Shift+Enter for new line)"
                    rows={2}
                    style={{
                      flex: 1, padding: "10px 14px", borderRadius: 10,
                      border: "1.5px solid #d1d5db", fontSize: 14, color: "#111827",
                      outline: "none", fontFamily: "inherit", resize: "none",
                      transition: "border-color 0.2s", lineHeight: 1.5,
                    }}
                    onFocus={e => e.target.style.borderColor = "#6366f1"}
                    onBlur={e => e.target.style.borderColor = "#d1d5db"}
                  />
                  <button
                    onClick={sendReply}
                    disabled={!replyText.trim() || sending}
                    style={{
                      padding: "11px 22px", borderRadius: 10,
                      background: (!replyText.trim() || sending) ? "#e5e7eb" : "linear-gradient(135deg, #6366f1, #7c3aed)",
                      color: (!replyText.trim() || sending) ? "#9ca3af" : "#fff",
                      border: "none", fontSize: 14, fontWeight: 600,
                      cursor: (!replyText.trim() || sending) ? "not-allowed" : "pointer",
                      fontFamily: "inherit", transition: "all 0.18s",
                      whiteSpace: "nowrap",
                      boxShadow: (!replyText.trim() || sending) ? "none" : "0 4px 12px rgba(99,102,241,0.25)",
                    }}
                  >
                    {sending ? "Sending..." : "Send →"}
                  </button>
                </div>
              </>
            ) : (
              /* Empty state */
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 14,
                padding: 40, textAlign: "center",
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "#eef2ff", border: "2px solid #c7d2fe",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30,
                }}>💬</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#374151" }}>No conversation selected</h3>
                <p style={{ color: "#6b7280", fontSize: 14, maxWidth: 280 }}>
                  Choose a customer from the left panel to view and reply to their messages.
                </p>
                {totalUnread > 0 && (
                  <div style={{
                    background: "#fef2f2", border: "1px solid #fecaca",
                    borderRadius: 8, padding: "10px 16px",
                    color: "#dc2626", fontSize: 13, fontWeight: 600,
                  }}>
                    🔔 {totalUnread} unread message{totalUnread !== 1 ? "s" : ""} need{totalUnread === 1 ? "s" : ""} attention
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: #9ca3af !important; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #f9fafb; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #6366f1; }
        @media (max-width: 680px) {
          div[style*="grid-template-columns: 300px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default CustomerMessage;