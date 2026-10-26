-- =============================================================================
-- EventEase: Department Seminar and Workshop Management System
-- Database Seed Data (Sample demonstration data)
-- Default test password for all accounts is: password123
-- BCrypt Hash: $2a$10$wRvg2Q9f8R/PSTYoTRVV9u3L10BM/aoE8.IQz8bX3ykhTm/DhJzkq
-- =============================================================================

USE eventease_db;

-- -----------------------------------------------------------------------------
-- Seed Users (Admin, Organisers, Students)
-- -----------------------------------------------------------------------------
INSERT INTO users (id, full_name, email, password_hash, department, role, active) VALUES
(1, 'Dr. Rajesh Sundaram', 'admin@eventease.srmist.edu.in', '$2a$10$wRvg2Q9f8R/PSTYoTRVV9u3L10BM/aoE8.IQz8bX3ykhTm/DhJzkq', 'Computer Science and Engineering', 'ADMIN', TRUE),
(2, 'Prof. Ananya Sharma', 'ananya.cse@eventease.srmist.edu.in', '$2a$10$wRvg2Q9f8R/PSTYoTRVV9u3L10BM/aoE8.IQz8bX3ykhTm/DhJzkq', 'Computer Science and Engineering', 'ORGANISER', TRUE),
(3, 'Dr. Karthik Raman', 'karthik.ai@eventease.srmist.edu.in', '$2a$10$wRvg2Q9f8R/PSTYoTRVV9u3L10BM/aoE8.IQz8bX3ykhTm/DhJzkq', 'Artificial Intelligence and Data Science', 'ORGANISER', TRUE),
(4, 'Aarav Patel', 'aarav.student@eventease.srmist.edu.in', '$2a$10$wRvg2Q9f8R/PSTYoTRVV9u3L10BM/aoE8.IQz8bX3ykhTm/DhJzkq', 'Computer Science and Engineering', 'STUDENT', TRUE),
(5, 'Diya Sen', 'diya.student@eventease.srmist.edu.in', '$2a$10$wRvg2Q9f8R/PSTYoTRVV9u3L10BM/aoE8.IQz8bX3ykhTm/DhJzkq', 'Information Technology', 'STUDENT', TRUE),
(6, 'Rohan Verma', 'rohan.student@eventease.srmist.edu.in', '$2a$10$wRvg2Q9f8R/PSTYoTRVV9u3L10BM/aoE8.IQz8bX3ykhTm/DhJzkq', 'Computer Science and Engineering', 'STUDENT', TRUE),
(7, 'Sneha Krishnan', 'sneha.student@eventease.srmist.edu.in', '$2a$10$wRvg2Q9f8R/PSTYoTRVV9u3L10BM/aoE8.IQz8bX3ykhTm/DhJzkq', 'Electronics and Communication', 'STUDENT', TRUE);

-- -----------------------------------------------------------------------------
-- Seed Events (Seminars and Workshops)
-- Note: Dates are relative to academic calendar
-- -----------------------------------------------------------------------------
INSERT INTO events (id, title, description, category, event_date, start_time, end_time, venue, capacity, registration_deadline, poster_url, status, organizer_id) VALUES
(1, 'Architecting Cloud-Native Microservices with Spring Boot 3 & Kubernetes', 'A hands-on, high-impact technical workshop covering enterprise microservices, service mesh orchestration, reactive streams, and production deployment on cloud clusters.', 'Workshop', '2026-11-15', '09:30:00', '16:30:00', 'Tech Park Lab 402, Block B', 60, '2026-11-12', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80', 'UPCOMING', 2),
(2, 'Frontiers in Generative AI: Large Multimodal Models and Agents', 'An intensive academic seminar exploring the theoretical underpinnings of transformer architectures, diffusion reasoning, reinforcement learning from human feedback (RLHF), and autonomous AI agent workflows.', 'Seminar', '2026-11-20', '10:00:00', '13:00:00', 'Dr. T.P. Ganesan Auditorium Hall 2', 120, '2026-11-18', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', 'UPCOMING', 3),
(3, 'Full-Stack Modern Web Engineering with React 19 and Vite', 'Interactive coding masterclass focusing on component architecture, state management patterns, CSS variables design systems, API security, and performance profiling.', 'Workshop', '2026-11-28', '13:30:00', '17:30:00', 'CSE Computing Center Hall 1', 50, '2026-11-26', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80', 'UPCOMING', 2),
(4, 'Zero Trust Architecture and Practical Cyber Threat Defense', 'Advanced seminar covering enterprise perimeter elimination, identity verification protocols, API gateway security, OAuth2/OIDC, and threat modeling.', 'Seminar', '2026-12-05', '14:00:00', '17:00:00', 'Seminar Hall 301, Academic Block', 80, '2026-12-03', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80', 'UPCOMING', 3),
(5, 'Introduction to Embedded Edge Computing and IoT Sensors', 'Comprehensive past workshop on microcontroller programming, real-time sensor telemetry, MQTT brokers, and lightweight inference at the edge.', 'Workshop', '2026-10-10', '09:00:00', '16:00:00', 'IoT Innovation Lab 105', 40, '2026-10-08', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', 'COMPLETED', 2);

-- -----------------------------------------------------------------------------
-- Seed Registrations
-- -----------------------------------------------------------------------------
INSERT INTO registrations (id, student_id, event_id, registration_date, status) VALUES
(1, 4, 1, '2026-10-20 10:15:00', 'CONFIRMED'),
(2, 5, 1, '2026-10-21 11:30:00', 'CONFIRMED'),
(3, 6, 1, '2026-10-22 14:00:00', 'CONFIRMED'),
(4, 4, 2, '2026-10-22 15:45:00', 'CONFIRMED'),
(5, 7, 2, '2026-10-23 09:20:00', 'CONFIRMED'),
(6, 4, 5, '2026-10-01 10:00:00', 'CONFIRMED'),
(7, 5, 5, '2026-10-01 12:15:00', 'CONFIRMED'),
(8, 6, 5, '2026-10-02 16:30:00', 'CONFIRMED');

-- -----------------------------------------------------------------------------
-- Seed Attendances
-- -----------------------------------------------------------------------------
INSERT INTO attendances (id, registration_id, event_id, attendance_status, marked_by, marked_at) VALUES
(1, 1, 1, 'NOT_MARKED', NULL, NULL),
(2, 2, 1, 'NOT_MARKED', NULL, NULL),
(3, 3, 1, 'NOT_MARKED', NULL, NULL),
(4, 4, 2, 'NOT_MARKED', NULL, NULL),
(5, 5, 2, 'NOT_MARKED', NULL, NULL),
(6, 6, 5, 'PRESENT', 2, '2026-10-10 09:45:00'),
(7, 7, 5, 'PRESENT', 2, '2026-10-10 09:50:00'),
(8, 8, 5, 'ABSENT', 2, '2026-10-10 10:00:00');
