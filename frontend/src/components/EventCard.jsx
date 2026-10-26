import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, CheckCircle2, ArrowRight } from 'lucide-react';

const EventCard = ({ event }) => {
  if (!event) return null;

  const isSeminar = event.category?.toLowerCase() === 'seminar';
  const capacity = event.capacity || 1;
  const registered = event.registeredCount || 0;
  const availableSeats = event.availableSeats !== undefined ? event.availableSeats : Math.max(0, capacity - registered);
  const fillPercentage = Math.min(100, Math.round((registered / capacity) * 100));

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr.substring(0, 5);
  };

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Category & Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: '0.5rem' }}>
        <span className={`badge ${isSeminar ? 'badge-seminar' : 'badge-workshop'}`}>
          {event.category}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {event.isUserRegistered && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.75rem',
                color: '#10B981',
                fontWeight: 600,
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              <CheckCircle2 size={13} /> Registered
            </span>
          )}
          <span className={`badge badge-${event.status?.toLowerCase()}`}>
            {event.status}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          marginBottom: '0.65rem',
          lineHeight: 1.35,
          color: 'var(--text-primary)',
        }}
      >
        <Link to={`/events/${event.id}`} style={{ color: 'inherit', transition: 'color 0.2s' }}>
          {event.title}
        </Link>
      </h3>

      {/* Description Snippet */}
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          marginBottom: '1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}
      >
        {event.description}
      </p>

      {/* Event Metadata */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={15} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
          <span>{formatDate(event.eventDate)} • {formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={15} style={{ color: 'var(--violet)', flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.venue}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={15} style={{ color: 'var(--cyan-accent)', flexShrink: 0 }} />
          <span>Organizer: {event.organizerName || 'Department Faculty'}</span>
        </div>
      </div>

      {/* Capacity Progress Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Seat Availability</span>
          <span style={{ fontWeight: 600, color: availableSeats === 0 ? '#EF4444' : 'var(--text-primary)' }}>
            {availableSeats} / {capacity} seats remaining
          </span>
        </div>
        <div style={{ height: '6px', width: '100%', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${fillPercentage}%`,
              background: fillPercentage >= 90 ? '#EF4444' : 'var(--brand-gradient)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Card Action */}
      <Link
        to={`/events/${event.id}`}
        className="btn btn-secondary"
        style={{ width: '100%', justifyContent: 'space-between' }}
      >
        <span>View Details</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  );
};

export default EventCard;
