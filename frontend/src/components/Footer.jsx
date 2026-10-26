import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Calendar, Mail, MapPin, GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Info */}
          <div>
            <Logo size="medium" />
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              EventEase is an integrated digital platform engineered to organize, discover, and manage academic
              seminars and technical workshops with automated capacity tracking and attendance recording.
            </p>
          </div>

          {/* Academic Context */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={18} className="gradient-text" /> Academic Context
            </h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <p><strong>Course:</strong> 21CSE354T — Full Stack Web Development</p>
              <p><strong>Department:</strong> Computer Science and Engineering</p>
              <p><strong>Institution:</strong> SRM Institute of Science and Technology</p>
              <p><strong>Campus:</strong> Tiruchirappalli Campus, Tamil Nadu</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--primary-blue)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Home</Link></li>
              <li><Link to="/events" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--primary-blue)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Explore Seminars & Workshops</Link></li>
              <li><Link to="/login" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--primary-blue)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Portal Login</Link></li>
              <li><Link to="/register" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--primary-blue)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Student Registration</Link></li>
            </ul>
          </div>

          {/* Technologies & Services */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Architecture</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <p>• React 19 + Vite Frontend SPA</p>
              <p>• Spring Boot 3.3.4 REST Backend</p>
              <p>• MySQL 8.x Relational Database</p>
              <p>• Spring Security with BCrypt & JWT</p>
              <p>• Notification Microservice (Port 8082)</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} <strong>EventEase</strong>. Official Title: Department Seminar and Workshop Management System.
          </div>
          <div>
            SRM Institute of Science and Technology, Tiruchirappalli Campus
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
