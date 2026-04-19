import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../services/api';

const GROUP_LABELS = {
  general:  'General',
  contact:  'Contact Info',
  social:   'Social Media',
  hero:     'Homepage Hero',
  about:    'About Page',
  seo:      'SEO / Meta Tags',
  services: 'Services Page',
};

export default function Settings() {
  const [settings,    setSettings]    = useState([]);
  const [values,      setValues]      = useState({});
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [msg,         setMsg]         = useState('');
  const [activeGroup, setActiveGroup] = useState('general');

  useEffect(() => {
    getSettings()
      .then(r => {
        const list = r.data || [];
        setSettings(list);
        const v = {};
        list.forEach(s => { v[s.key] = s.value; });
        setValues(v);
      })
      .finally(() => setLoading(false));
  }, []);

  const groups   = [...new Set(settings.map(s => s.group))].sort();
  const filtered = settings.filter(s => s.group === activeGroup);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(values);
      setMsg('Settings saved successfully!');
    } catch (e) {
      setMsg('Error: ' + e.message);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  if (loading) return <div className="loading-screen"><i className="fa-solid fa-spinner fa-spin"></i></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>Site Settings</h1><p>Control all website content from here</p></div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</> : <><i className="fa-solid fa-floppy-disk"></i> Save All</>}
        </button>
      </div>

      {msg && <div className={`alert ${msg.startsWith('Error') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Group sidebar */}
        <div className="card" style={{ padding: '8px' }}>
          {groups.map(g => (
            <button key={g} onClick={() => setActiveGroup(g)} style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px',
              borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px',
              fontWeight: activeGroup === g ? '700' : '500', marginBottom: '2px',
              background: activeGroup === g ? 'var(--accent)' : 'transparent',
              color: activeGroup === g ? 'white' : 'var(--text)',
            }}>
              {GROUP_LABELS[g] || g}
            </button>
          ))}
        </div>

        {/* Fields panel */}
        <div className="card">
          <h3 className="card-title">{GROUP_LABELS[activeGroup] || activeGroup}</h3>
          {filtered.map(s => (
            <div className="form-group" key={s.key}>
              <label>{s.label || s.key}</label>
              {s.type === 'textarea' ? (
                <textarea rows={4} value={values[s.key] ?? ''} onChange={e => setValues({ ...values, [s.key]: e.target.value })} />
              ) : s.type === 'boolean' ? (
                <div className="form-check">
                  <label>
                    <input type="checkbox" checked={!!values[s.key]} onChange={e => setValues({ ...values, [s.key]: e.target.checked })} />
                    {' '}Enabled
                  </label>
                </div>
              ) : (
                <input
                  type={s.type === 'email' ? 'email' : s.type === 'url' ? 'url' : 'text'}
                  value={values[s.key] ?? ''}
                  onChange={e => setValues({ ...values, [s.key]: e.target.value })}
                  placeholder={s.label}
                />
              )}
              <small style={{ color: 'var(--muted)', fontSize: '11px' }}>key: {s.key}</small>
            </div>
          ))}
          <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
