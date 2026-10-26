import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`btn-icon ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isDark ? (
        <Sun size={18} style={{ color: '#FBBF24', transition: 'transform 0.3s ease' }} />
      ) : (
        <Moon size={18} style={{ color: '#4F7CFF', transition: 'transform 0.3s ease' }} />
      )}
    </button>
  );
};

export default ThemeToggle;
