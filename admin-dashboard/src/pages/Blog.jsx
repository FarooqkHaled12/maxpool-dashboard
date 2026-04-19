import { useState, useEffect } from 'react';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, getBlogPost } from '../services/api';

const EMPTY = { title: '', titleAr: '', excerpt: '', excerptAr: '', content: '', contentAr: '', category: 'pool-tips', published: false, readTime: 3 };

export default function Blog() {
  const [posts,    setPosts]    = useState([]);
  const [form,     setForm]     = useState(EMPTY);
  const [editId,   setEditId]   = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState('');

  const load = () => getBlogPosts().then(r => setPosts(r.data || []));
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = async (id) => {
    const r = await getBlogPost(id);
    setForm(r.data);
    setEditId(id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) { await updateBlogPost(editId, form); setMsg('Post updated!'); }
      else        { await createBlogPost(form);          setMsg('Post created!'); }
      setShowForm(false);
      load();
    } catch (err) { setMsg('Error: ' + err.message); }
    finally { setLoading(false); setTimeout(() => setMsg(''), 3000); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    await deleteBlogPost(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Blog Posts</h1><p>{posts.length} posts</p></div>
        <button className="btn btn-primary" onClick={openAdd}><i className="fa-solid fa-plus"></i> New Post</button>
      </div>

      {msg && <div className={`alert ${msg.startsWith('Error') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}

      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Title</th><th>Title (AR)</th><th>Category</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {posts.length === 0 && <tr><td colSpan="6" className="empty-row">No posts yet</td></tr>}
            {posts.map(p => (
              <tr key={p._id}>
                <td><strong>{p.title}</strong></td>
                <td>{p.titleAr || '—'}</td>
                <td><span className="badge">{p.category}</span></td>
                <td><span className={`badge ${p.published ? 'badge-green' : ''}`}>{p.published ? 'Published' : 'Draft'}</span></td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn-icon" onClick={() => openEdit(p._id)}><i className="fa-solid fa-pen"></i></button>
                  <button className="btn-icon btn-icon-red" onClick={() => handleDelete(p._id)}><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal" style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <h2>{editId ? 'Edit Post' : 'New Post'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px' }}>
              <div className="form-row">
                <div className="form-group"><label>Title (EN) *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
                <div className="form-group"><label>Title (AR)</label><input value={form.titleAr} onChange={e => setForm({ ...form, titleAr: e.target.value })} dir="rtl" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Excerpt (EN)</label><textarea rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} /></div>
                <div className="form-group"><label>Excerpt (AR)</label><textarea rows={2} value={form.excerptAr} onChange={e => setForm({ ...form, excerptAr: e.target.value })} dir="rtl" /></div>
              </div>
              <div className="form-group"><label>Content (EN) *</label><textarea rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required /></div>
              <div className="form-group"><label>Content (AR)</label><textarea rows={8} value={form.contentAr} onChange={e => setForm({ ...form, contentAr: e.target.value })} dir="rtl" /></div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="pool-tips">Pool Tips</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="equipment">Equipment</option>
                    <option value="chemicals">Chemicals</option>
                    <option value="pricing">Pricing</option>
                  </select>
                </div>
                <div className="form-group"><label>Read Time (min)</label><input type="number" min={1} value={form.readTime} onChange={e => setForm({ ...form, readTime: +e.target.value })} /></div>
              </div>
              <div className="form-group form-check">
                <label><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} /> Published</label>
              </div>
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
