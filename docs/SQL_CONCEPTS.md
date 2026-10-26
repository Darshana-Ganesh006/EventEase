# Relational Database Design and SQL Concepts Guide

**Project:** EventEase — Department Seminar and Workshop Management System  
**Course:** 21CSE354T — Full Stack Web Development  
**Institution:** SRM Institute of Science and Technology, Tiruchirappalli Campus  
**Department:** Computer Science and Engineering  
**Target Database:** MySQL 8.x (`eventease_db`)

---

## 1. Overview and Relational Architecture

The **EventEase** relational database models an academic seminar and workshop management platform. The schema consists of four core normalized entities:

1. **`users`**: Administrative faculty, faculty organizers, and student participants.
2. **`events`**: Academic seminars and hands-on workshops authored by faculty organizers.
3. **`registrations`**: Many-to-Many bridge table between students and events with unique status tracking.
4. **`attendances`**: One-to-One attendance records linked to individual registrations, marked by authorized faculty.

The schema uses strict Foreign Key constraints (`ON DELETE CASCADE` / `ON DELETE RESTRICT`) to preserve referential integrity and audit trails.

---

## 2. Comprehensive SQL Demonstrations

All queries below directly reflect the actual `eventease_db` schema in `database/schema.sql`.

### 2.1 CREATE TABLE
Defines relational structures with column datatypes, primary keys, nullability, default values, and table-level constraints.

```sql
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
```

---

### 2.2 INSERT
Inserts structured records into tables conforming to column order and constraints.

```sql
INSERT INTO users (full_name, email, password_hash, department, role, active)
VALUES (
    'Dr. Rajesh Sundaram',
    'admin@eventease.srmist.edu.in',
    '$2a$10$wKqK.L3dZfZd8Q3oK7l5Q.e5k3mE6n4UjX7W7FvG8GvP0jE/B3a.S',
    'Computer Science and Engineering',
    'ADMIN',
    TRUE
);
```

---

### 2.3 SELECT with WHERE and ORDER BY
Retrieves future events in ascending chronological order.

```sql
-- Retrieve upcoming academic events scheduled after current date
SELECT id, title, category, event_date, start_time, venue, capacity
FROM events
WHERE status = 'UPCOMING' 
  AND event_date >= CURDATE()
ORDER BY event_date ASC, start_time ASC;
```

---

### 2.4 Searching with LIKE
Case-insensitive pattern matching across event titles and venues.

```sql
-- Search for workshops focusing on Cloud or Kubernetes
SELECT id, title, category, venue, capacity
FROM events
WHERE category = 'Workshop'
  AND (LOWER(title) LIKE '%cloud%' OR LOWER(description) LIKE '%kubernetes%')
ORDER BY event_date ASC;
```

---

### 2.5 UPDATE
Modifies existing records while maintaining business invariants.

```sql
-- Transition an event status to COMPLETED once scheduled time has elapsed
UPDATE events
SET status = 'COMPLETED', updated_at = CURRENT_TIMESTAMP
WHERE id = 5 AND status = 'UPCOMING';
```

---

### 2.6 Controlled Soft-DELETE / Cancellation
Rather than permanently removing historical audit records (`DELETE`), EventEase marks records as `CANCELLED` to retain student history.

```sql
-- Soft cancel a registration
UPDATE registrations
SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP
WHERE id = 8 AND status = 'CONFIRMED';
```

---

### 2.7 INNER JOIN and Multi-Table Relationships
Joins events with their respective faculty organizers and student participant rosters.

```sql
-- Retrieve event details along with the faculty organizer's information
SELECT 
    e.id AS event_id,
    e.title,
    e.category,
    e.event_date,
    u.full_name AS organizer_name,
    u.email AS organizer_email,
    u.department AS organizer_department
FROM events e
INNER JOIN users u ON e.organizer_id = u.id
WHERE e.status = 'UPCOMING';
```

```sql
-- List all confirmed students registered for an event
SELECT 
    r.id AS registration_id,
    s.id AS student_id,
    s.full_name AS student_name,
    s.email AS student_email,
    s.department AS student_department,
    r.registration_date,
    a.attendance_status
FROM registrations r
INNER JOIN users s ON r.student_id = s.id
INNER JOIN attendances a ON a.registration_id = r.id
WHERE r.event_id = 1 AND r.status = 'CONFIRMED'
ORDER BY r.registration_date ASC;
```

---

### 2.8 GROUP BY and Aggregate Functions (COUNT, SUM, AVG)
Computes summary metrics per event and per department.

```sql
-- Count total active registrations and available capacity per event
SELECT 
    e.id AS event_id,
    e.title,
    e.capacity,
    COUNT(r.id) AS confirmed_registrations,
    (e.capacity - COUNT(r.id)) AS available_seats
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id AND r.status = 'CONFIRMED'
GROUP BY e.id, e.title, e.capacity;
```

