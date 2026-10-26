import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Search, Filter, RotateCcw, Calendar, Layers } from 'lucide-react';

const EventsExplorerPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [status, setStatus] = useState('ALL');

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'ALL') params.category = category;
      if (status !== 'ALL') params.status = status;

      const data = await eventService.getAllEvents(params);
      setEvents(data);
    } catch (err) {
      setError(err.message || 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly or fetch on change
    const timer = setTimeout(() => {
      fetchEvents();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, category, status]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('ALL');
    setStatus('ALL');
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-workshop" style={{ marginBottom: '0.5rem' }}>
          Explore Catalogue
        </span>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
          Seminars & Workshops
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '640px' }}>
          Discover hands-on technical masterclasses and academic research seminars hosted by the
          Department of Computer Science and Engineering.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, description, or venue..."
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

        {/* Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="ALL">All Categories</option>
              <option value="Seminar">Seminars</option>
              <option value="Workshop">Workshops</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ position: 'relative' }}>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Reset button */}
          {(search || category !== 'ALL' || status !== 'ALL') && (
            <button
              onClick={handleResetFilters}
              className="btn btn-secondary btn-sm"
              title="Reset all filters"
            >
              <RotateCcw size={15} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            padding: '1rem 1.25rem',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Events Grid */}
      {loading ? (
        <LoadingSpinner text="Loading events..." />
      ) : events.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No events found"
          description="We couldn't find any events matching your selected criteria. Try adjusting your search term or filters."
          action={
            <button onClick={handleResetFilters} className="btn btn-outline btn-sm">
              Clear Filters
            </button>
          }
        />
      ) : (
        <>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Showing <strong>{events.length}</strong> {events.length === 1 ? 'event' : 'events'}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventsExplorerPage;
