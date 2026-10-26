import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportService } from '../services/reportService';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Compass,
  CalendarCheck2,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

const LandingPage = () => {
  const [stats, setStats] = useState({
    totalEvents: 5,
    upcomingEvents: 4,
    totalRegistrations: 8,
    completedWorkshops: 1,
  });
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewData, eventsData] = await Promise.allSettled([
          reportService.getOverview(),
          eventService.getAllEvents({ status: 'UPCOMING' }),
        ]);

        if (overviewData.status === 'fulfilled' && overviewData.value) {
          const d = overviewData.value;
          setStats({
            totalEvents: d.totalEvents || 5,
            upcomingEvents: d.statusDistribution?.UPCOMING || 4,
            totalRegistrations: d.totalRegistrations || 8,
            completedWorkshops: d.statusDistribution?.COMPLETED || 1,
          });
        }

        if (eventsData.status === 'fulfilled' && eventsData.value) {
          setFeaturedEvents(eventsData.value.slice(0, 3));
        }
      } catch (err) {
        console.warn('Using seeded data for landing page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 0 4.5rem',
          background: 'radial-gradient(ellipse at 80% 20%, rgba(79, 124, 255, 0.15), transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(139, 92, 246, 0.12), transparent 50%)',
          borderBottom: '1px solid var(--border-color)',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Headline & Call To Action */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(79, 124, 255, 0.1)',
                  border: '1px solid rgba(79, 124, 255, 0.25)',
                  color: 'var(--primary-blue)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                }}
              >
                <Sparkles size={14} /> ACADEMIC EVENTS, REIMAGINED
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5vw, 3.75rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  marginBottom: '1.25rem',
                }}
              >
                Smarter Events.{' '}
                <span className="gradient-text">Simpler Experiences.</span>
              </h1>

              <p
                style={{
                  fontSize: '1.125rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  maxWidth: '540px',
                  marginBottom: '2rem',
                }}
              >
                Discover research seminars, enroll in hands-on workshops, and track attendance seamlessly
                with <strong>EventEase</strong> — the centralized event management system for Computer Science & Engineering.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <Link to="/events" className="btn btn-primary btn-lg">
                  Explore Events <ArrowRight size={18} />
                </Link>
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Get Started
                </Link>
              </div>

              {/* Badges / Highlights */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  marginTop: '2.5rem',
                  paddingTop: '2rem',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={16} style={{ color: '#10B981' }} /> Role-Based Access Control
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={16} style={{ color: '#10B981' }} /> Capacity & Deadlines Guard
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={16} style={{ color: '#10B981' }} /> Attendance Tracking
                </div>
              </div>
            </div>

            {/* Right Column: Interactive UI Showcase Mockup */}
            <div style={{ position: 'relative' }}>
              {/* Outer decorative glowing orb */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-10px',
                  background: 'var(--brand-gradient)',
                  borderRadius: 'var(--radius-lg)',
                  filter: 'blur(30px)',
                  opacity: 0.25,
                  zIndex: 0,
                }}
              />

              {/* Main Showcase Card */}
              <div
                className="glass-card"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  padding: '1.75rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1.5px solid var(--border-color)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                {/* Header of Preview */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem', fontWeight: 600 }}>
                      Live Platform Preview
                    </span>
                  </div>
                  <span className="badge badge-upcoming" style={{ fontSize: '0.7rem' }}>
                    Registration Open
                  </span>
                </div>

                {/* Simulated Featured Event Card Preview */}
                <div
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge badge-workshop">Workshop</span>
                    <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>92% Attended</span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Architecting Cloud-Native Microservices with Spring Boot 3
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                    Tech Park Lab 402 • Capacity: 60 Seats
                  </p>
                  <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: '75%', height: '100%', background: 'var(--brand-gradient)' }} />
                  </div>
                </div>

                {/* Floating Metric Pill */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <Users size={20} style={{ color: 'var(--primary-blue)' }} />
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>8+</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Confirmed Registrations</div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <Award size={20} style={{ color: 'var(--violet)' }} />
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>100%</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Verified Records</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STATISTICS SECTION
          ========================================================================= */}
      <section style={{ padding: '3.5rem 0', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }} className="gradient-text">
                {stats.totalEvents}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.35rem' }}>
                Total Department Events
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: 'var(--primary-blue)' }}>
                {stats.upcomingEvents}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.35rem' }}>
                Upcoming Seminars & Workshops
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: 'var(--violet)' }}>
                {stats.totalRegistrations}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.35rem' }}>
                Registered Participants
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: 'var(--cyan-accent)' }}>
                {stats.completedWorkshops}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.35rem' }}>
                Completed Sessions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED EVENTS SECTION
          ========================================================================= */}
      <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-seminar" style={{ marginBottom: '0.5rem' }}>
                Upcoming Opportunities
              </span>
              <h2 style={{ fontSize: '2rem' }}>Featured Seminars & Workshops</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
                Register early to secure seats in high-demand technical sessions.
              </p>
            </div>
            <Link to="/events" className="btn btn-outline">
              View All Events <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching featured academic events..." />
          ) : featuredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No featured events scheduled at this moment.</p>
              <Link to="/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Explore All Events
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.75rem',
              }}
            >
              {featuredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          BENEFITS SECTION
          ========================================================================= */}
      <section style={{ padding: '4.5rem 0', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="badge badge-workshop" style={{ marginBottom: '0.5rem' }}>
              Why EventEase
            </span>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>
              Engineered for Seamless Department Collaboration
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              A purpose-built web platform bridging faculty organizers, student participants, and department administrators.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {/* Feature 1 */}
            <div className="card card-hover">
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(79, 124, 255, 0.12)',
                  color: 'var(--primary-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Compass size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Discover Events</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Browse upcoming seminars, guest lectures, and coding workshops with instant category, status, and title filtering.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card card-hover">
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(139, 92, 246, 0.12)',
                  color: 'var(--violet)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <CalendarCheck2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Easy Registration</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                One-click registration with real-time seat availability checks, strict capacity constraints, and duplicate prevention.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card card-hover">
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(34, 211, 238, 0.12)',
                  color: '#06B6D4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Layers size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Smart Event Management</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Faculty organizers can create, schedule, modify, or cancel technical sessions with complete authorization controls.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card card-hover">
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Attendance Tracking</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Mark participant attendance on the spot (Present / Absent) and review automated department attendance percentages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS SECTION
          ========================================================================= */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-seminar" style={{ marginBottom: '0.5rem' }}>
              Workflow
            </span>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>How EventEase Works</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Three simple steps from discovery to attendance record verification.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              position: 'relative',
            }}
          >
            {/* Step 1 */}
            <div
              className="glass-card"
              style={{
                padding: '2rem',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--brand-gradient)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Discover an Event</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Browse seminars and workshops hosted by the CSE department. View topics, venue, speakers, and schedule.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="glass-card"
              style={{
                padding: '2rem',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--brand-gradient)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Register for a Seat</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Sign in with your student credentials and reserve your seat before capacity is reached or the deadline closes.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="glass-card"
              style={{
                padding: '2rem',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--brand-gradient)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Attend & Track</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Attend the session, have your attendance recorded by faculty, and review your participation history on your dashboard.
              </p>
            </div>
          </div>

          {/* Banner CTA */}
          <div
            style={{
              marginTop: '4rem',
              padding: '2.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, rgba(79, 124, 255, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
              border: '1.5px solid var(--border-color)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>Ready to explore department events?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Join fellow students and faculty on EventEase today.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Free Account <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
