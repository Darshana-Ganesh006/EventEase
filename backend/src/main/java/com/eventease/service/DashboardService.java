package com.eventease.service;

import com.eventease.dto.response.*;
import com.eventease.entity.*;
import com.eventease.exception.ResourceNotFoundException;
import com.eventease.repository.AttendanceRepository;
import com.eventease.repository.EventRepository;
import com.eventease.repository.RegistrationRepository;
import com.eventease.repository.UserRepository;
import com.eventease.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final AttendanceRepository attendanceRepository;
    private final EventService eventService;
    private final RegistrationService registrationService;

    public DashboardService(UserRepository userRepository,
                            EventRepository eventRepository,
                            RegistrationRepository registrationRepository,
                            AttendanceRepository attendanceRepository,
                            EventService eventService,
                            RegistrationService registrationService) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.attendanceRepository = attendanceRepository;
        this.eventService = eventService;
        this.registrationService = registrationService;
    }

    @Transactional(readOnly = true)
    public StudentDashboardResponse getStudentDashboard(UserPrincipal currentUser) {
        User student = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student user not found"));

        List<RegistrationResponse> allMyRegistrations = registrationService.getMyRegistrations(currentUser);

        long totalRegistrations = allMyRegistrations.stream()
                .filter(r -> "CONFIRMED".equals(r.getStatus()))
                .count();

        LocalDate today = LocalDate.now();
        List<RegistrationResponse> upcoming = allMyRegistrations.stream()
                .filter(r -> "CONFIRMED".equals(r.getStatus()) && !r.getEventDate().isBefore(today))
                .collect(Collectors.toList());

        long attendedCount = allMyRegistrations.stream()
                .filter(r -> "PRESENT".equalsIgnoreCase(r.getAttendanceStatus()))
                .count();

        StudentDashboardResponse response = new StudentDashboardResponse();
        response.setStudentName(student.getFullName());
        response.setDepartment(student.getDepartment());
        response.setTotalRegistrations(totalRegistrations);
        response.setUpcomingEventsCount(upcoming.size());
        response.setAttendedEventsCount(attendedCount);
        response.setUpcomingRegistrations(upcoming.stream().limit(5).collect(Collectors.toList()));
        response.setRecentRegistrations(allMyRegistrations.stream().limit(5).collect(Collectors.toList()));

        return response;
    }

    @Transactional(readOnly = true)
    public OrganizerDashboardResponse getOrganizerDashboard(UserPrincipal currentUser) {
        User organizer = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Organizer user not found"));

        List<Event> myEvents = eventRepository.findByOrganizerId(currentUser.getId());

        long totalEvents = myEvents.size();
        long upcoming = myEvents.stream().filter(e -> e.getStatus() == EventStatus.UPCOMING).count();
        long completed = myEvents.stream().filter(e -> e.getStatus() == EventStatus.COMPLETED).count();

        long totalRegistrations = registrationRepository.countRegistrationsByOrganizerId(currentUser.getId());
        long totalPresent = attendanceRepository.countPresentByOrganizerId(currentUser.getId());

        double attendanceRate = 0.0;
        if (totalRegistrations > 0) {
            attendanceRate = Math.round(((double) totalPresent / totalRegistrations) * 1000.0) / 10.0;
        }

        List<EventResponse> eventResponses = myEvents.stream()
                .map(e -> eventService.mapToEventResponse(e, currentUser.getId()))
                .collect(Collectors.toList());

        List<Registration> recentRegs = registrationRepository.findRegistrationsByOrganizerId(currentUser.getId());
        List<RegistrationResponse> recentRegResponses = recentRegs.stream()
                .limit(5)
                .map(r -> registrationService.mapToRegistrationResponse(r, "NOT_MARKED"))
                .collect(Collectors.toList());

        OrganizerDashboardResponse response = new OrganizerDashboardResponse();
        response.setOrganizerName(organizer.getFullName());
        response.setTotalEventsCreated(totalEvents);
        response.setUpcomingEventsCount(upcoming);
        response.setCompletedEventsCount(completed);
        response.setTotalRegistrationsReceived(totalRegistrations);
        response.setTotalPresentCount(totalPresent);
        response.setAttendanceRate(attendanceRate);
        response.setMyEvents(eventResponses);
        response.setRecentRegistrations(recentRegResponses);

        return response;
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        AdminDashboardResponse response = new AdminDashboardResponse();

        long totalUsers = userRepository.count();
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalOrganizers = userRepository.countByRole(Role.ORGANISER);
        long totalAdmins = userRepository.countByRole(Role.ADMIN);

        long totalEvents = eventRepository.count();
        long upcomingEvents = eventRepository.countByStatus(EventStatus.UPCOMING);
        long completedEvents = eventRepository.countByStatus(EventStatus.COMPLETED);
        long cancelledEvents = eventRepository.countByStatus(EventStatus.CANCELLED);

        long totalRegistrations = registrationRepository.countByStatus(RegistrationStatus.CONFIRMED);
        long totalAttended = attendanceRepository.countByAttendanceStatus(AttendanceStatus.PRESENT);

        double rate = 0.0;
        if (totalRegistrations > 0) {
            rate = Math.round(((double) totalAttended / totalRegistrations) * 1000.0) / 10.0;
        }

        Map<String, Long> categoryMap = new HashMap<>();
        List<Event> allEvents = eventRepository.findAll();
        for (Event e : allEvents) {
            categoryMap.put(e.getCategory(), categoryMap.getOrDefault(e.getCategory(), 0L) + 1);
        }

        List<UserResponse> recentUsers = userRepository.findAll().stream()
                .limit(10)
                .map(AuthService::mapToUserResponse)
                .collect(Collectors.toList());

        response.setTotalUsers(totalUsers);
        response.setTotalStudents(totalStudents);
        response.setTotalOrganizers(totalOrganizers);
        response.setTotalAdmins(totalAdmins);
        response.setTotalEvents(totalEvents);
        response.setUpcomingEvents(upcomingEvents);
        response.setCompletedEvents(completedEvents);
        response.setCancelledEvents(cancelledEvents);
        response.setTotalRegistrations(totalRegistrations);
        response.setTotalAttended(totalAttended);
        response.setOverallAttendanceRate(rate);
        response.setEventsByCategory(categoryMap);
        response.setRecentUsers(recentUsers);

        return response;
    }
}
