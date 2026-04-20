import { useState, useEffect, useRef } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../services/api';

const EMPTY = { name: '', description: '', category: '', brand: '', brandName: '', featured: false };

export default function Products() {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch]         = useState('');
  const [catFilter, setCatFilter]   = useState('');
  const [form, setForm]             = useState(EMPTY);
  const [editId, setEditId]         = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [msg, setMsg]               = useState('');
  const fileRef = useRef();

  const load = () => {
    const params = {};
    if (search)    params.search   = search;
    if (catFilter) params.category = catFilter;
    getProducts(params).then(r => setProducts(r.products || []));
  };

  useEffect(() => { load(); getCategories().then(r => setCategories(r.data || [])); }, []);
  useEffect(() => { const t = setTimeout(load, 400); return () => clearTimeout(t); }, [search, catFilter]);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ name: p.name, description: p.description, category: p.category, brand: p.brand || '', brandName: p.brandName || '', featured: p.featured }); setEditId(p._id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await updateProduct(editId, form);
        setMsg('Product updated!');
      } else {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (fileRef.current?.files?.length) Array.from(fileRef.current.files).forEach(f => fd.append('images', f));
        await createProduct(fd);
        setMsg('Product created!');
      }
      setShowForm(false); load();
    } catch (err) { setMsg('Error: ' + err.message); }
    finally { setLoading(false); setTimeout(() => setMsg(''), 3000); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id); load();
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Products</h1><p>{products.length} products</p></div>
        <button className="btn btn-primary" onClick={openAdd}><i className="fa-solid fa-plus"></i> Add Product</button>
      </div>
      {msg && <div className={`alert ${msg.startsWith('Error') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}
      <div className="toolbar">
        <input className="search-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Brand</th><th>Featured</th><th>Actions</th></tr></thead>
          <tbody>
            {products.length === 0 && <tr><td colSpan="6" className="empty-row">No products found</td></tr>}
            {products.map(p => (
              <tr key={p._id}>
                <td><img src={(() => {
                  const raw = p.images?.[0];
                  if (!raw) return 'https://placehold.co/60x60?text=No+Image';
                  if (raw.startsWith('http')) return raw;
                  if (raw.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL || 'https://maxpool-production.up.railway.app'}${raw}`;
                  // assets/images/... fallback → main site (legacy paths)
                  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://max-pool-eg.com';
                  return `${siteUrl}/${raw.replace(/^\//, '')}`;
                })()} alt={p.name} className="table-img" /></td>
                <td><strong>{p.name}</strong><br /><small style={{color:'#888'}}>{p.description?.slice(0, 60)}...</small></td>
                <td><span className="badge">{p.category}</span></td>
                <td>{p.brandName || p.brand}</td>
                <td>{p.featured ? <span className="badge badge-green">Yes</span> : '—'}</td>
                <td>
                  <button className="btn-icon" onClick={() => openEdit(p)}><i className="fa-solid fa-pen"></i></button>
                  <button className="btn-icon btn-icon-red" onClick={() => handleDelete(p._id)}><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editId ? 'Edit Product' : 'Add Product'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Product Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div className="form-group"><label>Brand Name</label><input value={form.brandName} onChange={e => setForm({...form, brandName: e.target.value})} placeholder="e.g. Hayward" /></div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Brand Slug</label><input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} placeholder="e.g. brand-hayward" /></div>
              </div>
              <div className="form-group"><label>Description *</label><textarea rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required /></div>
              {!editId && (
                <div className="form-group">
                  <label>Images (up to 5)</label>
                  <input type="file" ref={fileRef} accept="image/*" multiple onChange={() => {
                    const files = fileRef.current?.files;
                    const preview = document.getElementById('imgPreviewRow');
                    if (!preview || !files) return;
                    preview.innerHTML = '';
                    Array.from(files).slice(0, 5).forEach(f => {
                      const reader = new FileReader();
                      reader.onload = e => {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.cssText = 'width:60px;height:60px;object-fit:cover;border-radius:6px;border:1px solid #ddd;';
                        preview.appendChild(img);
                      };
                      reader.readAsDataURL(f);
                    });
                  }} />
                  <div id="imgPreviewRow" style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}></div>
                </div>
              )}
              <div className="form-group form-check"><label><input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} /> Featured product</label></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <i className="fa-solid fa-spinner fa-spin"></i> : (editId ? 'Update' : 'Create')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