```sql
-- Calculate attendance rate percentage for completed sessions
SELECT 
    e.id AS event_id,
    e.title,
    COUNT(r.id) AS total_registered,
    SUM(CASE WHEN a.attendance_status = 'PRESENT' THEN 1 ELSE 0 END) AS total_present,
    ROUND(
        (SUM(CASE WHEN a.attendance_status = 'PRESENT' THEN 1 ELSE 0 END) / COUNT(r.id)) * 100, 
        1
    ) AS attendance_percentage
FROM events e
INNER JOIN registrations r ON e.id = r.event_id AND r.status = 'CONFIRMED'
INNER JOIN attendances a ON a.registration_id = r.id
WHERE e.status = 'COMPLETED'
GROUP BY e.id, e.title;
```

---

### 2.9 Subqueries
Identifies events with no registrations, or finds students who attended multiple sessions.

```sql
-- Identify events with zero registered participants
SELECT id, title, category, event_date, venue
FROM events
WHERE id NOT IN (
    SELECT DISTINCT event_id 
    FROM registrations 
    WHERE status = 'CONFIRMED'
);
```

```sql
-- Find students who have registered for more events than the department average
SELECT student_id, full_name, COUNT(*) AS total_registrations
FROM registrations r
JOIN users u ON r.student_id = u.id
WHERE r.status = 'CONFIRMED'
GROUP BY student_id, full_name
HAVING COUNT(*) > (
    SELECT AVG(reg_count) FROM (
        SELECT COUNT(*) AS reg_count 
        FROM registrations 
        WHERE status = 'CONFIRMED' 
        GROUP BY student_id
    ) AS avg_tbl
);
```

---

### 2.10 ALTER TABLE
Demonstrating DDL alterations for maintenance.

```sql
-- Adding a verified column for post-event certificates
ALTER TABLE attendances ADD COLUMN certificate_issued BOOLEAN NOT NULL DEFAULT FALSE;
```

---

### 2.11 Constraints and Indexes
- **Primary Key (`PRIMARY KEY`)**: Uniquely identifies each record (`id BIGINT AUTO_INCREMENT`).
- **Foreign Key (`FOREIGN KEY`)**: Enforces relational consistency across parent and child tables.
- **Unique Constraint (`UNIQUE`)**: Guarantees no two users share the same institutional email, and prevents duplicate attendances for a single registration ID.
- **Check Constraint (`CHECK`)**: Enforces valid roles (`ADMIN`, `ORGANISER`, `STUDENT`), valid categories, positive capacities (`capacity > 0`), and valid chronologies (`end_time > start_time`).
- **Indexes (`CREATE INDEX`)**: Improves lookup performance on frequently filtered columns (`idx_events_date`, `idx_events_category`, `idx_users_email`).

```sql
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_users_email ON users(email);
```

---

### 2.12 Database Transactions (ACID Compliance)
When a student registers for an event, multiple relational tables must be modified atomically. If any operation fails, the entire transaction is rolled back.

```sql
START TRANSACTION;

-- 1. Ensure event capacity has not been exceeded
SELECT capacity FROM events WHERE id = 1 FOR UPDATE;

-- 2. Insert confirmed registration
INSERT INTO registrations (student_id, event_id, status)
VALUES (4, 1, 'CONFIRMED');

-- 3. Pre-create attendance row with status NOT_MARKED
INSERT INTO attendances (registration_id, event_id, attendance_status)
VALUES (LAST_INSERT_ID(), 1, 'NOT_MARKED');

COMMIT;
```

---

## 3. Bridge Between SQL, JDBC, and Spring Data JPA

1. **Native JDBC vs. Spring Data JPA**:
   - In traditional JDBC, developers manually write SQL strings, manage `Connection`, `PreparedStatement`, and `ResultSet` objects, and handle checked `SQLExceptions`.
   - **Spring Data JPA** abstracts JDBC by mapping Java classes (`@Entity`) directly to MySQL tables via Hibernate (ORM).
2. **Declarative Queries**:
   - Derived queries like `findByOrganizerId(Long id)` automatically generate optimized SQL `SELECT * FROM events WHERE organizer_id = ?`.
3. **JPQL (Java Persistence Query Language)**:
   - For complex searches, the application uses `@Query`:
     ```java
     @Query("SELECT e FROM Event e WHERE (:category IS NULL OR e.category = :category) ORDER BY e.eventDate ASC")
     List<Event> searchEvents(@Param("category") String category);
     ```
4. **Transaction Boundaries**:
   - Spring's `@Transactional` manages database transactions automatically, committing when the method returns or issuing a `ROLLBACK` if a `RuntimeException` occurs.
