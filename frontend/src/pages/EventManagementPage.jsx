import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  PlusCircle,
  Search,
  Filter,
  Edit3,
  XCircle,
  Users,
  CheckCircle,
  Calendar,
  ExternalLink,
  Trash2,
} from 'lucide-react';

const EventManagementPage = () => {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [status, setStatus] = useState('ALL');

  // Cancel dialog
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Delete dialog
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'ALL') params.category = category;
      if (status !== 'ALL') params.status = status;

      const data = await eventService.getAllEvents(params);
      // If organizer and not admin, filter to only events managed by them
      if (!isAdmin) {
        setEvents(data.filter((e) => e.organizerId === user?.id));
      } else {
        setEvents(data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleOpenCancel = (eventId) => {
    setSelectedEventId(eventId);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedEventId) return;
    setCancelling(true);
    try {
      await eventService.cancelEvent(selectedEventId);
      showToast('Event marked as CANCELLED.', 'info');
      setCancelModalOpen(false);
      setSelectedEventId(null);
      await fetchEvents();
    } catch (err) {
      showToast(err.message || 'Failed to cancel event', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const handleOpenDelete = (eventId) => {
    setSelectedEventId(eventId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEventId) return;
    setDeleting(true);
    try {
      await eventService.deleteEvent(selectedEventId);
      showToast('Event permanently deleted.', 'success');
      setDeleteModalOpen(false);
      setSelectedEventId(null);
      await fetchEvents();
    } catch (err) {
      showToast(err.message || 'Failed to delete event', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-seminar" style={{ marginBottom: '0.4rem' }}>
            Faculty Administration
          </span>
          <h1 style={{ fontSize: '2.25rem' }}>
            {isAdmin ? 'System Event Management' : 'My Event Management'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Author, update schedules, inspect enrolled student rosters, and log session attendance.
          </p>
        </div>

        <Link to="/organizer/events/new" className="btn btn-primary">
          <PlusCircle size={18} /> Publish New Event
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 280px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ minWidth: '140px' }}
          >
            <option value="ALL">All Categories</option>
            <option value="Seminar">Seminars</option>
            <option value="Workshop">Workshops</option>
          </select>

          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ minWidth: '140px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      {loading ? (
        <LoadingSpinner text="Retrieving events..." />
      ) : events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events found"
          description="No events match your current filter criteria."
          action={
            <Link to="/organizer/events/new" className="btn btn-primary btn-sm">
              Create an Event
            </Link>
          }
        />
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Category</th>
                <th>Event Date & Time</th>
                <th>Capacity / Booked</th>
                <th>Status</th>
                {isAdmin && <th>Organizer</th>}
                <th>Management Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => {
                const isCancelled = ev.status === 'CANCELLED';

                return (
                  <tr key={ev.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        <Link to={`/events/${ev.id}`}>{ev.title}</Link>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {ev.venue}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${ev.category === 'Seminar' ? 'badge-seminar' : 'badge-workshop'}`}>
                        {ev.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{ev.eventDate}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {ev.startTime?.substring(0, 5)} - {ev.endTime?.substring(0, 5)}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {ev.registeredCount} / {ev.capacity}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {ev.availableSeats} available
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${ev.status?.toLowerCase()}`}>
                        {ev.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td style={{ fontSize: '0.85rem' }}>
                        {ev.organizerName || 'Faculty'}
                      </td>
                    )}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <Link
                          to={`/organizer/events/${ev.id}/edit`}
                          className="btn btn-secondary btn-sm"
                          title="Edit Event Details"
                        >
                          <Edit3 size={14} /> Edit
                        </Link>
                        <Link
                          to={`/organizer/attendance?eventId=${ev.id}`}
                          className="btn btn-primary btn-sm"
                          title="View Registered Students & Mark Attendance"
                        >
                          <Users size={14} /> Participants
                        </Link>
                        {!isCancelled && (
                          <button
                            type="button"
                            onClick={() => handleOpenCancel(ev.id)}
                            className="btn btn-ghost btn-sm"
                            style={{ color: '#F59E0B' }}
                            title="Cancel Event"
                          >
                            <XCircle size={14} /> Cancel
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(ev.id)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#EF4444' }}
                          title="Permanently Delete Event"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={cancelModalOpen}
        title="Cancel Department Event?"
        message="Are you sure you want to cancel this event? This will stop accepting further student registrations and mark the event status as CANCELLED."
        confirmText="Confirm Cancellation"
        confirmVariant="danger"
        loading={cancelling}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelModalOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        title="Delete Department Event Permanently?"
        message="Are you sure you want to permanently delete this event and all associated student registrations? This action cannot be undone."
        confirmText="Yes, Permanently Delete"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default EventManagementPage;
