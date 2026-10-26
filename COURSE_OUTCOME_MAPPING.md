# Course Outcome Mapping (21CSE354T — Full Stack Web Development)

**Project Title:** EventEase — Department Seminar and Workshop Management System  
**Institution:** SRM Institute of Science and Technology, Tiruchirappalli Campus  
**Department:** Computer Science and Engineering  
**Academic Year:** 2026–2027  

---

## Executive Summary

This document provides a verified, concrete mapping between the syllabus course outcomes of **21CSE354T (Full Stack Web Development)** and the actual source code, design systems, architectural patterns, and tests implemented in **EventEase**.

---

## Detailed Outcome Mapping Matrix

| Course Outcome | Primary Focus Area | Implemented Artifacts & Source Evidence |
| :--- | :--- | :--- |
| **CO-1** | Semantic HTML5, Vanilla CSS3, Responsive Design & Design Systems | `frontend/index.html`, `frontend/src/index.css`, `frontend/src/components/Navbar.jsx`, `frontend/src/components/Footer.jsx` |
| **CO-2** | Modern React.js (ES6+), State, Context API, React Router & REST Integration | `frontend/src/context/AuthContext.jsx`, `frontend/src/context/ThemeContext.jsx`, `frontend/src/services/api.js`, All 14 React Pages |
| **CO-3** | Relational Database Modeling, Constraints, Indexes & SQL Queries | `database/schema.sql`, `database/seed.sql`, `docs/SQL_CONCEPTS.md` |
| **CO-4** | Spring Boot 3 Layered REST Architecture, Bean Validation & Automated Testing | `backend/src/main/java/com/eventease/controller/*`, `service/*`, `exception/*`, `backend/src/test/*` |
| **CO-5** | JPA Entity Relational Mappings, Spring Data Repositories & Microservice Integration | `backend/src/main/java/com/eventease/entity/*`, `repository/*`, `client/NotificationClient.java`, `notification-service/` |

---

## Detailed Evidence by Outcome

### CO-1: HTML5 and CSS3 Layouts, Theming, and Responsive Interfaces
**Requirement:** Demonstrate proficiency in semantic HTML structure, CSS custom properties (design tokens), modern Flexbox/Grid layouts, and responsive typography.

* **Semantic HTML Structure**:
  * Root HTML template (`frontend/index.html`) includes metadata, search engine viewport settings, and accessible landmark elements.
  * Pages utilize semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
* **CSS Custom Properties Design System**:
  * Implemented centralized theme tokens in `frontend/src/index.css` supporting both `:root` (light) and `[data-theme="dark"]` (dark).
  * Brand gradient: `linear-gradient(135deg, #4F7CFF 0%, #8B5CF6 100%)`.
  * Deep navy palette: `#0B1020` to `#111A35`.
* **Responsive Layouts**:
  * Adaptive CSS Grid and Flexbox layouts tested across 1440px (desktop), 1024px (tablet), and 375px (mobile).
  * Responsive table containers with horizontal scroll controls (`.table-responsive`) preventing viewport breakage.

---

### CO-2: React and JavaScript Architecture, State Management, and Routing
**Requirement:** Demonstrate advanced frontend programming using React components, Context API, custom hooks, controlled forms, client-side routing, and Axios HTTP clients.

* **Component-Based Hierarchy**:
  * Reusable components: `Logo.jsx`, `ThemeToggle.jsx`, `StatCard.jsx`, `EventCard.jsx`, `ConfirmDialog.jsx`, `LoadingSpinner.jsx`, `EmptyState.jsx`.
* **State Management with Context API**:
  * `ThemeContext.jsx`: Manages dark/light toggles and persists preference in browser `localStorage`.
  * `AuthContext.jsx`: Manages authenticated student/faculty session state, JWT tokens, and role permissions.
  * `ToastContext.jsx`: Centralized notification toast queue for immediate user feedback.
* **Declarative Client-Side Routing & Guards**:
  * `frontend/src/App.jsx` configures client-side routing with `react-router-dom`.
  * `ProtectedRoute.jsx` intercepts unauthenticated visits and redirects to `/login`.
  * `RoleGuard.jsx` enforces server-aligned role restrictions (e.g. students cannot access `/admin/dashboard` or `/organizer/events/new`).
