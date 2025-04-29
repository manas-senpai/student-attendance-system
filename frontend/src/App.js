import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import AttendanceCard from './components/AttendanceCard/AttendanceCard';
import Navbar from './components/Navbar/Navbar';
import ScheduleNew from './components/ScheduleNew/ScheduleNew';
import TodaysSchedule from './components/TodaysSchedule/TodaysSchedule';
import Percentage from './components/Precentage/Percentage';
import AuthPage from './components/AuthPage/AuthPage';
import { ProtectedRoute } from './ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Percentage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/TodaysSchedule"
            element={
              <ProtectedRoute>
                <TodaysSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ScheduleNew"
            element={
              <ProtectedRoute>
                <ScheduleNew />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AttendanceCard"
            element={
              <ProtectedRoute>
                <AttendanceCard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;