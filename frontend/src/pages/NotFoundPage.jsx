import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, AlertOctagon } from 'lucide-react';

const NotFoundPage = () => {
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
      <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '3.5rem 2rem', borderRadius: 'var(--radius-lg)' }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'rgba(79, 124, 255, 0.12)',
            color: 'var(--primary-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <AlertOctagon size={36} />
        </div>

        <div style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: "'Outfit', sans-serif" }} className="gradient-text">
          404
        </div>
        <h1 style={{ fontSize: '1.5rem', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          The URL or academic event resource you are seeking does not exist or may have been relocated.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Return Home
          </Link>
          <Link to="/events" className="btn btn-secondary">
            <Compass size={16} /> Explore Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
