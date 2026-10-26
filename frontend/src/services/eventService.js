import api, { isBackendConnected } from './api';

// Seed events matching database/seed.sql for offline / static demo presentation
const SEED_EVENTS = [
  {
    id: 1,
    title: 'Architecting Cloud-Native Microservices with Spring Boot 3 & Kubernetes',
    description: 'A hands-on, high-impact technical workshop covering enterprise microservices, service mesh orchestration, reactive streams, and production deployment on cloud clusters.',
    category: 'Workshop',
    eventDate: '2026-11-15',
    startTime: '09:30:00',
    endTime: '16:30:00',
    venue: 'Tech Park Lab 402, Block B',
    capacity: 60,
    registeredCount: 3,
    availableSeats: 57,
    registrationDeadline: '2026-11-12',
    posterUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    status: 'UPCOMING',
    organizerId: 2,
    organizerName: 'Prof. Ananya Sharma',
    organizerDepartment: 'Computer Science and Engineering',
    organizerEmail: 'ananya.cse@eventease.srmist.edu.in',
    isRegistrationOpen: true,
    isUserRegistered: false,
  },
  {
    id: 2,
    title: 'Frontiers in Generative AI: Large Multimodal Models and Agents',
    description: 'An intensive academic seminar exploring the theoretical underpinnings of transformer architectures, diffusion reasoning, reinforcement learning from human feedback (RLHF), and autonomous AI agent workflows.',
    category: 'Seminar',
    eventDate: '2026-11-20',
    startTime: '10:00:00',
    endTime: '13:00:00',
    venue: 'Dr. T.P. Ganesan Auditorium Hall 2',
    capacity: 120,
    registeredCount: 2,
    availableSeats: 118,
    registrationDeadline: '2026-11-18',
    posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    status: 'UPCOMING',
    organizerId: 3,
    organizerName: 'Dr. Karthik Raman',
    organizerDepartment: 'Artificial Intelligence and Data Science',
    organizerEmail: 'karthik.ai@eventease.srmist.edu.in',
    isRegistrationOpen: true,
    isUserRegistered: false,
  },
  {
    id: 3,
    title: 'Full-Stack Modern Web Engineering with React 19 and Vite',
    description: 'Interactive coding masterclass focusing on component architecture, state management patterns, CSS variables design systems, API security, and performance profiling.',
    category: 'Workshop',
    eventDate: '2026-11-28',
    startTime: '13:30:00',
    endTime: '17:30:00',
    venue: 'CSE Computing Center Hall 1',
    capacity: 50,
    registeredCount: 0,
    availableSeats: 50,
    registrationDeadline: '2026-11-26',
    posterUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    status: 'UPCOMING',
    organizerId: 2,
    organizerName: 'Prof. Ananya Sharma',
    organizerDepartment: 'Computer Science and Engineering',
    organizerEmail: 'ananya.cse@eventease.srmist.edu.in',
    isRegistrationOpen: true,
    isUserRegistered: false,
  },
  {
    id: 4,
    title: 'Zero Trust Architecture and Practical Cyber Threat Defense',
    description: 'Advanced seminar covering enterprise perimeter elimination, identity verification protocols, API gateway security, OAuth2/OIDC, and threat modeling.',
    category: 'Seminar',
    eventDate: '2026-12-05',
    startTime: '14:00:00',
    endTime: '17:00:00',
    venue: 'Seminar Hall 301, Academic Block',
    capacity: 80,
    registeredCount: 0,
    availableSeats: 80,
    registrationDeadline: '2026-12-03',
    posterUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    status: 'UPCOMING',
    organizerId: 3,
    organizerName: 'Dr. Karthik Raman',
    organizerDepartment: 'Artificial Intelligence and Data Science',
    organizerEmail: 'karthik.ai@eventease.srmist.edu.in',
    isRegistrationOpen: true,
    isUserRegistered: false,
  },
  {
    id: 5,
    title: 'Introduction to Embedded Edge Computing and IoT Sensors',
    description: 'Comprehensive past workshop on microcontroller programming, real-time sensor telemetry, MQTT brokers, and lightweight inference at the edge.',
    category: 'Workshop',
    eventDate: '2026-10-10',
    startTime: '09:00:00',
    endTime: '16:00:00',
    venue: 'IoT Innovation Lab 105',
    capacity: 40,
    registeredCount: 3,
    availableSeats: 37,
    registrationDeadline: '2026-10-08',
    posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    status: 'COMPLETED',
    organizerId: 2,
    organizerName: 'Prof. Ananya Sharma',
    organizerDepartment: 'Computer Science and Engineering',
    organizerEmail: 'ananya.cse@eventease.srmist.edu.in',
    isRegistrationOpen: false,
    isUserRegistered: false,
  },
];

export const eventService = {
  getAllEvents: async (params = {}) => {
    try {
      const response = await api.get('/events', { params });
      return response.data;
    } catch (err) {
      // If backend is offline or unconfigured on static hosting, provide fallback seed events
      let filtered = [...SEED_EVENTS];
      if (params.category && params.category !== 'ALL') {
        filtered = filtered.filter((e) => e.category.toLowerCase() === params.category.toLowerCase());
      }
      if (params.status && params.status !== 'ALL') {
        filtered = filtered.filter((e) => e.status.toLowerCase() === params.status.toLowerCase());
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q) ||
            e.venue.toLowerCase().includes(q)
        );
      }
      return filtered;
    }
  },

  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (err) {
      const found = SEED_EVENTS.find((e) => String(e.id) === String(id));
      if (found) return found;
      throw err;
    }
  },

  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  updateEventStatus: async (id, status) => {
    const response = await api.patch(`/events/${id}/status`, { status });
    return response.data;
  },

  cancelEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}/permanent`);
    return response.data;
  },
};
