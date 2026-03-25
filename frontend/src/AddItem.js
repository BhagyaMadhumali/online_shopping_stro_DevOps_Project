import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavigationbar from './AdminNavigationbar';

function AddItem() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const isEdit      = Boolean(id);

  const emptySizes = {
    S:    { quantity: '', price: '' },
    M:    { quantity: '', price: '' },
    L:    { quantity: '', price: '' },
    XL:   { quantity: '', price: '' },
    '2XL':{ quantity: '', price: '' },
  };

  const [category,          setCategory]          = useState('');
  const [productName,       setProductName]        = useState('');
  const [images,            setImages]             = useState([]);
  const [existingImages,    setExistingImages]     = useState([]);
  const [sizes,             setSizes]              = useState(emptySizes);
  const [error,             setError]              = useState('');
  const [loading,           setLoading]            = useState(false);
  const [showSuccessPopup,  setShowSuccessPopup]   = useState(false);
  const [dragOver,          setDragOver]           = useState(false);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      fetch(`http://localhost:5000/api/auth/products/${id}`)
        .then(res => { if (!res.ok) throw new Error('Product not found'); return res.json(); })
        .then(product => {
          setCategory(product.category || '');
          setProductName(product.productName || '');
          const updated = { ...emptySizes };
          Object.entries(product.sizes || {}).forEach(([size, val]) => {
            if (updated[size]) updated[size] = { quantity: String(val.quantity), price: String(val.price) };
          });
          setSizes(updated);
          setExistingImages(product.images || []);
          setImages([]);
          setError('');
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      resetForm();
    }
  }, [id]);

  const resetForm = () => {
    setCategory(''); setProductName('');
    setImages([]); setExistingImages([]);
    setSizes(emptySizes); setError('');
  };

  const addImages = (files) => {
    const imgs = Array.from(files).filter(f => f.type.startsWith('image/')).map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setImages(prev => [...prev, ...imgs]);
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) { setExistingImages(prev => prev.filter((_, i) => i !== index)); }
    else {
      setImages(prev => {
        const arr = [...prev];
        URL.revokeObjectURL(arr[index].preview);
        arr.splice(index, 1);
        return arr;
      });
    }
  };

  const handleSizeChange = (size, field, value) =>
    setSizes(prev => ({ ...prev, [size]: { ...prev[size], [field]: value } }));

  const validate = () => {
    const hasSizes = Object.values(sizes).some(s => s.quantity !== '' && s.price !== '');
    if (!category)          { setError('Please select a category.');                              return false; }
    if (!productName.trim()){ setError('Product name is required.');                              return false; }
    if (existingImages.length === 0 && images.length === 0) { setError('At least one image required.'); return false; }
    if (!hasSizes)          { setError('At least one size must have quantity and price.');         return false; }
    setError(''); return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const fd = new FormData();
    fd.append('category', category);
    fd.append('productName', productName);
    fd.append('existingImages', JSON.stringify(existingImages));
    fd.append('sizes', JSON.stringify(Object.fromEntries(Object.entries(sizes).filter(([, v]) => v.quantity !== '' && v.price !== ''))));
    images.forEach(img => fd.append('images', img.file));

    try {
      const url    = isEdit ? `http://localhost:5000/api/auth/products/${id}` : 'http://localhost:5000/api/auth/products/add';
      const method = isEdit ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, body: fd });
      const data   = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to save product'); return; }
      setShowSuccessPopup(true);
      if (isEdit) { navigate('/add-item', { replace: true }); resetForm(); }
      else { resetForm(); }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  const inputCls = {
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: "1.5px solid #d1d5db", fontSize: 14, color: "#111827",
    outline: "none", fontFamily: "inherit", background: "#fff",
    transition: "border-color 0.2s", boxSizing: "border-box",
  };
  const labelCls = { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}><AdminNavigationbar /></div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 64px)" }}>
        <div style={{ color: "#6366f1", fontSize: 16, fontWeight: 600 }}>Loading product...</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}><AdminNavigationbar /></div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 24px 60px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13, color: "#6b7280" }}>
          <span
            onClick={() => navigate('/allitem')}
            style={{ cursor: "pointer", color: "#6366f1", fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
          >All Items</span>
          <span>›</span>
          <span style={{ color: "#374151", fontWeight: 500 }}>{isEdit ? 'Edit Product' : 'Add Product'}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            {isEdit ? 'Update the product details below.' : 'Fill in the details to add a new product to your inventory.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Error */}
          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 10, padding: "12px 16px",
              color: "#dc2626", fontSize: 14,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Basic Info Card */}
          <div style={{
            background: "#fff", borderRadius: 12,
            border: "1px solid #e5e7eb", padding: "24px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #f3f4f6" }}>
              📋 Basic Information
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 18 }}>
              <div>
                <label style={labelCls}>Category <span style={{ color: "#dc2626" }}>*</span></label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputCls, cursor: "pointer", appearance: "none" }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#d1d5db"}
                >
                  <option value="">-- Select --</option>
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="kids">Kids</option>
                </select>
              </div>
              <div>
                <label style={labelCls}>Product Name <span style={{ color: "#dc2626" }}>*</span></label>
                <input
                  type="text" value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="e.g. Floral Midi Dress"
                  style={inputCls}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#d1d5db"}
                />
              </div>
            </div>
          </div>

          {/* Images Card */}
          <div style={{
            background: "#fff", borderRadius: 12,
            border: "1px solid #e5e7eb", padding: "24px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #f3f4f6" }}>
              🖼️ Product Images <span style={{ fontWeight: 400, color: "#6b7280", fontSize: 13 }}>(required)</span>
            </h2>

            {/* Drop Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); addImages(e.dataTransfer.files); }}
              onClick={() => document.getElementById('img-input').click()}
              style={{
                border: `2px dashed ${dragOver ? "#6366f1" : "#c7d2fe"}`,
                borderRadius: 10, padding: "32px 24px",
                textAlign: "center", cursor: "pointer",
                background: dragOver ? "#eef2ff" : "#fafafa",
                transition: "all 0.2s", marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>📸</div>
              <div style={{ color: "#374151", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                Drag & drop images here, or <span style={{ color: "#6366f1", fontWeight: 600 }}>browse files</span>
              </div>
              <div style={{ color: "#9ca3af", fontSize: 12 }}>PNG, JPG, WebP — Max 10 files</div>
              <input id="img-input" type="file" multiple accept="image/*" onChange={e => addImages(e.target.files)} style={{ display: "none" }} />
            </div>

            {/* Previews */}
            {(existingImages.length > 0 || images.length > 0) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {existingImages.map((img, i) => (
                  <div key={`ex-${i}`} style={{ position: "relative", width: 88, height: 88 }}>
                    <img src={`http://localhost:5000/uploads/${img}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8, border: "2px solid #c7d2fe" }} />
                    <button type="button" onClick={() => removeImage(i, true)} style={{
                      position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%",
                      background: "#dc2626", border: "2px solid #fff", color: "#fff",
                      fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>×</button>
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0, borderRadius: "0 0 7px 7px",
                      background: "#6366f1", color: "#fff", fontSize: 8, textAlign: "center", padding: "2px 0", fontWeight: 700, letterSpacing: "0.08em",
                    }}>SAVED</div>
                  </div>
                ))}
                {images.map((img, i) => (
                  <div key={`new-${i}`} style={{ position: "relative", width: 88, height: 88 }}>
                    <img src={img.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8, border: "2px solid #e5e7eb" }} />
                    <button type="button" onClick={() => removeImage(i, false)} style={{
                      position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%",
                      background: "#dc2626", border: "2px solid #fff", color: "#fff",
                      fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>×</button>
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0, borderRadius: "0 0 7px 7px",
                      background: "#10b981", color: "#fff", fontSize: 8, textAlign: "center", padding: "2px 0", fontWeight: 700, letterSpacing: "0.08em",
                    }}>NEW</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sizes Card */}
          <div style={{
            background: "#fff", borderRadius: 12,
            border: "1px solid #e5e7eb", padding: "24px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 6, paddingBottom: 12, borderBottom: "1px solid #f3f4f6" }}>
              📐 Sizes, Quantity & Price
            </h2>
            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 18 }}>
              Fill in at least one size. Leave blank to exclude that size.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(148px, 1fr))", gap: 14 }}>
              {Object.keys(sizes).map(size => {
                const filled = sizes[size].quantity !== '' && sizes[size].price !== '';
                return (
                  <div key={size} style={{
                    border: `1.5px solid ${filled ? "#6366f1" : "#e5e7eb"}`,
                    borderRadius: 10, padding: "16px 14px",
                    background: filled ? "#fafafe" : "#fafafa",
                    transition: "all 0.2s",
                  }}>
                    <div style={{
                      fontSize: 16, fontWeight: 800, color: filled ? "#6366f1" : "#374151",
                      marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      {size}
                      {filled && <span style={{ fontSize: 14 }}>✅</span>}
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ ...labelCls, fontSize: 11, color: "#6b7280" }}>Quantity</label>
                      <input
                        type="number" min="0" value={sizes[size].quantity}
                        onChange={e => handleSizeChange(size, 'quantity', e.target.value)}
                        placeholder="0"
                        style={{ ...inputCls, padding: "8px 11px", fontSize: 13 }}
                        onFocus={e => e.target.style.borderColor = "#6366f1"}
                        onBlur={e => e.target.style.borderColor = "#d1d5db"}
                      />
                    </div>
                    <div>
                      <label style={{ ...labelCls, fontSize: 11, color: "#6b7280" }}>Price (Rs.)</label>
                      <input
                        type="number" min="0" value={sizes[size].price}
                        onChange={e => handleSizeChange(size, 'price', e.target.value)}
                        placeholder="0"
                        style={{ ...inputCls, padding: "8px 11px", fontSize: 13 }}
                        onFocus={e => e.target.style.borderColor = "#6366f1"}
                        onBlur={e => e.target.style.borderColor = "#d1d5db"}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button type="button" onClick={() => navigate('/allitem')} style={{
              padding: "11px 24px", borderRadius: 9,
              background: "#fff", border: "1.5px solid #e5e7eb",
              color: "#374151", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              Cancel
            </button>
            <button type="submit" style={{
              padding: "11px 32px", borderRadius: 9,
              background: "linear-gradient(135deg, #6366f1, #7c3aed)",
              color: "#fff", border: "none",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 4px 14px rgba(99,102,241,0.30)",
              transition: "all 0.18s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              {isEdit ? '✏ Update Product' : '＋ Add Product'}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessPopup && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 300, backdropFilter: "blur(4px)",
        }}>
          <div style={{
            background: "#fff", borderRadius: 16, padding: "44px 40px",
            textAlign: "center", maxWidth: 360, width: "90%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.20)",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "#f0fdf4", border: "2px solid #86efac",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", fontSize: 28,
            }}>✅</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
              {isEdit ? "Product Updated!" : "Product Added!"}
            </h3>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 28 }}>
              The product has been saved successfully.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setShowSuccessPopup(false); navigate('/allitem'); }} style={{
                flex: 1, padding: "11px", borderRadius: 8,
                background: "#f3f4f6", border: "1.5px solid #e5e7eb",
                color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}>View All Items</button>
              <button onClick={() => setShowSuccessPopup(false)} style={{
                flex: 1, padding: "11px", borderRadius: 8,
                background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                color: "#fff", border: "none",
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}>Add Another</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: #9ca3af !important; }
        select option { background: #fff; color: #111827; }
      `}</style>
    </div>
  );
}

export default AddItem;