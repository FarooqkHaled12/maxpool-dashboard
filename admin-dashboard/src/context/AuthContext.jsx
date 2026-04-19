import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, getMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mp_admin_token');
    if (token) {
      getMe().then(r => setAdmin(r.admin)).catch(() => localStorage.removeItem('mp_admin_token')).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    localStorage.setItem('mp_admin_token', res.token);
    setAdmin(res.admin);
    return res;
  };

  const logout = () => { localStorage.removeItem('mp_admin_token'); setAdmin(null); };

  return <AuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
