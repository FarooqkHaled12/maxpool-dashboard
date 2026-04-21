const BASE = import.meta.env.VITE_API_URL || '/api';
const getToken = () => localStorage.getItem('mp_admin_token');
const h = (form = false) => {
  const headers = { Authorization: `Bearer ${getToken()}` };
  if (!form) headers['Content-Type'] = 'application/json';
  return headers;
};
const handle = async (res) => {
  const text = await res.text();
  if (!text) throw new Error('Empty response from server');
  let data;
  try { data = JSON.parse(text); } catch { throw new Error('Invalid JSON response'); }
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

export const login = (email, password) =>
  fetch(`${BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }).then(handle);

export const getMe = () => fetch(`${BASE}/auth/me`, { headers: h() }).then(handle);

export const getProducts = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return fetch(`${BASE}/products${qs ? '?' + qs : ''}`, { headers: h() }).then(handle);
};
export const createProduct = (fd) => fetch(`${BASE}/products`, { method: 'POST', headers: h(true), body: fd }).then(handle);
export const updateProduct = (id, data) => fetch(`${BASE}/products/${id}`, { method: 'PUT', headers: h(), body: JSON.stringify(data) }).then(handle);
export const deleteProduct = (id) => fetch(`${BASE}/products/${id}`, { method: 'DELETE', headers: h() }).then(handle);

export const getCategories = () => fetch(`${BASE}/categories`, { headers: h() }).then(handle);
export const createCategory = (data) => fetch(`${BASE}/categories`, { method: 'POST', headers: h(), body: JSON.stringify(data) }).then(handle);
export const updateCategory = (id, data) => fetch(`${BASE}/categories/${id}`, { method: 'PUT', headers: h(), body: JSON.stringify(data) }).then(handle);
export const deleteCategory = (id) => fetch(`${BASE}/categories/${id}`, { method: 'DELETE', headers: h() }).then(handle);

export const getMessages = () => fetch(`${BASE}/messages`, { headers: h() }).then(handle);
export const markMessageRead = (id) => fetch(`${BASE}/messages/${id}/read`, { method: 'PATCH', headers: h() }).then(handle);
export const deleteMessage = (id) => fetch(`${BASE}/messages/${id}`, { method: 'DELETE', headers: h() }).then(handle);

export const getOrders = () => fetch(`${BASE}/orders`, { headers: h() }).then(handle);
export const updateOrderStatus = (id, status) => fetch(`${BASE}/orders/${id}/status`, { method: 'PATCH', headers: h(), body: JSON.stringify({ status }) }).then(handle);
export const deleteOrder = (id) => fetch(`${BASE}/orders/${id}`, { method: 'DELETE', headers: h() }).then(handle);

// Settings
export const getSettings    = ()          => fetch(`${BASE}/settings/full`,   { headers: h() }).then(handle);
export const updateSettings = (data)      => fetch(`${BASE}/settings`,        { method: 'PUT', headers: h(), body: JSON.stringify(data) }).then(handle);
export const updateSetting  = (key, val)  => fetch(`${BASE}/settings/${key}`, { method: 'PUT', headers: h(), body: JSON.stringify({ value: val }) }).then(handle);

// Blog
export const getBlogPosts   = ()          => fetch(`${BASE}/blog`,       { headers: h() }).then(handle);
export const getBlogPost    = (id)        => fetch(`${BASE}/blog/${id}`,  { headers: h() }).then(handle);
export const createBlogPost = (data)      => fetch(`${BASE}/blog`,       { method: 'POST',   headers: h(), body: JSON.stringify(data) }).then(handle);
export const updateBlogPost = (id, data)  => fetch(`${BASE}/blog/${id}`, { method: 'PUT',    headers: h(), body: JSON.stringify(data) }).then(handle);
export const deleteBlogPost = (id)        => fetch(`${BASE}/blog/${id}`, { method: 'DELETE', headers: h() }).then(handle);

// Pages
export const getPages   = ()          => fetch(`${BASE}/pages`,          { headers: h() }).then(handle);
export const getPage    = (id)        => fetch(`${BASE}/pages/${id}`,    { headers: h() }).then(handle);
export const updatePage = (id, data)  => fetch(`${BASE}/pages/${id}`,    { method: 'PUT',  headers: h(), body: JSON.stringify(data) }).then(handle);
export const seedPages  = ()          => fetch(`${BASE}/pages/seed/all`, { method: 'POST', headers: h() }).then(handle);

// Leads
export const getLeads         = ()          => fetch(`${BASE}/leads`,       { headers: h() }).then(handle);
export const updateLeadStatus = (id, data) => fetch(`${BASE}/leads/${id}`, { method: 'PATCH',  headers: h(), body: JSON.stringify(data) }).then(handle);
export const deleteLead       = (id)       => fetch(`${BASE}/leads/${id}`, { method: 'DELETE', headers: h() }).then(handle);
