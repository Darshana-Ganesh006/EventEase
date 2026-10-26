import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  CalendarCheck,
  CalendarDays,
  Award,
  ArrowRight,
  Clock,
  MapPin,
  ExternalLink,
} from 'lucide-react';

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await dashboardService.getStudentDashboard();
        setDashboard(data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', minHeight: '60vh' }}>
        <LoadingSpinner text="Loading student portal metrics..." />
      </div>
    );
  }

  const upcomingList = dashboard?.upcomingRegistrations || [];

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      {/* Welcome Banner */}
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
          <span className="badge badge-workshop" style={{ marginBottom: '0.4rem' }}>
            Student Workspace
          </span>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>
            Welcome back, {dashboard?.studentName || user?.fullName}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            {dashboard?.department || user?.department} • SRM Institute of Science & Technology
          </p>
        </div>
        <div>
          <Link to="/events" className="btn btn-primary">
            Browse New Events <ArrowRight size={16} />
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}
      >
        <StatCard
          icon={CalendarCheck}
          label="Total Registrations"
          value={dashboard?.totalRegistrations || 0}
          subtext="Confirmed academic sessions"
          gradient="linear-gradient(135deg, #4F7CFF 0%, #8B5CF6 100%)"
        />
        <StatCard
          icon={CalendarDays}
          label="Upcoming Events"
          value={dashboard?.upcomingEventsCount || 0}
          subtext="Scheduled on your calendar"
          gradient="linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%)"
        />
        <StatCard
          icon={Award}
          label="Verified Attendances"
          value={dashboard?.attendedEventsCount || 0}
          subtext="Marked PRESENT by faculty"
          gradient="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
        />
      </div>

      {/* Upcoming Registered Events */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.4rem' }}>Upcoming Enrolled Events</h2>
          <Link to="/student/registrations" className="btn btn-ghost btn-sm">
            View All Registrations <ArrowRight size={15} />
          </Link>
        </div>

        {upcomingList.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No upcoming events registered"
            description="You haven't reserved seats in any upcoming seminars or workshops yet."
            action={
              <Link to="/events" className="btn btn-primary btn-sm">
                Explore Available Events
              </Link>
            }
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {upcomingList.map((reg) => (
              <div key={reg.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className={`badge ${reg.eventCategory === 'Seminar' ? 'badge-seminar' : 'badge-workshop'}`}>
                    {reg.eventCategory}
                  </span>
                  <span className="badge badge-upcoming">CONFIRMED</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.65rem' }}>
                  <Link to={`/events/${reg.eventId}`}>{reg.eventTitle}</Link>
                </h3>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: 'auto', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CalendarCheck size={14} style={{ color: 'var(--primary-blue)' }} />
                    <span>{reg.eventDate} • {reg.startTime?.substring(0, 5)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} style={{ color: 'var(--violet)' }} />
                    <span>{reg.venue}</span>
                  </div>
                </div>
                <Link to={`/events/${reg.eventId}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  <span>View Details</span> <ExternalLink size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboardPage;
