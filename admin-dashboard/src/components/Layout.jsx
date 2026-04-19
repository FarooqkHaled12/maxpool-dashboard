import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { getMessages, getOrders } from '../services/api';

export default function Layout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  const [newOrders,  setNewOrders]  = useState(0);
  const [unreadMsgs, setUnreadMsgs] = useState(0);

  const loadBadges = () => {
    getOrders().then(r => setNewOrders((r.data || []).filter(o => o.status === 'new').length)).catch(() => {});
    getMessages().then(r => setUnreadMsgs((r.data || []).filter(m => !m.read).length)).catch(() => {});
  };

  useEffect(() => {
    loadBadges();
    const interval = setInterval(loadBadges, 30000);
    return () => clearInterval(interval);
  }, []);

  const NAV = [
    { to: '/overview',   icon: 'fa-chart-pie',      label: 'Overview' },
    { to: '/products',   icon: 'fa-boxes-stacked',  label: 'Products' },
    { to: '/categories', icon: 'fa-tags',            label: 'Categories' },
    { to: '/messages',   icon: 'fa-envelope',        label: 'Messages',   badge: unreadMsgs, badgeColor: '#3b82f6' },
    { to: '/orders',     icon: 'fa-cart-shopping',   label: 'Quotations', badge: newOrders,  badgeColor: '#e74c3c' },
    { to: '/leads',      icon: 'fa-user-plus',       label: 'Leads' },
    { to: '/blog',       icon: 'fa-newspaper',       label: 'Blog Posts' },
    { to: '/pages',      icon: 'fa-file-lines',      label: 'Pages' },
    { to: '/settings',   icon: 'fa-sliders',         label: 'Site Settings' },
  ];

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-logo">Max <span>Pool</span></span>
          <span className="brand-sub">Admin Panel</span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')} onClick={loadBadges}>
              <i className={`fa-solid ${n.icon}`}></i>
              <span style={{flex:1}}>{n.label}</span>
              {n.badge > 0 && (
                <span style={{
                  background: n.badgeColor, color: 'white', borderRadius: '50%',
                  minWidth: 20, height: 20, fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 5px', flexShrink: 0
                }}>{n.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <a href={import.meta.env.VITE_SITE_URL || 'https://leafy-bonbon-9d0f79.netlify.app'} target="_blank" rel="noopener" className="nav-item">
            <i className="fa-solid fa-arrow-up-right-from-square"></i><span>View Site</span>
          </a>
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i><span>Logout</span>
          </button>
        </div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div></div>
          <div className="topbar-admin">
            <i className="fa-solid fa-circle-user"></i>
            <span>{admin?.name || admin?.email}</span>
          </div>
        </header>
        <main className="page-content"><Outlet /></main>
      </div>
    </div>
  );
}
