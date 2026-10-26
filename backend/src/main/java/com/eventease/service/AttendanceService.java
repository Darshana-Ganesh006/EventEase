package com.eventease.service;

import com.eventease.dto.request.AttendanceUpdateRequest;
import com.eventease.dto.response.AttendanceResponse;
import com.eventease.entity.*;
import com.eventease.exception.BadRequestException;
import com.eventease.exception.ResourceNotFoundException;
import com.eventease.exception.UnauthorizedException;
import com.eventease.repository.AttendanceRepository;
import com.eventease.repository.EventRepository;
import com.eventease.repository.RegistrationRepository;
import com.eventease.repository.UserRepository;
import com.eventease.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             RegistrationRepository registrationRepository,
                             EventRepository eventRepository,
                             UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getEventAttendance(Long eventId, UserPrincipal currentUser) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        boolean isOrganizer = event.getOrganizer().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        if (!isOrganizer && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to view attendance records for this event");
        }

        List<Attendance> attendances = attendanceRepository.findByEventId(eventId);
        return attendances.stream()
                .map(this::mapToAttendanceResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AttendanceResponse updateAttendance(Long registrationId, AttendanceUpdateRequest request, UserPrincipal currentUser) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + registrationId));

        Event event = registration.getEvent();
        boolean isOrganizer = event.getOrganizer().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        if (!isOrganizer && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to mark attendance for this event");
        }

        AttendanceStatus status;
        try {
            status = AttendanceStatus.valueOf(request.getStatus().trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid attendance status: " + request.getStatus());
        }

        Attendance attendance = attendanceRepository.findByRegistrationId(registrationId)
                .orElseGet(() -> {
                    Attendance newAtt = new Attendance(registration, event);
                    return attendanceRepository.save(newAtt);
                });

        User marker = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        attendance.setAttendanceStatus(status);
        attendance.setMarkedBy(marker);
        attendance.setMarkedAt(LocalDateTime.now());

        Attendance saved = attendanceRepository.save(attendance);
        return mapToAttendanceResponse(saved);
    }

    public AttendanceResponse mapToAttendanceResponse(Attendance att) {
        AttendanceResponse dto = new AttendanceResponse();
        dto.setId(att.getId());
        dto.setAttendanceStatus(att.getAttendanceStatus().name());
        dto.setMarkedAt(att.getMarkedAt());

        if (att.getMarkedBy() != null) {
            dto.setMarkedById(att.getMarkedBy().getId());
            dto.setMarkedByName(att.getMarkedBy().getFullName());
        }

        if (att.getRegistration() != null) {
            dto.setRegistrationId(att.getRegistration().getId());
            if (att.getRegistration().getStudent() != null) {
                User s = att.getRegistration().getStudent();
                dto.setStudentId(s.getId());
                dto.setStudentName(s.getFullName());
                dto.setStudentEmail(s.getEmail());
                dto.setStudentDepartment(s.getDepartment());
            }
        }

        if (att.getEvent() != null) {
            dto.setEventId(att.getEvent().getId());
            dto.setEventTitle(att.getEvent().getTitle());
            dto.setEventDate(att.getEvent().getEventDate());
        }

        return dto;
    }
}
