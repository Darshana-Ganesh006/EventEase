import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationService } from '../services/registrationService';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Ban,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Filter,
} from 'lucide-react';

const MyRegistrationsPage = () => {
  const { showToast } = useToast();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, UPCOMING, COMPLETED, CANCELLED

  // Cancel dialog state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedRegId, setSelectedRegId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const data = await registrationService.getMyRegistrations();
      setRegistrations(data);
    } catch (err) {
      showToast(err.message || 'Failed to fetch registrations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleOpenCancel = (id) => {
    setSelectedRegId(id);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedRegId) return;
    setCancelling(true);
    try {
      await registrationService.cancelRegistration(selectedRegId);
      showToast('Registration successfully cancelled.', 'info');
      setCancelModalOpen(false);
      setSelectedRegId(null);
      await fetchRegistrations();
    } catch (err) {
      showToast(err.message || 'Cancellation failed', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const filteredRegistrations = registrations.filter((reg) => {
    if (filter === 'CONFIRMED') return reg.status === 'CONFIRMED';
    if (filter === 'CANCELLED') return reg.status === 'CANCELLED';
    if (filter === 'UPCOMING') return reg.status === 'CONFIRMED' && reg.eventDate >= today;
    if (filter === 'PAST') return reg.status === 'CONFIRMED' && reg.eventDate < today;
    return true;
  });

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-workshop" style={{ marginBottom: '0.5rem' }}>
          My Registrations
        </span>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.4rem' }}>
          Registered Seminars & Workshops
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Track seat reservations, participation statuses, and official faculty attendance records.
        </p>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.75rem',
        }}
      >
        {['ALL', 'UPCOMING', 'PAST', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`btn btn-sm ${filter === tab ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching your event registrations..." />
      ) : filteredRegistrations.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No registrations found"
          description={
            filter === 'ALL'
              ? "You haven't registered for any departmental events yet."
              : `No registrations found under the "${filter.toLowerCase()}" filter.`
          }
          action={
            <Link to="/events" className="btn btn-primary btn-sm">
              Discover Events
            </Link>
          }
        />
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event Details</th>
                <th>Category</th>
                <th>Schedule</th>
                <th>Registration Date</th>
                <th>Status</th>
                <th>Attendance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((reg) => {
                const isConfirmed = reg.status === 'CONFIRMED';
                const canCancel = isConfirmed && reg.canCancel;

                return (
                  <tr key={reg.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        <Link to={`/events/${reg.eventId}`}>{reg.eventTitle}</Link>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Venue: {reg.venue}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${reg.eventCategory === 'Seminar' ? 'badge-seminar' : 'badge-workshop'}`}>
                        {reg.eventCategory}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{reg.eventDate}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {reg.startTime?.substring(0, 5)} - {reg.endTime?.substring(0, 5)}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {reg.registrationDate?.replace('T', ' ').substring(0, 16)}
                    </td>
                    <td>
                      <span className={`badge badge-${reg.status?.toLowerCase()}`}>
                        {reg.status}
                      </span>
                    </td>
                    <td>
                      {reg.attendanceStatus === 'PRESENT' && (
                        <span className="badge badge-present" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle2 size={13} /> Present
                        </span>
                      )}
                      {reg.attendanceStatus === 'ABSENT' && (
                        <span className="badge badge-absent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <XCircle size={13} /> Absent
                        </span>
                      )}
                      {reg.attendanceStatus === 'NOT_MARKED' && (
                        <span className="badge badge-not-marked" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <HelpCircle size={13} /> Not Marked
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link
                          to={`/events/${reg.eventId}`}
                          className="btn btn-secondary btn-sm"
                          title="View Event Details"
                        >
                          <ExternalLink size={14} /> View
                        </Link>
                        {canCancel && (
                          <button
                            type="button"
                            onClick={() => handleOpenCancel(reg.id)}
                            className="btn btn-ghost btn-sm"
                            style={{ color: '#EF4444' }}
                            title="Cancel Registration"
                          >
                            <Ban size={14} /> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancellation Modal */}
      <ConfirmDialog
        isOpen={cancelModalOpen}
        title="Cancel Seat Reservation"
        message="Are you sure you want to cancel your registration? Your reserved seat will be immediately released to the available pool."
        confirmText="Confirm Cancellation"
        confirmVariant="danger"
        loading={cancelling}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelModalOpen(false)}
      />
    </div>
  );
};

export default MyRegistrationsPage;
