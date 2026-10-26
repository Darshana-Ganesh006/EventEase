# Deployment & Local Reproducibility Guide

**Project:** EventEase — Department Seminar and Workshop Management System  
**Institution:** SRM Institute of Science and Technology, Tiruchirappalli Campus  
**Course:** 21CSE354T — Full Stack Web Development  

---

## 1. System Requirements & Prerequisites

Ensure the following runtimes are installed on the local system:

* **Java Development Kit (JDK):** Version 21 LTS (`java -version`).
* **Node.js & npm:** Node.js v18.x, v20.x, or v24.x (`node -v` & `npm -v`).
* **Database:** MySQL Server 8.x (`mysql -u root -p`).
* **Build Tool:** Apache Maven 3.x (Maven Wrapper `mvnw.cmd` included in repository).

---

## 2. Port Allocation Reference

| Service | Port | Base URL | Health Check / Entrypoint |
| :--- | :--- | :--- | :--- |
| **React Frontend (Vite)** | `5173` | `http://localhost:5173` | Browser Landing Page |
| **Spring Boot Core Backend** | `8080` | `http://localhost:8080/api` | REST API |
| **Notification Microservice**| `8082` | `http://localhost:8082/api` | `GET /api/notifications/health` |
| **MySQL Relational Database**| `3306` | `localhost:3306` | Database: `eventease_db` |

---

## 3. Step-by-Step Local Startup Order

To start the full stack application smoothly, launch components in the following chronological sequence:

### Step 1: MySQL Database Initialization
1. Start your local MySQL Server daemon.
2. Log in using MySQL CLI or MySQL Workbench:
   ```bash
   mysql -u root -p
   ```
3. Load the schema script to create `eventease_db` and tables:
   ```sql
   source /path/to/EventEase/database/schema.sql;
   ```
4. Seed the demonstration dataset:
   ```sql
   source /path/to/EventEase/database/seed.sql;
   ```
> **Warning / Best Practice:** `schema.sql` contains `DROP DATABASE IF EXISTS eventease_db;` for development reset convenience. If you wish to retain existing data, omit the drop command.

*(Note: If running in standalone demonstration mode without a live MySQL instance, the backend's embedded memory configuration automatically initializes seed accounts and events upon boot).*

---

### Step 2: Launch the Notification Microservice (Port 8082)
Open a terminal in `EventEase/notification-service`:
```powershell
.\mvnw.cmd spring-boot:run
```
*Verify it is running by checking the health endpoint in your browser:*  
`http://localhost:8082/api/notifications/health`

---

### Step 3: Launch the Core Spring Boot Backend (Port 8080)
Open a new terminal in `EventEase/backend`:
```powershell
.\mvnw.cmd spring-boot:run
```
*Expected log output:*
```text
Started EventEaseBackendApplication in X.XX seconds (process running for X.XX)
```

---

### Step 4: Launch the React Frontend (Port 5173)
Open a new terminal in `EventEase/frontend`:
```powershell
npm run dev
```
Open your browser and navigate to:  
👉 **`http://localhost:5173`**

---

## 4. Production Deployment & JAR Packaging

### Building Standalone JAR Artifacts
Both backend services can be compiled into production fat JARs:

```powershell
# 1. Build Notification Service
cd notification-service
.\mvnw.cmd clean package -DskipTests

# 2. Build Core Backend
cd ../backend
.\mvnw.cmd clean package -DskipTests

# 3. Build React Production Bundle
cd ../frontend
npm run build
```

### Running Packaged Artifacts:
```powershell
# Run Notification Service
java -jar notification-service/target/notification-service-1.0.0.jar

# Run Core Backend
java -jar backend/target/backend-1.0.0.jar

# Preview Production Frontend
cd frontend
npm run preview
```

---

## 5. Pre-Configured Demonstration Accounts

All pre-seeded demo accounts share the password: `password123`

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **ADMIN** | Dr. Rajesh Sundaram | `admin@eventease.srmist.edu.in` | `password123` |
| **ORGANISER** | Prof. Ananya Sharma | `ananya.cse@eventease.srmist.edu.in` | `password123` |
| **ORGANISER** | Dr. Karthik Raman | `karthik.ai@eventease.srmist.edu.in` | `password123` |
| **STUDENT** | Aarav Patel | `aarav.student@eventease.srmist.edu.in` | `password123` |
| **STUDENT** | Diya Sen | `diya.student@eventease.srmist.edu.in` | `password123` |
| **STUDENT** | Rohan Verma | `rohan.student@eventease.srmist.edu.in` | `password123` |
| **STUDENT** | Sneha Krishnan | `sneha.student@eventease.srmist.edu.in` | `password123` |
