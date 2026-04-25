import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout     from './components/Layout';
import Login      from './pages/Login';
import Overview   from './pages/Overview';
import Products   from './pages/Products';
import Categories from './pages/Categories';
import Messages   from './pages/Messages';
import Orders     from './pages/Orders';
import Settings   from './pages/Settings';
import Blog       from './pages/Blog';
import Pages      from './pages/Pages';
import Leads      from './pages/Leads';
import Pricing    from './pages/Pricing';

function PrivateRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div className="loading-screen"><i className="fa-solid fa-spinner fa-spin"></i> Loading...</div>;
  return admin ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview"   element={<Overview />} />
        <Route path="products"   element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="messages"   element={<Messages />} />
        <Route path="orders"     element={<Orders />} />
        <Route path="settings"   element={<Settings />} />
        <Route path="blog"       element={<Blog />} />
        <Route path="pages"      element={<Pages />} />
        <Route path="leads"      element={<Leads />} />
        <Route path="pricing"    element={<Pricing />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
