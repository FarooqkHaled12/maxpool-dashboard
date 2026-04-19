import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';

const EMPTY = { name: '', description: '', icon: 'fa-solid fa-box' };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm]     = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg]       = useState('');

  const load = () => getCategories().then(r => setCategories(r.data || []));
  useEffect(() => { load(); }, []);

  const openEdit   = (c) => { setForm({ name: c.name, description: c.description, icon: c.icon }); setEditId(c._id); };
  const cancelEdit = ()  => { setForm(EMPTY); setEditId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await updateCategory(editId, form); setMsg('Category updated!'); }
      else        { await createCategory(form);          setMsg('Category created!'); }
      setForm(EMPTY); setEditId(null); load();
    } catch (err) { setMsg('Error: ' + err.message); }
    finally { setTimeout(() => setMsg(''), 3000); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    await deleteCategory(id); load();
  };

  return (
    <div>
      <div className="page-header"><h1>Categories</h1><p>{categories.length} categories</p></div>
      {msg && <div className={`alert ${msg.startsWith('Error') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}
      <div className="two-col">
        <div className="card">
          <h2 className="card-title">{editId ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
            <div className="form-group"><label>Description</label><input value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div className="form-group">
              <label>Icon class</label>
              <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="fa-solid fa-water" />
              {form.icon && <div style={{marginTop:6,fontSize:13,color:'#666'}}><i className={form.icon} style={{marginRight:6,color:'#004b87'}}></i>Preview</div>}
            </div>
            <div style={{display:'flex',gap:8}}>
              <button type="submit" className="btn btn-primary" style={{flex:1}}>
                <i className={`fa-solid ${editId ? 'fa-pen' : 'fa-plus'}`}></i> {editId ? 'Update' : 'Create'}
              </button>
              {editId && <button type="button" className="btn btn-outline" onClick={cancelEdit}>Cancel</button>}
            </div>
          </form>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Slug</th><th>Description</th><th>Actions</th></tr></thead>
            <tbody>
              {categories.length === 0 && <tr><td colSpan="4" className="empty-row">No categories yet</td></tr>}
              {categories.map(c => (
                <tr key={c._id}>
                  <td><i className={c.icon} style={{marginRight:8,color:'#004b87'}}></i><strong>{c.name}</strong></td>
                  <td><span className="badge">{c.slug}</span></td>
                  <td>{c.description}</td>
                  <td>
                    <button className="btn-icon" onClick={() => openEdit(c)}><i className="fa-solid fa-pen"></i></button>
                    <button className="btn-icon btn-icon-red" onClick={() => handleDelete(c._id)}><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
