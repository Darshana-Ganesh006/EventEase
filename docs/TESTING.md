# EventEase Quality Assurance & Testing Suite

**Course:** 21CSE354T — Full Stack Web Development  
**Institution:** SRM Institute of Science and Technology, Tiruchirappalli Campus  

---

## 1. Testing Strategy & Frameworks

EventEase adopts a comprehensive multi-tier testing methodology:
1. **Unit Testing:** Mockito mocks dependencies (`@Mock`, `@InjectMocks`) to test domain business logic in pure isolation.
2. **Integration Testing:** `@SpringBootTest` with `@AutoConfigureMockMvc` verifies complete REST controller dispatch, serialization, and Spring Security filters using an isolated in-memory H2 database (`MODE=MySQL`).
3. **Microservice Contract Testing:** MockMvc tests verify simulated notification acceptance on `notification-service`.
4. **Frontend Production Build Verification:** Vite bundle compilation and JSX static analysis.

---

## 2. Requirement Verification Matrix

| # | Test Requirement | Test Class & Method | Result |
| :--- | :--- | :--- | :--- |
| **1** | Invalid event time (End time before start time) | `EventServiceTest#shouldRejectEventWhenEndTimeIsBeforeStartTime` | **PASSED** |
| **2** | Invalid deadline (Deadline after event date) | `EventServiceTest#shouldRejectEventWhenDeadlineIsAfterEventDate` | **PASSED** |
| **3** | Non-student registration rejection | `RegistrationServiceTest#shouldRejectWhenUserIsNotStudent` | **PASSED** |
| **4** | Duplicate registration prevention | `RegistrationServiceTest#shouldRejectDuplicateRegistration` | **PASSED** |
| **5** | Capacity exhaustion safeguard | `RegistrationServiceTest#shouldRejectWhenEventIsFull` | **PASSED** |
| **6** | Past deadline rejection | `RegistrationServiceTest#shouldRejectWhenDeadlineHasPassed` | **PASSED** |
| **7** | Cancelled event enrollment rejection | `RegistrationServiceTest#shouldRejectWhenEventIsCancelled` | **PASSED** |
| **8** | Registration & Notification Microservice Integration | `RegistrationServiceTest#shouldRegisterSuccessfullyAndTriggerNotification` | **PASSED** |
| **9** | BCrypt hash verification for seed demo accounts | `AuthControllerTest#shouldMatchSeedPasswordHash` | **PASSED** |
| **10** | Student Registration REST endpoint (`POST /api/auth/register`) | `AuthControllerTest#shouldRegisterStudentSuccessfully` | **PASSED** |
| **11** | Student Login REST endpoint (`POST /api/auth/login`) | `AuthControllerTest#shouldLoginSuccessfully` | **PASSED** |
| **12** | Notification Service Health Check (`GET /api/notifications/health`) | `NotificationControllerTest#shouldReturnHealthStatusUp` | **PASSED** |
| **13** | Notification Delivery Acknowledgment (`POST /api/notifications/...`) | `NotificationControllerTest#shouldAcknowledgeRegistrationNotification` | **PASSED** |
| **14** | Frontend Production Build (`vite build`) | Vite Production Bundler | **PASSED (0 Errors)** |

---

## 3. How to Run the Tests

### 3.1 Backend Test Suite (11 Tests)
From the `backend/` directory:
```powershell
.\mvnw.cmd test
```
*Expected Output:*
```text
[INFO] Running com.eventease.controller.AuthControllerTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.eventease.service.EventServiceTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.eventease.service.RegistrationServiceTest
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] Results:
[INFO] Tests run: 11, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

### 3.2 Notification Service Test Suite (2 Tests)
From the `notification-service/` directory:
```powershell
.\mvnw.cmd test
```
*Expected Output:*
```text
[INFO] Running com.eventease.notification.controller.NotificationControllerTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

### 3.3 Frontend Build Verification
From the `frontend/` directory:
```powershell
npm run build
```
*Expected Output:*
```text
✓ 2607 modules transformed.
✓ built in 1.34s
```
