import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  Tag,
  ArrowLeft,
  Save,
  Image,
} from 'lucide-react';

const CreateEditEventPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Workshop',
    eventDate: '',
    startTime: '09:30',
    endTime: '16:30',
    venue: '',
    capacity: 60,
    registrationDeadline: '',
    posterUrl: '',
    status: 'UPCOMING',
  });

  useEffect(() => {
    if (isEditMode) {
      const loadEvent = async () => {
        try {
          const ev = await eventService.getEventById(id);
          setFormData({
            title: ev.title || '',
            description: ev.description || '',
            category: ev.category || 'Workshop',
            eventDate: ev.eventDate || '',
            startTime: ev.startTime ? ev.startTime.substring(0, 5) : '09:30',
            endTime: ev.endTime ? ev.endTime.substring(0, 5) : '16:30',
            venue: ev.venue || '',
            capacity: ev.capacity || 60,
            registrationDeadline: ev.registrationDeadline || '',
            posterUrl: ev.posterUrl || '',
            status: ev.status || 'UPCOMING',
          });
        } catch (err) {
          setError(err.message || 'Failed to load event for editing.');
          showToast('Could not load event details', 'error');
        } finally {
          setLoading(false);
        }
      };
      loadEvent();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (formData.endTime <= formData.startTime) {
      setError('Event end time must be after the start time.');
      showToast('Invalid schedule: end time must be after start time', 'error');
      return;
    }

    if (formData.registrationDeadline > formData.eventDate) {
      setError('Registration deadline cannot be after the event date.');
      showToast('Invalid deadline: must be on or before the event date', 'error');
      return;
    }

    if (formData.capacity < 1) {
      setError('Capacity must be at least 1 participant.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
        endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime,
      };

      if (isEditMode) {
        await eventService.updateEvent(id, payload);
        showToast('Event updated successfully!', 'success');
      } else {
        await eventService.createEvent(payload);
        showToast('Event published successfully!', 'success');
      }
      navigate('/organizer/events');
    } catch (err) {
      setError(err.message || 'Operation failed. Please verify inputs.');
      showToast(err.message || 'Failed to save event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', minHeight: '60vh' }}>
        <LoadingSpinner text="Loading event specifications..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem', maxWidth: '800px' }}>
      <Link to="/organizer/events" className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Events Management
      </Link>

      <div className="glass-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-workshop" style={{ marginBottom: '0.4rem' }}>
            {isEditMode ? 'Modify Event' : 'New Publication'}
          </span>
          <h1 style={{ fontSize: '2rem' }}>
            {isEditMode ? 'Edit Department Event' : 'Create Department Event'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Specify session topic, speaker agenda, venue, capacity constraints, and enrollment cutoff.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title-input">
              Event Title *
            </label>
            <input
              id="title-input"
              name="title"
              type="text"
              className="form-control"
              placeholder="e.g., Deep Learning Workshop with PyTorch"
              value={formData.title}
              onChange={handleChange}
              required
              minLength={5}
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="desc-input">
              Description & Agenda *
            </label>
            <textarea
              id="desc-input"
              name="description"
              className="form-control"
              rows={5}
              placeholder="Provide a comprehensive summary of lecture modules, practical outcomes, and pre-requisites..."
              value={formData.description}
              onChange={handleChange}
              required
              minLength={10}
              maxLength={4000}
            />
          </div>

          {/* Category & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="category-select">
                Category *
              </label>
              <select
                id="category-select"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>

            {isEditMode && (
              <div className="form-group">
                <label className="form-label" htmlFor="status-select">
                  Event Status *
                </label>
                <select
                  id="status-select"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            )}
          </div>

          {/* Date, Start Time, End Time */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="date-input">
                Event Date *
              </label>
              <input
                id="date-input"
                name="eventDate"
                type="date"
                className="form-control"
                value={formData.eventDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="start-input">
                Start Time *
              </label>
              <input
                id="start-input"
                name="startTime"
                type="time"
                className="form-control"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="end-input">
                End Time *
              </label>
              <input
                id="end-input"
                name="endTime"
                type="time"
                className="form-control"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Venue & Capacity */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="venue-input">
                Venue Location *
              </label>
              <input
                id="venue-input"
                name="venue"
                type="text"
                className="form-control"
                placeholder="e.g., Tech Park Lab 402, Block B"
                value={formData.venue}
                onChange={handleChange}
                required
                maxLength={150}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="capacity-input">
                Total Seat Capacity *
              </label>
              <input
                id="capacity-input"
                name="capacity"
                type="number"
                min={1}
                max={5000}
                className="form-control"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Registration Deadline & Poster URL */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="deadline-input">
                Registration Deadline *
              </label>
              <input
                id="deadline-input"
                name="registrationDeadline"
                type="date"
                className="form-control"
                value={formData.registrationDeadline}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="poster-input">
                Poster Image URL (Optional)
              </label>
              <input
                id="poster-input"
                name="posterUrl"
                type="url"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={formData.posterUrl}
                onChange={handleChange}
                maxLength={500}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <Link to="/organizer/events" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Save size={18} /> {submitting ? 'Saving...' : isEditMode ? 'Update Event' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditEventPage;
