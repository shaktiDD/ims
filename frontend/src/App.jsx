import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import RecruitmentBoard from './pages/RecruitmentBoard';
import Tasks from './pages/Tasks';
import InternDashboard from './pages/InternDashboard';
import Leaderboard from './pages/Leaderboard';
import LoginSelection from './pages/auth/LoginSelection';
import LoginPage from './pages/auth/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Wrapper
const RequireAuth = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    // Redirect to their appropriate dashboard if wrong role
    return <Navigate to={user.role === 'manager' ? '/dashboard' : '/intern'} replace />;
  }

  return children;
};

import { Outlet } from 'react-router-dom';

// Manager Layout (Sidebar + Content)
const ManagerLayout = () => {
  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
        <div className="relative z-10 w-full text-white">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-outfit text-white">
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginSelection />} />
            <Route path="/login/:role" element={<LoginPage />} />

            {/* Protected Manager Routes */}
            <Route
              element={
                <RequireAuth role="manager">
                  <ManagerLayout />
                </RequireAuth>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/import" element={<ResumeUpload />} />
              <Route path="/recruitment" element={<RecruitmentBoard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Route>

            {/* Protected Intern Route - Full Page (No Sidebar) */}
            <Route
              path="/intern"
              element={
                <RequireAuth role="intern">
                  <InternDashboard />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