* **Axios HTTP Integration**:
  * `frontend/src/services/api.js` automatically injects `Authorization: Bearer <token>` into outgoing requests and normalizes API error payloads.

---

### CO-3: SQL, Relational Database Modeling, and Database Connectivity
**Requirement:** Design a normalized schema with primary keys, foreign keys, check constraints, indexes, aggregate queries, and transaction safety.

* **Relational Schema**:
  * Implemented in `database/schema.sql` under MySQL 8.x (`eventease_db`).
  * Enforces primary keys, non-null requirements, check constraints (`chk_event_capacity`, `chk_event_time`, `chk_user_role`), and foreign keys with cascade/restrict policies.
* **Demonstrated SQL Syntax**:
  * Comprehensive examples documented in `docs/SQL_CONCEPTS.md`, including `CREATE TABLE`, `INSERT`, `SELECT`, `JOIN`, `GROUP BY`, `COUNT`, `SUM`, `AVG`, Subqueries, and `START TRANSACTION`.
* **Consistency Seed Data**:
  * `database/seed.sql` populates verified sample accounts (admin, organizers, students), upcoming seminars, and past workshops.

---

### CO-4: Spring Boot 3 Layered Architecture, Security, Validation, and Testing
**Requirement:** Implement enterprise layered architecture (Controller, Service, Repository, DTO), Jakarta Bean Validation, centralized exception handling, Spring Security with BCrypt, and MockMvc tests.

* **Controller Layer**:
  * Clean RESTful controllers: `AuthController`, `EventController`, `RegistrationController`, `AttendanceController`, `DashboardController`, `ReportController`, `AdminController`.
* **Business Logic & Validation**:
  * Jakarta Bean Validation (`@NotNull`, `@NotBlank`, `@Size`, `@Pattern`, `@Min`) on all incoming DTOs.
  * Service layer enforces domain rules: start/end time chronology, capacity exhaustion checks, registration deadline enforcement, and duplicate booking prevention.
* **Spring Security & Password Hashing**:
  * `SecurityConfig.java`: Configures stateless JWT filter chain, CORS, and role-based path authorization (`hasRole('ADMIN')`, `hasRole('STUDENT')`, etc.).
  * Passwords hashed using `BCryptPasswordEncoder`. Plaintext credentials are never stored.
* **Centralized Exception Handling**:
  * `GlobalExceptionHandler.java` catches `MethodArgumentNotValidException`, `ResourceNotFoundException`, `ConflictException`, and `BadRequestException`, returning uniform JSON error responses without stack traces.
* **Automated JUnit 5 Tests**:
  * 10 tests executed in `backend`:
    * `EventServiceTest.java`: End time chronology and deadline validations.
    * `RegistrationServiceTest.java`: Capacity limit, duplicate prevention, deadline cutoff, cancelled event rejection, and notification trigger.
    * `AuthControllerTest.java`: MockMvc validation of login and student registration.

---

### CO-5: JPA Relational Mappings, Repositories, and Microservice Integration
**Requirement:** Implement Hibernate/JPA entity relationships, Spring Data JPA repositories, and inter-service HTTP REST communication.

* **JPA Entity Relational Mappings**:
  * `User.java`: Root identity entity.
  * `Event.java`: `@ManyToOne` relationship to organizer `User`.
  * `Registration.java`: Many-to-Many bridge linking student `User` and `Event`.
  * `Attendance.java`: `@OneToOne` association to `Registration` and `@ManyToOne` to `Event` and faculty `User`.
* **Spring Data Repositories**:
  * `UserRepository`, `EventRepository`, `RegistrationRepository`, `AttendanceRepository` providing derived queries and custom JPQL searches (`@Query`).
* **Separate Microservice Integration**:
  * Dedicated Spring Boot service in `notification-service/` running on port 8082.
  * Exposes `POST /api/notifications/registration-confirmation` with its own health check.
  * Invoked by main backend via `NotificationClient.java` (using `RestTemplate`).
  * Implements fault-tolerant fallback: if notification service is offline, valid registrations are safely retained.
