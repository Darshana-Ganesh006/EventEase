import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Mail,
  Building,
  CalendarX,
  XCircle,
} from 'lucide-react';

const EventDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isStudent } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [userRegistrationId, setUserRegistrationId] = useState(null);

  const fetchEvent = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await eventService.getEventById(id);
      setEvent(data);

      if (isAuthenticated && isStudent) {
        // Fetch student registrations to check if registered and get registrationId
        const myRegs = await registrationService.getMyRegistrations();
        const found = myRegs.find(r => r.eventId === Number(id) && r.status === 'CONFIRMED');
        if (found) {
          setUserRegistrationId(found.id);
        } else {
          setUserRegistrationId(null);
        }
      }
    } catch (err) {
      setError(err.message || 'Could not load event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id, isAuthenticated]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/events/${id}`);
      return;
    }

    if (!isStudent) {
      showToast('Only students can register for events.', 'error');
      return;
    }

    setRegistering(true);
    try {
      const reg = await registrationService.registerForEvent(id);
      showToast('Registration confirmed! Confirmation notification triggered.', 'success');
      setUserRegistrationId(reg.id);
      // Reload event to get updated available seats
      await fetchEvent();
    } catch (err) {
      showToast(err.message || 'Failed to register', 'error');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!userRegistrationId) return;

    setCancelling(true);
    try {
      await registrationService.cancelRegistration(userRegistrationId);
      showToast('Your registration has been cancelled.', 'info');
      setCancelModalOpen(false);
      setUserRegistrationId(null);
      await fetchEvent();
    } catch (err) {
      showToast(err.message || 'Could not cancel registration', 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', minHeight: '60vh' }}>
        <LoadingSpinner text="Retrieving event specifications..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ color: '#EF4444', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
          {error || 'Event not found.'}
        </div>
        <Link to="/events" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Events Catalogue
        </Link>
      </div>
    );
  }

  const isSeminar = event.category?.toLowerCase() === 'seminar';
  const capacity = event.capacity || 1;
  const registered = event.registeredCount || 0;
  const availableSeats = event.availableSeats !== undefined ? event.availableSeats : Math.max(0, capacity - registered);
  const fillPercentage = Math.min(100, Math.round((registered / capacity) * 100));

  const isUpcoming = event.status === 'UPCOMING';
  const isCancelled = event.status === 'CANCELLED';
  const isCompleted = event.status === 'COMPLETED';

  const today = new Date().toISOString().split('T')[0];
  const isDeadlinePassed = event.registrationDeadline && event.registrationDeadline < today;
  const isFull = availableSeats <= 0;

  const canRegister = isUpcoming && !isDeadlinePassed && !isFull && !userRegistrationId;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      {/* Back button */}
      <Link
        to="/events"
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: '1.75rem', display: 'inline-flex' }}
      >
        <ArrowLeft size={16} /> Back to Events
      </Link>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 360px',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Event Details & Schedule */}
        <div>
          {/* Category & Status Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span className={`badge ${isSeminar ? 'badge-seminar' : 'badge-workshop'}`}>
              {event.category}
            </span>
            <span className={`badge badge-${event.status?.toLowerCase()}`}>
              {event.status}
            </span>
            {userRegistrationId && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#10B981',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <CheckCircle2 size={14} /> You Are Registered
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.6rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '1.5rem',
              color: 'var(--text-primary)',
            }}
          >
            {event.title}
          </h1>

          {/* Description Card */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.85rem' }}>About this Event</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {event.description}
            </p>
          </div>

          {/* Event Schedule & Venue Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Calendar size={20} style={{ color: 'var(--primary-blue)' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Event Date
                </span>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{event.eventDate}</div>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Clock size={20} style={{ color: 'var(--violet)' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Timing
                </span>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                {event.startTime?.substring(0, 5)} - {event.endTime?.substring(0, 5)}
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <MapPin size={20} style={{ color: 'var(--cyan-accent)' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Venue
                </span>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{event.venue}</div>
            </div>
          </div>

          {/* Organizer Details */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Faculty Organizer</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--brand-gradient)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                }}
              >
                {event.organizerName?.charAt(0) || 'F'}
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{event.organizerName}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {event.organizerDepartment || 'Department of Computer Science and Engineering'}
                </div>
                {event.organizerEmail && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {event.organizerEmail}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Card */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div
            className="glass-card"
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Event Registration</h3>

            {/* Capacity status */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Available Capacity</span>
                <span style={{ fontWeight: 700, color: availableSeats === 0 ? '#EF4444' : 'var(--text-primary)' }}>
                  {availableSeats} of {capacity} seats open
                </span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${fillPercentage}%`,
                    background: fillPercentage >= 90 ? '#EF4444' : 'var(--brand-gradient)',
                    borderRadius: 'var(--radius-full)',
                  }}
                />
              </div>
            </div>

            {/* Registration Deadline */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.825rem',
                color: isDeadlinePassed ? '#EF4444' : 'var(--text-secondary)',
                marginBottom: '1.5rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: isDeadlinePassed ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-color)',
              }}
            >
              <Calendar size={16} />
              <span>
                <strong>Deadline:</strong> {event.registrationDeadline} {isDeadlinePassed && '(Closed)'}
              </span>
            </div>

            {/* Registration Action or Status Notice */}
            {userRegistrationId ? (
              <div>
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    color: '#10B981',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>You are confirmed for this session!</span>
                </div>

                {isUpcoming && (
                  <button
                    type="button"
                    onClick={() => setCancelModalOpen(true)}
                    className="btn btn-secondary"
                    style={{ width: '100%', color: '#EF4444' }}
                  >
                    Cancel Registration
                  </button>
                )}
              </div>
            ) : isCancelled ? (
              <div
                style={{
                  padding: '1rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  color: '#EF4444',
                  fontSize: '0.875rem',
                  textAlign: 'center',
                }}
              >
                <XCircle size={20} style={{ margin: '0 auto 0.35rem' }} />
                This event has been cancelled by the department organizer.
              </div>
            ) : isCompleted ? (
              <div
                style={{
                  padding: '1rem',
                  background: 'rgba(100, 116, 139, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  textAlign: 'center',
                }}
              >
                This event has concluded.
              </div>
            ) : isDeadlinePassed ? (
              <div
                style={{
                  padding: '1rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  color: '#EF4444',
                  fontSize: '0.875rem',
                  textAlign: 'center',
                }}
              >
                The registration deadline for this event has passed.
              </div>
            ) : isFull ? (
              <div
                style={{
                  padding: '1rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  color: '#EF4444',
                  fontSize: '0.875rem',
                  textAlign: 'center',
                }}
              >
                All available seats have been booked.
              </div>
            ) : (
              <div>
                {!isAuthenticated ? (
                  <Link
                    to={`/login?redirect=/events/${id}`}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.85rem' }}
                  >
                    Sign In to Register
                  </Link>
                ) : !isStudent ? (
                  <div
                    style={{
                      padding: '0.75rem',
                      background: 'var(--bg-surface-elevated)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      textAlign: 'center',
                    }}
                  >
                    You are signed in as an <strong>{user?.role}</strong>. Only student accounts can register.
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleRegister}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.85rem' }}
                    disabled={registering}
                  >
                    {registering ? 'Reserving Seat...' : 'Register for Event'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={cancelModalOpen}
        title="Cancel Event Registration?"
        message="Are you sure you want to withdraw your seat? This will release your reserved slot for other students."
        confirmText="Yes, Cancel Registration"
        confirmVariant="danger"
        loading={cancelling}
        onConfirm={handleCancelRegistration}
        onCancel={() => setCancelModalOpen(false)}
      />
    </div>
  );
};

export default EventDetailsPage;
