import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { Menu, X, LogOut, User, LayoutDashboard, Calendar, ClipboardCheck, BarChart3, ShieldCheck, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isOrganiser, isStudent } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="nav-links nav-links-desktop">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Explore Events
          </NavLink>

          {isAuthenticated && (
            <>
              {isStudent && (
                <>
                  <NavLink to="/student/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/student/registrations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    My Registrations
                  </NavLink>
                </>
              )}

              {isOrganiser && (
                <>
                  <NavLink to="/organizer/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/organizer/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Manage Events
                  </NavLink>
                  <NavLink to="/organizer/attendance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Attendance
                  </NavLink>
                  <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Reports
                  </NavLink>
                  <NavLink to="/organizer/events/new" className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.8rem' }}>
                    <PlusCircle size={15} /> Create Event
                  </NavLink>
                </>
              )}

              {isAdmin && (
                <>
                  <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Admin Panel
                  </NavLink>
                  <NavLink to="/organizer/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    All Events
                  </NavLink>
                  <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Reports
                  </NavLink>
                </>
              )}
            </>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
            <ThemeToggle />

            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: 'var(--brand-gradient)',
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div style={{ lineHeight: 1.1 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user?.fullName?.split(' ')[0]}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{user?.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-icon"
                  title="Sign Out"
                  aria-label="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="mobile-only">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-icon"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1.25rem 1.5rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <NavLink to="/" onClick={closeMenu} className="nav-link">
            Home
          </NavLink>
          <NavLink to="/events" onClick={closeMenu} className="nav-link">
            Explore Events
          </NavLink>

          {isAuthenticated ? (
            <>
              {isStudent && (
                <>
                  <NavLink to="/student/dashboard" onClick={closeMenu} className="nav-link">
                    Student Dashboard
                  </NavLink>
                  <NavLink to="/student/registrations" onClick={closeMenu} className="nav-link">
                    My Registrations
                  </NavLink>
                </>
              )}
              {isOrganiser && (
                <>
                  <NavLink to="/organizer/dashboard" onClick={closeMenu} className="nav-link">
                    Organizer Dashboard
                  </NavLink>
                  <NavLink to="/organizer/events" onClick={closeMenu} className="nav-link">
                    Manage Events
                  </NavLink>
                  <NavLink to="/organizer/attendance" onClick={closeMenu} className="nav-link">
                    Attendance
                  </NavLink>
                  <NavLink to="/reports" onClick={closeMenu} className="nav-link">
                    Reports & Analytics
                  </NavLink>
                  <NavLink to="/organizer/events/new" onClick={closeMenu} className="nav-link">
                    Create New Event
                  </NavLink>
                </>
              )}
              {isAdmin && (
                <>
                  <NavLink to="/admin/dashboard" onClick={closeMenu} className="nav-link">
                    Admin Dashboard
                  </NavLink>
                  <NavLink to="/organizer/events" onClick={closeMenu} className="nav-link">
                    All Events
                  </NavLink>
                  <NavLink to="/reports" onClick={closeMenu} className="nav-link">
                    Reports & Analytics
                  </NavLink>
                </>
              )}
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Signed in as <strong>{user?.fullName}</strong> ({user?.role})
                </div>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              <Link to="/login" onClick={closeMenu} className="btn btn-secondary">
                Sign In
              </Link>
              <Link to="/register" onClick={closeMenu} className="btn btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
