import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, Home, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AccessDeniedPage = () => {
  const { user } = useAuth();

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <div className="glass-card" style={{ maxWidth: '520px', width: '100%', padding: '3.5rem 2rem', borderRadius: 'var(--radius-lg)' }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.12)',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <ShieldX size={36} />
        </div>

        <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#EF4444' }}>
          403
        </div>
        <h1 style={{ fontSize: '1.5rem', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
          Access Denied
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          You do not have the required role permissions to view or perform operations on this resource.
          {user && (
            <span style={{ display: 'block', marginTop: '0.5rem' }}>
              Your current role is: <strong>{user.role}</strong>.
            </span>
          )}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Return to Home
          </Link>
          <Link to="/login" className="btn btn-secondary">
            <LogIn size={16} /> Sign In with Different Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
