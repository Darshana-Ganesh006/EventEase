package com.eventease.config;

import com.eventease.entity.*;
import com.eventease.repository.AttendanceRepository;
import com.eventease.repository.EventRepository;
import com.eventease.repository.RegistrationRepository;
import com.eventease.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final AttendanceRepository attendanceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           EventRepository eventRepository,
                           RegistrationRepository registrationRepository,
                           AttendanceRepository attendanceRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.attendanceRepository = attendanceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains users. Skipping initial seed.");
            return;
        }

        log.info("Database is empty. Seeding initial demonstration data...");

        String encodedPassword = passwordEncoder.encode("password123");

        // 1. Seed Users
        User admin = new User("Dr. Rajesh Sundaram", "admin@eventease.srmist.edu.in",
                encodedPassword, "Computer Science and Engineering", Role.ADMIN);
        userRepository.save(admin);

        User org1 = new User("Prof. Ananya Sharma", "ananya.cse@eventease.srmist.edu.in",
                encodedPassword, "Computer Science and Engineering", Role.ORGANISER);
        userRepository.save(org1);

        User org2 = new User("Dr. Karthik Raman", "karthik.ai@eventease.srmist.edu.in",
                encodedPassword, "Artificial Intelligence and Data Science", Role.ORGANISER);
        userRepository.save(org2);

        User s1 = new User("Aarav Patel", "aarav.student@eventease.srmist.edu.in",
                encodedPassword, "Computer Science and Engineering", Role.STUDENT);
        userRepository.save(s1);

        User s2 = new User("Diya Sen", "diya.student@eventease.srmist.edu.in",
                encodedPassword, "Information Technology", Role.STUDENT);
        userRepository.save(s2);

        User s3 = new User("Rohan Verma", "rohan.student@eventease.srmist.edu.in",
                encodedPassword, "Computer Science and Engineering", Role.STUDENT);
        userRepository.save(s3);

        User s4 = new User("Sneha Krishnan", "sneha.student@eventease.srmist.edu.in",
                encodedPassword, "Electronics and Communication", Role.STUDENT);
        userRepository.save(s4);

        // 2. Seed Events
        Event e1 = new Event();
        e1.setTitle("Architecting Cloud-Native Microservices with Spring Boot 3 & Kubernetes");
        e1.setDescription("A hands-on, high-impact technical workshop covering enterprise microservices, service mesh orchestration, reactive streams, and production deployment on cloud clusters.");
        e1.setCategory("Workshop");
        e1.setEventDate(LocalDate.now().plusDays(15));
        e1.setStartTime(LocalTime.of(9, 30));
        e1.setEndTime(LocalTime.of(16, 30));
        e1.setVenue("Tech Park Lab 402, Block B");
        e1.setCapacity(60);
        e1.setRegistrationDeadline(LocalDate.now().plusDays(12));
        e1.setPosterUrl("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80");
        e1.setStatus(EventStatus.UPCOMING);
        e1.setOrganizer(org1);
        eventRepository.save(e1);

        Event e2 = new Event();
        e2.setTitle("Frontiers in Generative AI: Large Multimodal Models and Agents");
        e2.setDescription("An intensive academic seminar exploring the theoretical underpinnings of transformer architectures, diffusion reasoning, reinforcement learning from human feedback (RLHF), and autonomous AI agent workflows.");
        e2.setCategory("Seminar");
        e2.setEventDate(LocalDate.now().plusDays(20));
        e2.setStartTime(LocalTime.of(10, 0));
        e2.setEndTime(LocalTime.of(13, 0));
        e2.setVenue("Dr. T.P. Ganesan Auditorium Hall 2");
        e2.setCapacity(120);
        e2.setRegistrationDeadline(LocalDate.now().plusDays(18));
        e2.setPosterUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80");
        e2.setStatus(EventStatus.UPCOMING);
        e2.setOrganizer(org2);
        eventRepository.save(e2);

        Event e3 = new Event();
        e3.setTitle("Full-Stack Modern Web Engineering with React 19 and Vite");
        e3.setDescription("Interactive coding masterclass focusing on component architecture, state management patterns, CSS variables design systems, API security, and performance profiling.");
        e3.setCategory("Workshop");
        e3.setEventDate(LocalDate.now().plusDays(28));
        e3.setStartTime(LocalTime.of(13, 30));
        e3.setEndTime(LocalTime.of(17, 30));
        e3.setVenue("CSE Computing Center Hall 1");
        e3.setCapacity(50);
        e3.setRegistrationDeadline(LocalDate.now().plusDays(26));
        e3.setPosterUrl("https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80");
        e3.setStatus(EventStatus.UPCOMING);
        e3.setOrganizer(org1);
        eventRepository.save(e3);

        Event e4 = new Event();
        e4.setTitle("Zero Trust Architecture and Practical Cyber Threat Defense");
        e4.setDescription("Advanced seminar covering enterprise perimeter elimination, identity verification protocols, API gateway security, OAuth2/OIDC, and threat modeling.");
        e4.setCategory("Seminar");
        e4.setEventDate(LocalDate.now().plusDays(35));
        e4.setStartTime(LocalTime.of(14, 0));
        e4.setEndTime(LocalTime.of(17, 0));
        e4.setVenue("Seminar Hall 301, Academic Block");
        e4.setCapacity(80);
        e4.setRegistrationDeadline(LocalDate.now().plusDays(33));
        e4.setPosterUrl("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80");
        e4.setStatus(EventStatus.UPCOMING);
        e4.setOrganizer(org2);
        eventRepository.save(e4);

        Event e5 = new Event();
        e5.setTitle("Introduction to Embedded Edge Computing and IoT Sensors");
        e5.setDescription("Comprehensive past workshop on microcontroller programming, real-time sensor telemetry, MQTT brokers, and lightweight inference at the edge.");
        e5.setCategory("Workshop");
        e5.setEventDate(LocalDate.now().minusDays(14));
        e5.setStartTime(LocalTime.of(9, 0));
        e5.setEndTime(LocalTime.of(16, 0));
        e5.setVenue("IoT Innovation Lab 105");
        e5.setCapacity(40);
        e5.setRegistrationDeadline(LocalDate.now().minusDays(16));
        e5.setPosterUrl("https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80");
        e5.setStatus(EventStatus.COMPLETED);
        e5.setOrganizer(org1);
        eventRepository.save(e5);

        // 3. Seed Registrations & Attendances
        createRegistrationAndAttendance(s1, e1, AttendanceStatus.NOT_MARKED, null);
        createRegistrationAndAttendance(s2, e1, AttendanceStatus.NOT_MARKED, null);
        createRegistrationAndAttendance(s3, e1, AttendanceStatus.NOT_MARKED, null);

        createRegistrationAndAttendance(s1, e2, AttendanceStatus.NOT_MARKED, null);
        createRegistrationAndAttendance(s4, e2, AttendanceStatus.NOT_MARKED, null);

        // For completed event e5
        createRegistrationAndAttendance(s1, e5, AttendanceStatus.PRESENT, org1);
        createRegistrationAndAttendance(s2, e5, AttendanceStatus.PRESENT, org1);
        createRegistrationAndAttendance(s3, e5, AttendanceStatus.ABSENT, org1);

        log.info("Demonstration seed data successfully inserted.");
    }

    private void createRegistrationAndAttendance(User student, Event event, AttendanceStatus attendanceStatus, User markedBy) {
        Registration reg = new Registration(student, event);
        registrationRepository.save(reg);

        Attendance att = new Attendance(reg, event);
        att.setAttendanceStatus(attendanceStatus);
        if (markedBy != null) {
            att.setMarkedBy(markedBy);
            att.setMarkedAt(LocalDateTime.now().minusDays(14));
        }
        attendanceRepository.save(att);
    }
}
