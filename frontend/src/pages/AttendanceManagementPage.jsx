import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { attendanceService } from '../services/attendanceService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  Calendar,
  ArrowLeft,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';

const AttendanceManagementPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialEventId = searchParams.get('eventId') || '';
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [participants, setParticipants] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [markingId, setMarkingId] = useState(null);
  const [search, setSearch] = useState('');

  // 1. Fetch available events for this organizer
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const all = await eventService.getAllEvents();
        // If organizer, show only their events unless admin
        const myEvents = isAdmin ? all : all.filter(e => e.organizerId === user?.id);
        setEvents(myEvents);

        if (!selectedEventId && myEvents.length > 0) {
          setSelectedEventId(String(myEvents[0].id));
        }
      } catch (err) {
        showToast('Could not load events list', 'error');
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [isAdmin, user?.id]);

  // 2. Fetch attendance for selected event
  const fetchAttendanceRecords = async (eventId) => {
    if (!eventId) return;
    setLoadingAttendance(true);
    try {
      const records = await attendanceService.getEventAttendance(eventId);
      setParticipants(records);
    } catch (err) {
      showToast(err.message || 'Failed to load attendance list', 'error');
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      setSearchParams({ eventId: selectedEventId });
      fetchAttendanceRecords(selectedEventId);
    }
  }, [selectedEventId]);

  const handleStatusUpdate = async (registrationId, newStatus) => {
    setMarkingId(registrationId);
    try {
      const updated = await attendanceService.updateAttendance(registrationId, newStatus);
      setParticipants(prev =>
        prev.map(p => (p.registrationId === registrationId ? updated : p))
      );
      showToast(`Status updated to ${newStatus}`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update attendance', 'error');
    } finally {
      setMarkingId(null);
    }
  };

  const selectedEvent = events.find(e => String(e.id) === String(selectedEventId));

  // Compute stats
  const totalRoster = participants.length;
  const presentCount = participants.filter(p => p.attendanceStatus === 'PRESENT').length;
  const absentCount = participants.filter(p => p.attendanceStatus === 'ABSENT').length;
  const notMarkedCount = participants.filter(p => p.attendanceStatus === 'NOT_MARKED').length;
  const attendanceRate = totalRoster > 0 ? Math.round((presentCount / totalRoster) * 100) : 0;

  const filteredParticipants = participants.filter(p => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.studentName?.toLowerCase().includes(q) ||
      p.studentEmail?.toLowerCase().includes(q) ||
      p.studentDepartment?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Link to="/organizer/events" className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to Events
        </Link>
        <span className="badge badge-seminar" style={{ marginBottom: '0.4rem' }}>
          Attendance Tracking System
        </span>
        <h1 style={{ fontSize: '2.25rem' }}>Event Attendance Management</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Verify student participant presence, mark attendance records, and compute verified participation percentages.
        </p>
      </div>

      {/* Event Selector Toolbar */}
      <div
        className="glass-card"
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.25rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: '1 1 320px' }}>
          <label className="form-label" htmlFor="event-selector">
            Select Department Event
          </label>
          <select
            id="event-selector"
            className="form-select"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            disabled={loadingEvents || events.length === 0}
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                [{ev.category}] {ev.title} ({ev.eventDate})
              </option>
            ))}
          </select>
        </div>

        {selectedEvent && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', paddingTop: '1.5rem' }}>
            <button
              onClick={() => fetchAttendanceRecords(selectedEventId)}
              className="btn btn-secondary btn-sm"
              title="Refresh Roster"
            >
              <RefreshCw size={15} /> Refresh List
            </button>
            <Link to={`/events/${selectedEvent.id}`} className="btn btn-outline btn-sm">
              View Public Page
            </Link>
          </div>
        )}
      </div>

      {/* Summary KPI Strip */}
      {selectedEvent && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Registered
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{totalRoster}</div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#10B981', textTransform: 'uppercase', fontWeight: 600 }}>
              Present
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981', marginTop: '0.25rem' }}>{presentCount}</div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#EF4444', textTransform: 'uppercase', fontWeight: 600 }}>
              Absent
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#EF4444', marginTop: '0.25rem' }}>{absentCount}</div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#F59E0B', textTransform: 'uppercase', fontWeight: 600 }}>
              Not Marked
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F59E0B', marginTop: '0.25rem' }}>{notMarkedCount}</div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary-blue)', textTransform: 'uppercase', fontWeight: 600 }}>
              Attendance Rate
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-blue)', marginTop: '0.25rem' }}>{attendanceRate}%</div>
          </div>
        </div>
      )}

      {/* Participant Filter Bar */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.35rem' }}>Enrolled Student Roster</h2>
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
        </div>
      </div>

      {/* Table */}
      {loadingAttendance ? (
        <LoadingSpinner text="Retrieving registered participants..." />
      ) : filteredParticipants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No registered students"
          description={
            search
              ? 'No registered participants match your search query.'
              : 'There are currently no students registered for this session.'
          }
        />
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Academic Email</th>
                <th>Department</th>
                <th>Current Status</th>
                <th>Marked By / Time</th>
                <th>Mark Attendance</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((p) => {
                const isMarking = markingId === p.registrationId;
                const status = p.attendanceStatus;

                return (
                  <tr key={p.id || p.registrationId}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.studentName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Reg #{p.registrationId}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{p.studentEmail}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {p.studentDepartment}
                    </td>
                    <td>
                      {status === 'PRESENT' && (
                        <span className="badge badge-present">
                          <CheckCircle2 size={13} /> Present
                        </span>
                      )}
                      {status === 'ABSENT' && (
                        <span className="badge badge-absent">
                          <XCircle size={13} /> Absent
                        </span>
                      )}
                      {status === 'NOT_MARKED' && (
                        <span className="badge badge-not-marked">
                          <HelpCircle size={13} /> Not Marked
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {p.markedByName ? (
                        <>
                          <div>{p.markedByName}</div>
                          <div>{p.markedAt?.replace('T', ' ').substring(0, 16)}</div>
                        </>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(p.registrationId, 'PRESENT')}
                          disabled={isMarking || status === 'PRESENT'}
                          className="btn btn-sm"
                          style={{
                            background: status === 'PRESENT' ? '#10B981' : 'rgba(16, 185, 129, 0.15)',
                            color: status === 'PRESENT' ? '#FFFFFF' : '#10B981',
                            padding: '0.35rem 0.65rem',
                          }}
                          title="Mark Present"
                        >
                          <Check size={14} /> Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(p.registrationId, 'ABSENT')}
                          disabled={isMarking || status === 'ABSENT'}
                          className="btn btn-sm"
                          style={{
                            background: status === 'ABSENT' ? '#EF4444' : 'rgba(239, 68, 68, 0.15)',
                            color: status === 'ABSENT' ? '#FFFFFF' : '#EF4444',
                            padding: '0.35rem 0.65rem',
                          }}
                          title="Mark Absent"
                        >
                          <X size={14} /> Absent
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
    </div>
  );
};

export default AttendanceManagementPage;
