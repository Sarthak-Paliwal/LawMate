import { Routes, Route, Navigate } from 'react-router-dom';
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
import AdvocateProfile from './pages/AdvocateProfile';
import Bookings from './pages/Bookings';
import QueryResolver from './pages/QueryResolver';
import DocumentGenerator from './pages/DocumentGenerator';
import AdvocateDashboard from './pages/AdvocateDashboard';
import AdminDashboard from './pages/AdminDashboard';

/* -------------------- Public Route Guard -------------------- */

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const DashboardSwitcher = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'advocate') return <AdvocateDashboard />;
  return <Dashboard />;
};

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

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
  );
}

export default App;
