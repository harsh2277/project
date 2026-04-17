import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// App Pages
import Dashboard from './pages/app/Dashboard';
import Projects from './pages/app/Projects';
import CreateProject from './pages/app/CreateProject';
import EditProject from './pages/app/EditProject';
import ProjectDetail from './pages/app/ProjectDetail';
import Tasks from './pages/app/Tasks';
import CalendarPage from './pages/app/Calendar';
import TimerPage from './pages/app/Timer';
import TimesheetPage from './pages/app/Timesheet';
import Integrations from './pages/app/Integrations';
import Settings from './pages/app/Settings';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* App Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/new" element={<CreateProject />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/edit" element={<EditProject />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/timesheet" element={<TimesheetPage />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
