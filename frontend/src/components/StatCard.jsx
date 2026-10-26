import React from 'react';

const StatCard = ({
  icon: Icon,
  label,
  value,
  subtext,
  gradient = 'var(--brand-gradient)',
  badgeText = null,
}) => {
  return (
    <div className="card card-hover" style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '90px',
          height: '90px',
          background: gradient,
          opacity: 0.08,
          borderRadius: '50%',
          filter: 'blur(16px)',
          transform: 'translate(20%, -20%)',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-blue)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {Icon && <Icon size={22} />}
        </div>
        {badgeText && (
          <span className="badge badge-workshop" style={{ fontSize: '0.7rem' }}>
            {badgeText}
          </span>
        )}
      </div>
      <div>
        <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)', lineHeight: 1.1 }}>
          {value !== undefined && value !== null ? value : '-'}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.35rem' }}>
          {label}
        </div>
        {subtext && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
