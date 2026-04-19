import { useState, useEffect } from 'react';
import { getMessages, markMessageRead, deleteMessage } from '../services/api';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const load = () => getMessages().then(r => setMessages(r.data || []));
  useEffect(() => { load(); }, []);

  const handleRead   = async (id) => { await markMessageRead(id); load(); };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await deleteMessage(id); load(); };

  return (
    <div>
      <div className="page-header"><h1>Messages</h1><p>{messages.length} messages</p></div>
      <div className="messages-list">
        {messages.length === 0 && <div className="empty-state"><i className="fa-solid fa-inbox"></i><p>No messages yet</p></div>}
        {messages.map(m => (
          <div key={m._id} className={`message-card ${m.read ? '' : 'unread'}`}>
            <div className="message-header">
              <div>
                <strong>{m.name}</strong>
                {!m.read && <span className="badge badge-blue" style={{marginLeft:8}}>New</span>}
                <div style={{fontSize:13,color:'#888',marginTop:2}}><i className="fa-solid fa-phone" style={{marginRight:4}}></i>{m.phone || 'N/A'}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:12,color:'#888'}}>{new Date(m.createdAt).toLocaleString()}</div>
                <div style={{marginTop:6,display:'flex',gap:6,justifyContent:'flex-end'}}>
                  {!m.read && <button className="btn btn-outline btn-sm" onClick={() => handleRead(m._id)}><i className="fa-solid fa-check"></i> Mark Read</button>}
                  <a href={`https://wa.me/+2${(m.phone||'').replace(/\D/g,'')}?text=Hello%20${encodeURIComponent(m.name)}`} target="_blank" rel="noopener" className="btn btn-outline btn-sm"><i className="fa-brands fa-whatsapp" style={{color:'#25D366'}}></i> WhatsApp</a>
                  <button className="btn-icon btn-icon-red" onClick={() => handleDelete(m._id)}><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
            </div>
            <div className="message-body">{m.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
