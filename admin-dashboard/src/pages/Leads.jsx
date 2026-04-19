import { useState, useEffect } from 'react';

const BASE = import.meta.env.VITE_API_URL || '/api';
const getToken = () => localStorage.getItem('mp_admin_token');
const h = () => ({ Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' });
const handle = async (res) => { const d = await res.json(); if (!res.ok) throw new Error(d.error || 'Failed'); return d; };

const getLeads         = ()         => fetch(`${BASE}/leads`,       { headers: h() }).then(handle);
const updateLeadStatus = (id, data) => fetch(`${BASE}/leads/${id}`, { method: 'PATCH', headers: h(), body: JSON.stringify(data) }).then(handle);
const deleteLead       = (id)       => fetch(`${BASE}/leads/${id}`, { method: 'DELETE', headers: h() }).then(handle);

const STATUS_COLORS = { new: '#3b82f6', contacted: '#f59e0b', converted: '#10b981', closed: '#6b7280' };

export default function Leads() {
  const [leads,    setLeads]    = useState([]);
  const [filter,   setFilter]   = useState('all');
  const [selected, setSelected] = useState(null);
  const [notes,    setNotes]    = useState('');
  const [msg,      setMsg]      = useState('');

  const load = () => getLeads().then(r => setLeads(r.data || []));
  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    await updateLeadStatus(id, { status, notes });
    setMsg('Updated!');
    load();
    setTimeout(() => setMsg(''), 2000);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead?')) return;
    await deleteLead(id);
    load();
    if (selected?._id === id) setSelected(null);
  };

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter);
  const counts   = leads.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {});

  return (
    <div>
      <div className="page-header">
        <div><h1>Leads</h1><p>{leads.length} total leads</p></div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        {['new', 'contacted', 'converted', 'closed'].map(s => (
          <div key={s} className="stat-card" style={{ cursor: 'pointer', border: filter === s ? `2px solid ${STATUS_COLORS[s]}` : '' }} onClick={() => setFilter(filter === s ? 'all' : s)}>
            <div className="stat-icon" style={{ background: STATUS_COLORS[s] }}><i className="fa-solid fa-user"></i></div>
            <div className="stat-info">
              <div className="stat-value">{counts[s] || 0}</div>
              <div className="stat-label" style={{ textTransform: 'capitalize' }}>{s}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: '20px' }}>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Phone</th><th>Message</th><th>Source</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan="7" className="empty-row">No leads found</td></tr>}
              {filtered.map(l => (
                <tr key={l._id} style={{ cursor: 'pointer' }} onClick={() => { setSelected(l); setNotes(l.notes || ''); }}>
                  <td><strong>{l.name}</strong></td>
                  <td><a href={`tel:${l.phone}`} onClick={e => e.stopPropagation()} style={{ color: 'var(--accent)' }}>{l.phone}</a></td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.message || '—'}</td>
                  <td><span className="badge">{l.source}</span></td>
                  <td><span className="badge" style={{ background: STATUS_COLORS[l.status] + '20', color: STATUS_COLORS[l.status] }}>{l.status}</span></td>
                  <td>{new Date(l.createdAt).toLocaleDateString()}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="btn-icon btn-icon-red" onClick={() => handleDelete(l._id)}><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>{selected.name}</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>&times;</button>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px' }}>
              <p><i className="fa-solid fa-phone" style={{ marginRight: '8px' }}></i><a href={`tel:${selected.phone}`}>{selected.phone}</a></p>
              {selected.email && <p><i className="fa-solid fa-envelope" style={{ marginRight: '8px' }}></i>{selected.email}</p>}
              <p><i className="fa-solid fa-calendar" style={{ marginRight: '8px' }}></i>{new Date(selected.createdAt).toLocaleString()}</p>
              {selected.message && <p style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', marginTop: '8px' }}>{selected.message}</p>}
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={selected.status} onChange={e => { setSelected({ ...selected, status: e.target.value }); handleStatus(selected._id, e.target.value); }}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes..." />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleStatus(selected._id, selected.status)}>
              <i className="fa-solid fa-floppy-disk"></i> Save Notes
            </button>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <a href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener" className="btn btn-outline" style={{ flex: 1, textAlign: 'center', color: '#25D366', borderColor: '#25D366' }}>
                <i className="fa-brands fa-whatsapp"></i> WhatsApp
              </a>
              <a href={`tel:${selected.phone}`} className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>
                <i className="fa-solid fa-phone"></i> Call
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
