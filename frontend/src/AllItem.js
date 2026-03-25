import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavigationbar from './AdminNavigationbar';

function AllItem() {
  const [items, setItems]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [searchQuery, setSearchQuery]   = useState('');
  const [filterCat, setFilterCat]       = useState('All');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/products')
      .then(res => res.json())
      .then(data => { setItems(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) { alert(data.message || 'Failed to delete product'); setDeleting(false); return; }
      setItems(prev => prev.filter(item => item._id !== id));
    } catch (err) { alert('Failed to delete. Please try again.'); }
    setDeleting(false);
    setConfirmDelete(null);
  };

  const categories = ['All', ...new Set(items.map(i => i.category).filter(Boolean).map(c => c.charAt(0).toUpperCase() + c.slice(1)))];

  const filtered = items
    .filter(item => filterCat === 'All' || item.category?.toLowerCase() === filterCat.toLowerCase())
    .filter(item => !searchQuery || item.productName?.toLowerCase().includes(searchQuery.toLowerCase()));

  const thStyle = {
    padding: "13px 18px", fontSize: 11, fontWeight: 700,
    color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em",
    textAlign: "left", background: "#f9fafb", borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
  };
  const tdStyle = { padding: "14px 18px", fontSize: 14, color: "#374151", verticalAlign: "middle" };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}><AdminNavigationbar /></div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 60px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Product Inventory</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              {loading ? "Loading..." : `${items.length} products in total`}
            </p>
          </div>
          <button onClick={() => navigate('/add-item')} style={{
            background: "linear-gradient(135deg, #6366f1, #7c3aed)",
            color: "#fff", border: "none", padding: "11px 22px",
            borderRadius: 9, fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 14px rgba(99,102,241,0.30)",
            display: "flex", alignItems: "center", gap: 8,
            transition: "all 0.18s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            ＋ Add New Product
          </button>
        </div>

        {/* Search + Filter Bar */}
        <div style={{
          background: "#fff", borderRadius: 12,
          border: "1px solid #e5e7eb", padding: "16px 20px",
          display: "flex", gap: 14, alignItems: "center",
          flexWrap: "wrap", marginBottom: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <div style={{ position: "relative", flex: "1 1 240px" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 16 }}>🔍</span>
            <input
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products by name..."
              style={{
                width: "100%", padding: "9px 14px 9px 38px", borderRadius: 8,
                border: "1.5px solid #d1d5db", fontSize: 13, color: "#111827",
                outline: "none", fontFamily: "inherit", transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "#6366f1"}
              onBlur={e => e.target.style.borderColor = "#d1d5db"}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)} style={{
                padding: "8px 16px", borderRadius: 8,
                background: filterCat === cat ? "#6366f1" : "transparent",
                color: filterCat === cat ? "#fff" : "#6b7280",
                border: filterCat === cat ? "1.5px solid #6366f1" : "1.5px solid #e5e7eb",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.18s",
              }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{
                height: 72, background: "#fff", borderBottom: "1px solid #e5e7eb",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div style={{
            background: "#fff", borderRadius: 12,
            border: "1px solid #e5e7eb", overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "64px 24px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🗂️</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#374151", marginBottom: 8 }}>No products found</h3>
                <p style={{ color: "#6b7280", fontSize: 14 }}>
                  {searchQuery ? `No results for "${searchQuery}"` : "Add your first product to get started."}
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Image</th>
                      <th style={thStyle}>Product Name</th>
                      <th style={thStyle}>Category</th>
                      <th style={thStyle}>Size</th>
                      <th style={thStyle}>Qty</th>
                      <th style={thStyle}>Price</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item, itemIdx) => (
                      <React.Fragment key={item._id}>
                        {item.sizes && Object.entries(item.sizes).map(([size, { quantity, price }], sizeIdx) => {
                          const sizeCount   = Object.keys(item.sizes).length;
                          const isLastSize  = sizeIdx === sizeCount - 1;
                          const isLowStock  = Number(quantity) < 5;

                          return (
                            <tr
                              key={`${item._id}-${size}`}
                              style={{
                                borderBottom: isLastSize
                                  ? "2px solid #e5e7eb"
                                  : "1px solid #f3f4f6",
                                background: itemIdx % 2 === 0 ? "#fff" : "#fafafa",
                                transition: "background 0.15s",
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = "#f5f3ff"}
                              onMouseLeave={e => e.currentTarget.style.background = itemIdx % 2 === 0 ? "#fff" : "#fafafa"}
                            >
                              {/* Image — only first row */}
                              {sizeIdx === 0 && (
                                <td style={{ ...tdStyle, width: 90 }} rowSpan={sizeCount}>
                                  <div style={{
                                    width: 68, height: 80, borderRadius: 8, overflow: "hidden",
                                    background: "#f3f4f6", border: "1px solid #e5e7eb",
                                  }}>
                                    {item.images?.length > 0 ? (
                                      <img
                                        src={`http://localhost:5000/uploads/${item.images[0]}`}
                                        alt={item.productName}
                                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                      />
                                    ) : (
                                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 11 }}>
                                        No img
                                      </div>
                                    )}
                                  </div>
                                </td>
                              )}

                              {/* Product Name — only first row */}
                              {sizeIdx === 0 && (
                                <td style={{ ...tdStyle, fontWeight: 600, color: "#111827", fontSize: 14 }} rowSpan={sizeCount}>
                                  {item.productName}
                                </td>
                              )}

                              {/* Category — only first row */}
                              {sizeIdx === 0 && (
                                <td style={tdStyle} rowSpan={sizeCount}>
                                  <span style={{
                                    padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                                    background: "#eef2ff", color: "#6366f1", border: "1px solid #c7d2fe",
                                    textTransform: "capitalize",
                                  }}>{item.category}</span>
                                </td>
                              )}

                              {/* Size */}
                              <td style={tdStyle}>
                                <span style={{
                                  padding: "3px 9px", borderRadius: 5, fontSize: 12, fontWeight: 700,
                                  background: "#f3f4f6", color: "#374151",
                                }}>{size}</span>
                              </td>

                              {/* Quantity */}
                              <td style={tdStyle}>
                                <span style={{
                                  fontWeight: 600,
                                  color: isLowStock ? "#dc2626" : "#374151",
                                }}>
                                  {quantity}
                                  {isLowStock && <span style={{ fontSize: 10, marginLeft: 4, color: "#dc2626" }}>⚠ Low</span>}
                                </span>
                              </td>

                              {/* Price */}
                              <td style={{ ...tdStyle, fontWeight: 600, color: "#6366f1" }}>
                                Rs. {Number(price).toLocaleString()}
                              </td>

                              {/* Actions — only first row */}
                              {sizeIdx === 0 && (
                                <td style={tdStyle} rowSpan={sizeCount}>
                                  <div style={{ display: "flex", gap: 8 }}>
                                    <button
                                      onClick={() => navigate(`/add-item/${item._id}`)}
                                      style={{
                                        padding: "7px 16px", borderRadius: 7,
                                        background: "#eef2ff", color: "#6366f1",
                                        border: "1px solid #c7d2fe",
                                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                                        fontFamily: "inherit", transition: "all 0.18s",
                                      }}
                                      onMouseEnter={e => { e.currentTarget.style.background = "#6366f1"; e.currentTarget.style.color = "#fff"; }}
                                      onMouseLeave={e => { e.currentTarget.style.background = "#eef2ff"; e.currentTarget.style.color = "#6366f1"; }}
                                    >✏ Edit</button>
                                    <button
                                      onClick={() => setConfirmDelete(item._id)}
                                      style={{
                                        padding: "7px 16px", borderRadius: 7,
                                        background: "#fef2f2", color: "#dc2626",
                                        border: "1px solid #fecaca",
                                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                                        fontFamily: "inherit", transition: "all 0.18s",
                                      }}
                                      onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; }}
                                      onMouseLeave={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; }}
                                    >🗑 Delete</button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, backdropFilter: "blur(4px)",
        }}>
          <div style={{
            background: "#fff", borderRadius: 16, padding: "36px 32px",
            maxWidth: 380, width: "90%", textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.20)",
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "#fef2f2", margin: "0 auto 16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, border: "2px solid #fecaca",
            }}>🗑️</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Delete Product?</h3>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              This will permanently remove the product from your inventory. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setConfirmDelete(null)} style={{
                flex: 1, padding: "11px", borderRadius: 8,
                background: "#fff", border: "1.5px solid #e5e7eb",
                color: "#374151", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} disabled={deleting} style={{
                flex: 1, padding: "11px", borderRadius: 8,
                background: deleting ? "#fca5a5" : "#dc2626",
                color: "#fff", border: "none",
                fontSize: 14, fontWeight: 600,
                cursor: deleting ? "not-allowed" : "pointer", fontFamily: "inherit",
              }}>
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: #9ca3af !important; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
}

export default AllItem;