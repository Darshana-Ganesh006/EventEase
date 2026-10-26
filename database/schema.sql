-- =============================================================================
-- EventEase: Department Seminar and Workshop Management System
-- Database Schema (MySQL 8.x)
-- Course: 21CSE354T - Full Stack Web Development
-- Institution: SRM Institute of Science and Technology, Tiruchirappalli Campus
-- Department: Computer Science and Engineering
-- =============================================================================

-- =============================================================================
-- CAUTION / NOTE FOR EVALUATORS:
-- This script contains 'DROP DATABASE IF EXISTS eventease_db' for a clean
-- initial setup or reset during local development and grading demonstrations.
-- For production environments, omit the DROP statement to preserve data.
-- =============================================================================

DROP DATABASE IF EXISTS eventease_db;
CREATE DATABASE eventease_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eventease_db;

-- -----------------------------------------------------------------------------
-- Table: users
-- Roles: 'ADMIN', 'ORGANISER', 'STUDENT'
-- Passwords stored as BCrypt hashes ($2a$10$...)
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_role CHECK (role IN ('ADMIN', 'ORGANISER', 'STUDENT'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- -----------------------------------------------------------------------------
-- Table: events
-- Categories: 'Seminar', 'Workshop'
-- Status: 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'
-- -----------------------------------------------------------------------------
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    venue VARCHAR(150) NOT NULL,
    capacity INT NOT NULL,
    registration_deadline DATE NOT NULL,
    poster_url VARCHAR(500) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'UPCOMING',
    organizer_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_organizer FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_event_category CHECK (category IN ('Seminar', 'Workshop')),
    CONSTRAINT chk_event_status CHECK (status IN ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED')),
    CONSTRAINT chk_event_capacity CHECK (capacity > 0),
    CONSTRAINT chk_event_time CHECK (end_time > start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_organizer ON events(organizer_id);

-- -----------------------------------------------------------------------------
-- Table: registrations
-- Status: 'CONFIRMED', 'CANCELLED'
-- -----------------------------------------------------------------------------
CREATE TABLE registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_registration_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_registration_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT chk_registration_status CHECK (status IN ('CONFIRMED', 'CANCELLED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_reg_student ON registrations(student_id);
CREATE INDEX idx_reg_event ON registrations(event_id);
CREATE INDEX idx_reg_status ON registrations(status);

-- -----------------------------------------------------------------------------
-- Table: attendances
-- Status: 'NOT_MARKED', 'PRESENT', 'ABSENT'
-- -----------------------------------------------------------------------------
CREATE TABLE attendances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    registration_id BIGINT NOT NULL UNIQUE,
    event_id BIGINT NOT NULL,
    attendance_status VARCHAR(20) NOT NULL DEFAULT 'NOT_MARKED',
    marked_by BIGINT NULL,
    marked_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_registration FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_marked_by FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_attendance_status CHECK (attendance_status IN ('NOT_MARKED', 'PRESENT', 'ABSENT'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_attendance_event ON attendances(event_id);
CREATE INDEX idx_attendance_status ON attendances(attendance_status);
