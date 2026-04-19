import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, deleteOrder } from '../services/api';

const STATUS_COLORS = { new: '#e74c3c', contacted: '#f59e0b', closed: '#10b981' };

const exportCSV = (orders) => {
  const rows = [['Name', 'Phone', 'Status', 'Items', 'Date']];
  orders.forEach(o => rows.push([
    o.name, o.phone, o.status,
    (o.items || []).map(i => i.title).join(' | '),
    new Date(o.createdAt).toLocaleString()
  ]));
  const csv  = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `orders-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const load = () => getOrders().then(r => setOrders(r.data || []));
  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => { await updateOrderStatus(id, status); load(); };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await deleteOrder(id); load(); };

  return (
    <div>
      <div className="page-header">
        <div><h1>Quotation Requests</h1><p>{orders.length} requests</p></div>
        {orders.length > 0 && (
          <button className="btn btn-outline" onClick={() => exportCSV(orders)}>
            <i className="fa-solid fa-file-csv"></i> Export CSV
          </button>
        )}
      </div>
      <div className="messages-list">
        {orders.length === 0 && <div className="empty-state"><i className="fa-solid fa-cart-shopping"></i><p>No quotation requests yet</p></div>}
        {orders.map(o => (
          <div key={o._id} className="message-card">
            <div className="message-header">
              <div>
                <strong>{o.name}</strong>
                <span className="badge" style={{marginLeft:8,background:STATUS_COLORS[o.status],color:'white'}}>{o.status}</span>
                <div style={{fontSize:13,color:'#888',marginTop:2}}><i className="fa-solid fa-phone" style={{marginRight:4}}></i>{o.phone}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:12,color:'#888'}}>{new Date(o.createdAt).toLocaleString()}</div>
                <div style={{marginTop:6,display:'flex',gap:6,justifyContent:'flex-end'}}>
                  <select className="filter-select" style={{padding:'4px 8px',fontSize:12}} value={o.status} onChange={e => handleStatus(o._id, e.target.value)}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                  <a href={`https://wa.me/+2${o.phone.replace(/\D/g,'')}?text=Hello%20${encodeURIComponent(o.name)}`} target="_blank" rel="noopener" className="btn btn-outline btn-sm"><i className="fa-brands fa-whatsapp" style={{color:'#25D366'}}></i></a>
                  <button className="btn-icon btn-icon-red" onClick={() => handleDelete(o._id)}><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
            </div>
            <div style={{background:'#f9f9f9',borderRadius:6,padding:'10px 14px',marginTop:10}}>
              <div style={{fontSize:12,fontWeight:700,color:'#888',marginBottom:6,textTransform:'uppercase',letterSpacing:1}}>Items ({o.items?.length})</div>
              <ul style={{margin:0,paddingLeft:18}}>
                {(o.items||[]).map((item,i) => <li key={i} style={{fontSize:14,marginBottom:3}}>{item.title}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
