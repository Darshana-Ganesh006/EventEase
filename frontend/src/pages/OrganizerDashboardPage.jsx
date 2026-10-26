import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  Calendar,
  Users,
  CheckCircle,
  PlusCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Settings,
  UserCheck,
} from 'lucide-react';

const OrganizerDashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getOrganizerDashboard();
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to load organizer dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', minHeight: '60vh' }}>
        <LoadingSpinner text="Aggregating faculty organizer statistics..." />
      </div>
    );
  }

  const events = data?.myEvents || [];
  const recentRegistrations = data?.recentRegistrations || [];

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(79, 124, 255, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
          border: '1.5px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 2.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <div>
          <span className="badge badge-seminar" style={{ marginBottom: '0.4rem' }}>
            Faculty & Organizer Workspace
          </span>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>
            Organizer Dashboard — {data?.organizerName || user?.fullName}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Manage departmental seminars, workshops, participant enrollment, and live attendance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/organizer/events/new" className="btn btn-primary">
            <PlusCircle size={18} /> Create New Event
          </Link>
          <Link to="/organizer/attendance" className="btn btn-secondary">
            <UserCheck size={18} /> Mark Attendance
          </Link>
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}
      >
        <StatCard
          icon={Calendar}
          label="Total Events Created"
          value={data?.totalEventsCreated || 0}
          subtext="Under your faculty portfolio"
          gradient="linear-gradient(135deg, #4F7CFF 0%, #8B5CF6 100%)"
        />
        <StatCard
          icon={Clock}
          label="Upcoming Events"
          value={data?.upcomingEventsCount || 0}
          subtext="Scheduled & open for booking"
          gradient="linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%)"
        />
        <StatCard
          icon={Users}
          label="Registrations Received"
          value={data?.totalRegistrationsReceived || 0}
          subtext="Total confirmed students"
          gradient="linear-gradient(135deg, #22D3EE 0%, #4F7CFF 100%)"
        />
        <StatCard
          icon={CheckCircle}
          label="Attendance Rate"
          value={`${data?.attendanceRate || 0}%`}
          subtext={`${data?.totalPresentCount || 0} verified present`}
          gradient="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
        />
      </div>

      {/* Managed Events Section */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.4rem' }}>My Managed Events</h2>
          <Link to="/organizer/events" className="btn btn-ghost btn-sm">
            View All <ArrowRight size={15} />
          </Link>
        </div>

        {events.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No events created yet"
            description="You haven't authored any technical workshops or seminars yet. Start by publishing your first event."
            action={
              <Link to="/organizer/events/new" className="btn btn-primary btn-sm">
                Create First Event
              </Link>
            }
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date & Time</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 5).map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{ev.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ev.venue}</div>
                    </td>
                    <td>
                      <span className={`badge ${ev.category === 'Seminar' ? 'badge-seminar' : 'badge-workshop'}`}>
                        {ev.category}
                      </span>
                    </td>
                    <td>
                      <div>{ev.eventDate}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {ev.startTime?.substring(0, 5)} - {ev.endTime?.substring(0, 5)}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {ev.registeredCount} / {ev.capacity} booked
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${ev.status?.toLowerCase()}`}>
                        {ev.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/organizer/events/${ev.id}/edit`} className="btn btn-secondary btn-sm">
                          Edit
                        </Link>
                        <Link to={`/organizer/attendance?eventId=${ev.id}`} className="btn btn-primary btn-sm">
                          Attendance
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboardPage;
