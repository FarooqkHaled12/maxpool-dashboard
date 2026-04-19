import { useState, useEffect } from 'react';

const BASE = import.meta.env.VITE_API_URL || '/api';
const getToken = () => localStorage.getItem('mp_admin_token');
const h = () => ({ Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' });
const handle = async (res) => { const d = await res.json(); if (!res.ok) throw new Error(d.error || 'Failed'); return d; };

const getPages   = ()      => fetch(`${BASE}/pages`,          { headers: h() }).then(handle);
const getPage    = (id)    => fetch(`${BASE}/pages/${id}`,    { headers: h() }).then(handle);
const updatePage = (id, d) => fetch(`${BASE}/pages/${id}`,    { method: 'PUT', headers: h(), body: JSON.stringify(d) }).then(handle);
const seedPages  = ()      => fetch(`${BASE}/pages/seed/all`, { method: 'POST', headers: h() }).then(handle);

export default function Pages() {
  const [pages,     setPages]     = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [pageData,  setPageData]  = useState(null);
  const [activeTab, setActiveTab] = useState('meta');
  const [saving,    setSaving]    = useState(false);
  const [seeding,   setSeeding]   = useState(false);
  const [msg,       setMsg]       = useState('');

  const load = () => getPages().then(r => setPages(r.data || []));
  useEffect(() => { load(); }, []);

  const openPage = async (id) => {
    const r = await getPage(id);
    setPageData(r.data);
    setSelected(id);
    setActiveTab('meta');
  };

  const handleSave = async () => {
    setSaving(true);
    try { await updatePage(selected, pageData); setMsg('Page saved!'); load(); }
    catch (e) { setMsg('Error: ' + e.message); }
    finally { setSaving(false); setTimeout(() => setMsg(''), 3000); }
  };

  const handleSeed = async () => {
    if (!confirm('Reset all pages to defaults?')) return;
    setSeeding(true);
    try { const r = await seedPages(); setMsg(`Seeded: ${r.data.join(', ')}`); load(); setSelected(null); setPageData(null); }
    catch (e) { setMsg('Error: ' + e.message); }
    finally { setSeeding(false); setTimeout(() => setMsg(''), 4000); }
  };

  const updateSectionField = (type, field, value) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.type === type ? { ...s, content: { ...s.content, [field]: value } } : s
      )
    }));
  };

  const updateSectionItem = (type, idx, field, value) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.type !== type) return s;
        const items = [...(s.content.items || [])];
        items[idx] = { ...items[idx], [field]: value };
        return { ...s, content: { ...s.content, items } };
      })
    }));
  };

  const renderSection = (section) => {
    const c = section.content;
    return (
      <div key={section.type} style={{ marginBottom: '24px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <h4 style={{ margin: '0 0 16px', color: 'var(--primary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
          <i className="fa-solid fa-puzzle-piece" style={{ marginRight: '6px' }}></i>
          {section.type}
        </h4>
        {Object.entries(c).map(([key, val]) => {
          if (Array.isArray(val)) return null;
          return (
            <div className="form-group" key={key} style={{ marginBottom: '10px' }}>
              <label style={{ textTransform: 'none', fontSize: '11px' }}>{key}</label>
              {typeof val === 'string' && val.length > 80
                ? <textarea rows={2} value={val} onChange={e => updateSectionField(section.type, key, e.target.value)} />
                : typeof val === 'boolean'
                  ? <div className="form-check"><label><input type="checkbox" checked={val} onChange={e => updateSectionField(section.type, key, e.target.checked)} /> Enabled</label></div>
                  : <input value={val ?? ''} onChange={e => updateSectionField(section.type, key, e.target.value)} />
              }
            </div>
          );
        })}
        {c.items && (
          <div style={{ marginTop: '12px' }}>
            <label style={{ fontWeight: '700', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Items ({c.items.length})</label>
            {c.items.map((item, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '12px', marginTop: '8px' }}>
                <strong style={{ fontSize: '11px', color: 'var(--muted)' }}>Item {idx + 1}</strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                  {Object.entries(item).map(([k, v]) => (
                    <div key={k}>
                      <label style={{ fontSize: '10px', color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>{k}</label>
                      <input value={v ?? ''} onChange={e => updateSectionItem(section.type, idx, k, e.target.value)} style={{ padding: '5px 8px', fontSize: '12px', width: '100%', border: '1px solid var(--border)', borderRadius: '4px', outline: 'none' }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Pages</h1><p>Manage all website page content and SEO</p></div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline" onClick={handleSeed} disabled={seeding}>
            {seeding ? <><i className="fa-solid fa-spinner fa-spin"></i> Seeding...</> : <><i className="fa-solid fa-seedling"></i> Seed Defaults</>}
          </button>
          {selected && (
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</> : <><i className="fa-solid fa-floppy-disk"></i> Save Page</>}
            </button>
          )}
        </div>
      </div>

      {msg && <div className={`alert ${msg.startsWith('Error') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px', alignItems: 'start' }}>
        <div className="card" style={{ padding: '8px' }}>
          {pages.length === 0 && (
            <p style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>
              No pages yet.<br />Click "Seed Defaults".
            </p>
          )}
          {pages.map(p => (
            <button key={p._id} onClick={() => openPage(p._id)} style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px',
              borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px',
              fontWeight: selected === p._id ? '700' : '500', marginBottom: '2px',
              background: selected === p._id ? 'var(--accent)' : 'transparent',
              color: selected === p._id ? 'white' : 'var(--text)',
            }}>
              <i className="fa-solid fa-file-lines" style={{ marginRight: '8px', opacity: 0.6 }}></i>
              {p.title}
              <span style={{ display: 'block', fontSize: '11px', opacity: 0.6 }}>/{p.slug}</span>
            </button>
          ))}
        </div>

        {!pageData ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
            <i className="fa-solid fa-file-lines" style={{ fontSize: '48px', opacity: 0.2, display: 'block', marginBottom: '12px' }}></i>
            Select a page to edit
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
              {['meta', 'sections'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: '8px 20px', borderRadius: '6px', border: '1px solid var(--border)',
                  background: activeTab === tab ? 'var(--accent)' : 'white',
                  color: activeTab === tab ? 'white' : 'var(--text)',
                  fontWeight: '600', fontSize: '13px', cursor: 'pointer', textTransform: 'capitalize'
                }}>{tab}</button>
              ))}
            </div>

            {activeTab === 'meta' && (
              <div className="card">
                <h3 className="card-title">SEO & Meta Tags</h3>
                <div className="form-row">
                  <div className="form-group"><label>Title (EN)</label><input value={pageData.title} onChange={e => setPageData({ ...pageData, title: e.target.value })} /></div>
                  <div className="form-group"><label>Title (AR)</label><input value={pageData.titleAr} onChange={e => setPageData({ ...pageData, titleAr: e.target.value })} dir="rtl" /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Meta Title (EN)</label><input value={pageData.metaTitle} onChange={e => setPageData({ ...pageData, metaTitle: e.target.value })} /></div>
                  <div className="form-group"><label>Meta Title (AR)</label><input value={pageData.metaTitleAr} onChange={e => setPageData({ ...pageData, metaTitleAr: e.target.value })} dir="rtl" /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Meta Description (EN)</label><textarea rows={3} value={pageData.metaDesc} onChange={e => setPageData({ ...pageData, metaDesc: e.target.value })} /></div>
                  <div className="form-group"><label>Meta Description (AR)</label><textarea rows={3} value={pageData.metaDescAr} onChange={e => setPageData({ ...pageData, metaDescAr: e.target.value })} dir="rtl" /></div>
                </div>
                <div className="form-group"><label>OG Image URL</label><input value={pageData.ogImage} onChange={e => setPageData({ ...pageData, ogImage: e.target.value })} placeholder="https://..." /></div>
                <div className="form-group form-check"><label><input type="checkbox" checked={pageData.published} onChange={e => setPageData({ ...pageData, published: e.target.checked })} /> Published</label></div>
              </div>
            )}

            {activeTab === 'sections' && (
              <div>
                {pageData.sections.sort((a, b) => a.order - b.order).map(s => renderSection(s))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
