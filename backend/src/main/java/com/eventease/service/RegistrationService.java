package com.eventease.service;

import com.eventease.client.NotificationClient;
import com.eventease.client.NotificationRequest;
import com.eventease.dto.response.RegistrationResponse;
import com.eventease.entity.*;
import com.eventease.exception.BadRequestException;
import com.eventease.exception.ConflictException;
import com.eventease.exception.ResourceNotFoundException;
import com.eventease.exception.UnauthorizedException;
import com.eventease.repository.AttendanceRepository;
import com.eventease.repository.EventRepository;
import com.eventease.repository.RegistrationRepository;
import com.eventease.repository.UserRepository;
import com.eventease.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final NotificationClient notificationClient;

    public RegistrationService(RegistrationRepository registrationRepository,
                               EventRepository eventRepository,
                               UserRepository userRepository,
                               AttendanceRepository attendanceRepository,
                               NotificationClient notificationClient) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.attendanceRepository = attendanceRepository;
        this.notificationClient = notificationClient;
    }

    @Transactional
    public RegistrationResponse registerForEvent(Long eventId, UserPrincipal currentUser) {
        if (currentUser.getRole() != Role.STUDENT) {
            throw new UnauthorizedException("Only students can register for events");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new BadRequestException("Cannot register for a cancelled event");
        }
        if (event.getStatus() == EventStatus.COMPLETED) {
            throw new BadRequestException("Cannot register for an event that has already concluded");
        }

        LocalDate today = LocalDate.now();
        if (event.getRegistrationDeadline().isBefore(today)) {
            throw new BadRequestException("Registration has closed for this event. Deadline was " + event.getRegistrationDeadline());
        }

        // Check duplicate active registration
        boolean alreadyRegistered = registrationRepository.existsByStudentIdAndEventIdAndStatus(
                currentUser.getId(), eventId, RegistrationStatus.CONFIRMED
        );
        if (alreadyRegistered) {
            throw new ConflictException("You are already registered for this event");
        }

        // Capacity check
        long activeCount = registrationRepository.countByEventIdAndStatus(eventId, RegistrationStatus.CONFIRMED);
        if (activeCount >= event.getCapacity()) {
            throw new BadRequestException("Event is full. All " + event.getCapacity() + " seats have been booked.");
        }

        User student = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student user record not found"));

        // If user previously cancelled, we can update or create a new registration
        Registration registration = new Registration(student, event);
        Registration savedRegistration = registrationRepository.save(registration);

        // Create linked Attendance record with default status NOT_MARKED
        Attendance attendance = new Attendance(savedRegistration, event);
        attendance.setAttendanceStatus(AttendanceStatus.NOT_MARKED);
        attendanceRepository.save(attendance);

        // Trigger Notification Service
        NotificationRequest notifRequest = new NotificationRequest(
                student.getFullName(),
                student.getEmail(),
                event.getTitle(),
                event.getCategory(),
                event.getEventDate().toString(),
                event.getStartTime().toString(),
                event.getVenue(),
                savedRegistration.getId()
        );
        notificationClient.sendRegistrationConfirmation(notifRequest);

        return mapToRegistrationResponse(savedRegistration, attendance.getAttendanceStatus().name());
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getMyRegistrations(UserPrincipal currentUser) {
        List<Registration> registrations = registrationRepository.findByStudentIdOrderByRegistrationDateDesc(currentUser.getId());
        return registrations.stream().map(reg -> {
            Optional<Attendance> att = attendanceRepository.findByRegistrationId(reg.getId());
            String attStatus = att.map(a -> a.getAttendanceStatus().name()).orElse("NOT_MARKED");
            return mapToRegistrationResponse(reg, attStatus);
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getEventRegistrations(Long eventId, UserPrincipal currentUser) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        boolean isOrganizer = event.getOrganizer().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        if (!isOrganizer && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to view participants for this event");
        }

        List<Registration> registrations = registrationRepository.findByEventIdOrderByRegistrationDateAsc(eventId);
        return registrations.stream().map(reg -> {
            Optional<Attendance> att = attendanceRepository.findByRegistrationId(reg.getId());
            String attStatus = att.map(a -> a.getAttendanceStatus().name()).orElse("NOT_MARKED");
            return mapToRegistrationResponse(reg, attStatus);
        }).collect(Collectors.toList());
    }

    @Transactional
    public RegistrationResponse cancelRegistration(Long registrationId, UserPrincipal currentUser) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + registrationId));

        boolean isOwner = registration.getStudent().getId().equals(currentUser.getId());
        boolean isOrganizer = registration.getEvent().getOrganizer().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOwner && !isOrganizer && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to cancel this registration");
        }

        if (registration.getStatus() == RegistrationStatus.CANCELLED) {
            throw new BadRequestException("Registration is already cancelled");
        }

        registration.setStatus(RegistrationStatus.CANCELLED);
        Registration saved = registrationRepository.save(registration);

        Optional<Attendance> att = attendanceRepository.findByRegistrationId(registrationId);
        String attStatus = att.map(a -> a.getAttendanceStatus().name()).orElse("NOT_MARKED");

        return mapToRegistrationResponse(saved, attStatus);
    }

    public RegistrationResponse mapToRegistrationResponse(Registration reg, String attendanceStatus) {
        RegistrationResponse dto = new RegistrationResponse();
        dto.setId(reg.getId());
        dto.setRegistrationDate(reg.getRegistrationDate());
        dto.setStatus(reg.getStatus().name());
        dto.setAttendanceStatus(attendanceStatus);

        if (reg.getStudent() != null) {
            dto.setStudentId(reg.getStudent().getId());
            dto.setStudentName(reg.getStudent().getFullName());
            dto.setStudentEmail(reg.getStudent().getEmail());
            dto.setStudentDepartment(reg.getStudent().getDepartment());
        }

        if (reg.getEvent() != null) {
            dto.setEventId(reg.getEvent().getId());
            dto.setEventTitle(reg.getEvent().getTitle());
            dto.setCategory(reg.getEvent().getCategory());
            dto.setEventDate(reg.getEvent().getEventDate());
            dto.setStartTime(reg.getEvent().getStartTime());
            dto.setEndTime(reg.getEvent().getEndTime());
            dto.setVenue(reg.getEvent().getVenue());
            dto.setEventStatus(reg.getEvent().getStatus().name());

            boolean canCancel = reg.getStatus() == RegistrationStatus.CONFIRMED &&
                    !reg.getEvent().getEventDate().isBefore(LocalDate.now());
            dto.setCanCancel(canCancel);
        }

        return dto;
    }
}
