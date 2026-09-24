import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar, { TopBar } from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Leads from './pages/Leads';
import Opportunities from './pages/Opportunities';
import Tasks from './pages/Tasks';
import Campaigns from './pages/Campaigns';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import UsersPage from './pages/Users';
import OrganizationPage from './pages/Organization';
import LoginPage from './pages/Login';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden transition-all duration-300">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/organization" element={<OrganizationPage />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
