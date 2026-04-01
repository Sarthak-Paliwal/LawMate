import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LegalQuery from './pages/LegalQuery';
import LegalActs from './pages/LegalActs';
import LegalActDetail from './pages/LegalActDetail';
import Advocates from './pages/Advocates';
import AdvocateDetail from './pages/AdvocateDetail';
import AdvocateProfile from './pages/AdvocateProfile';
import Bookings from './pages/Bookings';
import QueryResolver from './pages/QueryResolver';
import DocumentGenerator from './pages/DocumentGenerator';
import AdvocateDashboard from './pages/AdvocateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ChatNotifier from './components/ChatNotifier';

/* -------------------- Public Route Guard -------------------- */

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    // Admins have no home page — send them straight to the dashboard
    return <Navigate to={user.role === 'admin' ? '/dashboard' : '/'} replace />;
  }

  return children;
}

/* Redirect admin away from the public home page */
function AdminGuardedHome() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user?.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Home />;
}

const DashboardSwitcher = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'advocate') return <AdvocateDashboard />;
  return <Dashboard />;
};

function App() {
  return (
    <>
      <Toaster 
        position="bottom-left"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-bg-card)',
            color: 'var(--color-text-main)',
            border: '1px solid var(--color-border)',
          },
        }}
      />
      <ChatNotifier />
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<AdminGuardedHome />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route path="/legal-acts" element={<LegalActs />} />
          <Route path="/legal-acts/:id" element={<LegalActDetail />} />

          {/* Protected Dashboard - Shared Route, Role-Based Content */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardSwitcher />
              </ProtectedRoute>
            }
          />

          {/* Consumer Features */}
          <Route
            path="/legal-query"
            element={
              <ProtectedRoute role="user">
                <LegalQuery />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resolve"
            element={
              <ProtectedRoute role="user">
                 <QueryResolver />
              </ProtectedRoute>
            }
          />

          <Route
            path="/advocates"
            element={
              <ProtectedRoute role="user">
                <Advocates />
              </ProtectedRoute>
            }
          />

          <Route
            path="/advocates/:id"
            element={
              <ProtectedRoute role="user">
                <AdvocateDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/document-generator"
            element={
              <ProtectedRoute role="user">
                <DocumentGenerator />
              </ProtectedRoute>
            }
          />

          {/* Provider Features */}
          <Route
            path="/advocate-profile"
            element={
              <ProtectedRoute role="advocate">
                <AdvocateProfile />
              </ProtectedRoute>
            }
          />

          {/* Shared Protected Routes */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
