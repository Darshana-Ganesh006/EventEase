import React from 'react';
import { CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 'medium', showTagline = true, to = '/' }) => {
  const iconSize = size === 'large' ? 32 : size === 'small' ? 20 : 24;
  const textSize = size === 'large' ? '1.5rem' : size === 'small' ? '1.1rem' : '1.25rem';

  return (
    <Link to={to} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
      <div
        style={{
          width: iconSize + 14,
          height: iconSize + 14,
          borderRadius: '10px',
          background: 'var(--brand-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(79, 124, 255, 0.35)',
        }}
      >
        <CalendarCheck size={iconSize} />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: textSize, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Event<span className="gradient-text">Ease</span>
          </span>
        </div>
        {showTagline && size !== 'small' && (
          <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.02em' }}>
            Smarter Events. Simpler Experiences.
          </span>
        )}
      </div>
    </Link>
  );
};

export default Logo;
