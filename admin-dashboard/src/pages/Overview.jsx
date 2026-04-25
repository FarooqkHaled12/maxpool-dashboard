import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories, getMessages, getOrders, getLeadStats } from '../services/api';

function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color }}><i className={`fa-solid ${icon}`}></i></div>
      <div className="stat-info"><div className="stat-value">{value}</div><div className="stat-label">{label}</div></div>
    </div>
  );
}

export default function Overview() {
  const [stats, setStats] = useState({ products: 0, categories: 0, messages: 0, orders: 0, leads: 0, todayLeads: 0 });

  useEffect(() => {
    Promise.allSettled([getProducts({ limit: 1 }), getCategories(), getMessages(), getOrders(), getLeadStats()])
      .then(([p, c, m, o, l]) => setStats({
        products:   p.status === 'fulfilled' ? (p.value.pagination?.total || 0) : 0,
        categories: c.status === 'fulfilled' ? (c.value.count || 0) : 0,
        messages:   m.status === 'fulfilled' ? (m.value.count || 0) : 0,
        orders:     o.status === 'fulfilled' ? (o.value.count || 0) : 0,
        leads:      l.status === 'fulfilled' ? (l.value.data?.totalLeads || 0) : 0,
        todayLeads: l.status === 'fulfilled' ? (l.value.data?.todayLeads || 0) : 0,
      }));
  }, []);

  return (
    <div>
      <div className="page-header"><h1>Overview</h1><p>Welcome back to Max Pool Admin</p></div>
      <div className="stats-grid">
        <StatCard icon="fa-boxes-stacked" label="Total Products"  value={stats.products}   color="#004b87" />
        <StatCard icon="fa-tags"          label="Categories"       value={stats.categories} color="#10b981" />
        <StatCard icon="fa-envelope"      label="Messages"         value={stats.messages}   color="#3b82f6" />
        <StatCard icon="fa-cart-shopping" label="Quote Requests"   value={stats.orders}     color="#f59e0b" />
        <StatCard icon="fa-user-plus"     label="Total Leads"      value={stats.leads}      color="#8b5cf6" />
        <StatCard icon="fa-calendar-day"  label="Leads Today"      value={stats.todayLeads} color="#0ea5e9" />
      </div>
      <div className="overview-links">
        <h2>Quick Actions</h2>
        <div className="quick-grid">
          {[
            { to: '/products',   icon: 'fa-plus',      label: 'Add Product' },
            { to: '/categories', icon: 'fa-tag',       label: 'Add Category' },
            { to: '/messages',   icon: 'fa-inbox',     label: 'View Messages' },
            { to: '/orders',     icon: 'fa-list',      label: 'View Quotations' },
            { to: '/leads',      icon: 'fa-user-plus', label: 'View Leads' },
          ].map(q => (
            <Link key={q.to} to={q.to} className="quick-card">
              <i className={`fa-solid ${q.icon}`}></i><span>{q.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
