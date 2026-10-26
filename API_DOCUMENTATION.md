# EventEase REST API Documentation

**Base URL:** `http://localhost:8080/api`  
**Notification Service URL:** `http://localhost:8082/api`  
**Authentication Scheme:** `Authorization: Bearer <jwt_token>`  

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register Student Account
* **Endpoint:** `POST /api/auth/register`
* **Access:** Public
* **Description:** Creates a verified student account. Public self-registration is strictly restricted to `STUDENT` role.
* **Request Body:**
```json
{
  "fullName": "Aarav Patel",
  "email": "aarav.student@eventease.srmist.edu.in",
  "department": "Computer Science and Engineering",
  "password": "password123"
}
```
* **Response:** `201 Created`
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "type": "Bearer",
    "user": {
      "id": 4,
      "fullName": "Aarav Patel",
      "email": "aarav.student@eventease.srmist.edu.in",
      "department": "Computer Science and Engineering",
      "role": "STUDENT",
      "active": true
    }
  }
}
```

---

### 1.2 User Login
* **Endpoint:** `POST /api/auth/login`
* **Access:** Public
* **Request Body:**
```json
{
  "email": "admin@eventease.srmist.edu.in",
  "password": "password123"
}
```
* **Response:** `200 OK` (Returns JWT token and user profile)

---

### 1.3 Get Current User Profile
* **Endpoint:** `GET /api/auth/me`
* **Access:** Authenticated (Any role)
* **Response:** `200 OK`

---

## 2. Event Management Endpoints (`/api/events`)

### 2.1 List All Events
* **Endpoint:** `GET /api/events`
* **Access:** Public
* **Query Parameters:**
  * `search` (optional): Pattern match on title, description, or venue.
  * `category` (optional): `Seminar` | `Workshop` | `ALL`.
  * `status` (optional): `UPCOMING` | `ONGOING` | `COMPLETED` | `CANCELLED` | `ALL`.
* **Response:** `200 OK` (List of `EventResponse` with calculated available seats)

---

### 2.2 Get Event Details by ID
* **Endpoint:** `GET /api/events/{id}`
* **Access:** Public (Returns `isUserRegistered` flag if Bearer token present)
* **Response:** `200 OK`

---

### 2.3 Create Event
* **Endpoint:** `POST /api/events`
* **Access:** `ORGANISER`, `ADMIN`
* **Request Body:**
```json
{
  "title": "Quantum Computing Fundamentals",
  "description": "Comprehensive workshop on quantum circuits and Qiskit.",
  "category": "Workshop",
  "eventDate": "2026-11-25",
  "startTime": "09:30:00",
  "endTime": "16:30:00",
  "venue": "CSE Computing Center Hall 2",
  "capacity": 50,
  "registrationDeadline": "2026-11-23",
  "posterUrl": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb"
}
```
* **Response:** `201 Created`

---

### 2.4 Update Event
* **Endpoint:** `PUT /api/events/{id}`
* **Access:** Event Owner (`ORGANISER`) or `ADMIN`
* **Response:** `200 OK`

---

### 2.5 Update Event Status
* **Endpoint:** `PATCH /api/events/{id}/status`
* **Access:** Event Owner (`ORGANISER`) or `ADMIN`
* **Request Body:** `{"status": "COMPLETED"}`
* **Response:** `200 OK`

---

### 2.6 Cancel Event
* **Endpoint:** `DELETE /api/events/{id}`
* **Access:** Event Owner (`ORGANISER`) or `ADMIN`
* **Response:** `200 OK` (Sets status to `CANCELLED`)

---

## 3. Registration Endpoints (`/api`)

### 3.1 Register for Event
* **Endpoint:** `POST /api/events/{eventId}/registrations`
* **Access:** `STUDENT`
* **Description:** Verifies seat capacity, deadline, event status, and duplicate registration. Triggers asynchronous notification service.
* **Response:** `201 Created`
```json
{
  "success": true,
  "message": "Successfully registered for event",
  "data": {
    "id": 9,
    "studentId": 4,
    "studentName": "Aarav Patel",
    "eventId": 1,
    "eventTitle": "Architecting Cloud-Native Microservices",
    "status": "CONFIRMED",
    "attendanceStatus": "NOT_MARKED"
  }
}
```

---

### 3.2 View My Registrations
* **Endpoint:** `GET /api/registrations/me`
* **Access:** `STUDENT`
* **Response:** `200 OK` (List of student's registrations and linked attendance)

---

### 3.3 Cancel Registration
* **Endpoint:** `PATCH /api/registrations/{registrationId}/cancel`
* **Access:** Student owner, Event Organizer, or `ADMIN`
* **Response:** `200 OK`

---

## 4. Attendance Endpoints (`/api`)

### 4.1 View Event Attendance Roster
* **Endpoint:** `GET /api/events/{eventId}/attendance`
* **Access:** Event Organizer or `ADMIN`
* **Response:** `200 OK` (List of participant records with status: `PRESENT`, `ABSENT`, `NOT_MARKED`)

---

### 4.2 Mark / Update Attendance
* **Endpoint:** `PATCH /api/registrations/{registrationId}/attendance`
* **Access:** Event Organizer or `ADMIN`
* **Request Body:**
```json
{
  "status": "PRESENT"
}
```
* **Response:** `200 OK`

---

## 5. Dashboard Endpoints (`/api/dashboard`)

* `GET /api/dashboard/student` — (Role: `STUDENT`)
* `GET /api/dashboard/organizer` — (Role: `ORGANISER`, `ADMIN`)
* `GET /api/dashboard/admin` — (Role: `ADMIN`)

---

## 6. Reports Endpoints (`/api/reports`)

* `GET /api/reports/overview` — (Public / Authenticated: Returns summary distributions and event breakdown)
* `GET /api/reports/events` — (Role: `ORGANISER`, `ADMIN`)

---

## 7. Administration Endpoints (`/api/admin`)

* `GET /api/admin/users?search=&role=` — (Role: `ADMIN`)
* `PATCH /api/admin/users/{id}/role` — (Role: `ADMIN`, Body: `{"role": "ORGANISER"}`)
* `PATCH /api/admin/users/{id}/status` — (Role: `ADMIN`, Body: `{"active": false}`)

---

## 8. Notification Microservice (`http://localhost:8082/api/notifications`)

* `GET /api/notifications/health` — Health check endpoint (`status: UP`).
* `POST /api/notifications/registration-confirmation` — Simulates registration confirmation delivery.
