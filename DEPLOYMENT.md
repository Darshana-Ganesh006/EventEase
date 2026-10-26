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

---

## 6. Frontend Deployment to GitHub Pages

GitHub Pages serves static HTML, CSS, and client-side JavaScript. It cannot run the Java Spring Boot backend, Notification microservice, or MySQL database.

### Automated Deployment via GitHub Actions
The repository includes a pre-configured workflow at `.github/workflows/deploy.yml`.

1. **Enable GitHub Actions Pages in Repository Settings:**
   - In GitHub, go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions** (do NOT select "Deploy from a branch").
2. **Push to Main / Master Branch:**
   ```bash
   git add .
   git commit -m "Deploy EventEase frontend to GitHub Pages"
   git push origin master # (or main)
   ```
3. **Automated Pipeline Actions:**
   - Detects the push and triggers `.github/workflows/deploy.yml`.
   - Checks out the code and sets up Node.js 20.
   - Sets `VITE_BASE_PATH: /EventEase/`.
   - Runs `npm run build` inside `./frontend`.
   - Generates client-side routing fallback (`404.html`) to prevent white screens on deep link reloads.
   - Publishes the `frontend/dist` bundle to:  
     `https://darshana-ganesh006.github.io/EventEase/`

---

## 7. Online Full-Stack Deployment: Cloud Backend & MySQL

To allow online users to log in, register, and manage live database records over the public internet, deploy the backend and database separately to a cloud provider.

### Step 1: Deploy MySQL Database (e.g., Aiven, Railway, or Render)
1. Create a MySQL 8.x database instance on a cloud provider (e.g., [Aiven](https://aiven.io), [Railway](https://railway.app), or [Render](https://render.com)).
2. Note your connection details:
   - Host (`DB_HOST`)
   - Port (`DB_PORT`, default: 3306)
   - Database name (`DB_NAME`, e.g., `eventease_db`)
   - Username (`DB_USERNAME`)
   - Password (`DB_PASSWORD`)
3. Connect via MySQL Workbench or command line and execute:
   - `database/schema.sql` (to create tables, constraints, and indexes)
   - `database/seed.sql` (to seed demonstration faculty, students, and events)

### Step 2: Deploy Spring Boot Backend (e.g., Render, Railway, or Fly.io)
1. Create a Web Service pointing to the `backend/` directory of your repository.
2. Build command:
   ```bash
   ./mvnw clean package -DskipTests
   ```
3. Start command:
   ```bash
   java -jar target/backend-1.0.0.jar
   ```
4. Set the following Environment Variables in the cloud provider's dashboard:
   - `SPRING_PROFILES_ACTIVE`: `mysql`
   - `DB_HOST`: `<your-cloud-mysql-host>`
   - `DB_PORT`: `3306`
   - `DB_NAME`: `eventease_db`
   - `DB_USERNAME`: `<your-cloud-mysql-username>`
   - `DB_PASSWORD`: `<your-cloud-mysql-password>`
   - `JWT_SECRET`: `<your-secure-256-bit-hex-secret>`
   - `CORS_ALLOWED_ORIGINS`: `https://darshana-ganesh006.github.io,http://localhost:5173`
5. Note your public backend URL once deployed (e.g., `https://eventease-api.onrender.com/api`).

### Step 3: Connect GitHub Pages Frontend to Cloud Backend
1. In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret**.
3. Name: `VITE_API_BASE_URL`
4. Value: `https://eventease-api.onrender.com/api` (replace with your actual backend URL).
5. Re-run the deployment workflow in the **Actions** tab. The frontend will now communicate directly with your live cloud backend and database!
