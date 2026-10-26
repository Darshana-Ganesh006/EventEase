import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsExplorerPage from './pages/EventsExplorerPage';
import EventDetailsPage from './pages/EventDetailsPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import OrganizerDashboardPage from './pages/OrganizerDashboardPage';
import CreateEditEventPage from './pages/CreateEditEventPage';
import EventManagementPage from './pages/EventManagementPage';
import AttendanceManagementPage from './pages/AttendanceManagementPage';
import ReportsPage from './pages/ReportsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import AccessDeniedPage from './pages/AccessDeniedPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router basename={import.meta.env.BASE_URL}>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/events" element={<EventsExplorerPage />} />
                  <Route path="/events/:id" element={<EventDetailsPage />} />
                  <Route path="/access-denied" element={<AccessDeniedPage />} />

                  {/* Student Protected Routes */}
                  <Route
                    path="/student/dashboard"
                    element={
                      <ProtectedRoute>
                        <RoleGuard allowedRoles={['STUDENT']}>
                          <StudentDashboardPage />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/registrations"
                    element={
                      <ProtectedRoute>
                        <RoleGuard allowedRoles={['STUDENT']}>
                          <MyRegistrationsPage />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  {/* Organizer Protected Routes */}
                  <Route
                    path="/organizer/dashboard"
                    element={
                      <ProtectedRoute>
                        <RoleGuard allowedRoles={['ORGANISER', 'ADMIN']}>
                          <OrganizerDashboardPage />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/organizer/events"
                    element={
                      <ProtectedRoute>
                        <RoleGuard allowedRoles={['ORGANISER', 'ADMIN']}>
                          <EventManagementPage />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/organizer/events/new"
                    element={
                      <ProtectedRoute>
                        <RoleGuard allowedRoles={['ORGANISER', 'ADMIN']}>
                          <CreateEditEventPage />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/organizer/events/:id/edit"
                    element={
                      <ProtectedRoute>
                        <RoleGuard allowedRoles={['ORGANISER', 'ADMIN']}>
                          <CreateEditEventPage />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/organizer/attendance"
                    element={
                      <ProtectedRoute>
                        <RoleGuard allowedRoles={['ORGANISER', 'ADMIN']}>
                          <AttendanceManagementPage />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  {/* Reports & Analytics (Organizer and Admin) */}
                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute>
                        <RoleGuard allowedRoles={['ORGANISER', 'ADMIN']}>
                          <ReportsPage />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Protected Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute>
                        <RoleGuard allowedRoles={['ADMIN']}>
                          <AdminDashboardPage />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all 404 Route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
