package com.eventease.service;

import com.eventease.dto.request.EventCreateUpdateRequest;
import com.eventease.dto.request.EventStatusUpdateRequest;
import com.eventease.dto.response.EventResponse;
import com.eventease.entity.*;
import com.eventease.exception.BadRequestException;
import com.eventease.exception.ResourceNotFoundException;
import com.eventease.exception.UnauthorizedException;
import com.eventease.repository.EventRepository;
import com.eventease.repository.RegistrationRepository;
import com.eventease.repository.UserRepository;
import com.eventease.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository,
                        RegistrationRepository registrationRepository,
                        UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents(String search, String category, String status, Long currentUserId) {
        EventStatus eventStatus = null;
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            try {
                eventStatus = EventStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid event status filter: " + status);
            }
        }

        List<Event> events = eventRepository.searchEvents(
                search != null ? search.trim() : null,
                category != null && !category.equalsIgnoreCase("ALL") ? category.trim() : null,
                eventStatus
        );

        return events.stream()
                .map(event -> mapToEventResponse(event, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id, Long currentUserId) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return mapToEventResponse(event, currentUserId);
    }

    @Transactional
    public EventResponse createEvent(EventCreateUpdateRequest request, UserPrincipal currentUser) {
        validateEventSchedule(request.getEventDate(), request.getStartTime(), request.getEndTime(), request.getRegistrationDeadline());

        User organizer = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Organizer user not found"));

        Event event = new Event();
        event.setTitle(request.getTitle().trim());
        event.setDescription(request.getDescription().trim());
        event.setCategory(request.getCategory().trim());
        event.setEventDate(request.getEventDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setVenue(request.getVenue().trim());
        event.setCapacity(request.getCapacity());
        event.setRegistrationDeadline(request.getRegistrationDeadline());
        event.setPosterUrl(request.getPosterUrl() != null ? request.getPosterUrl().trim() : null);
        event.setStatus(EventStatus.UPCOMING);
        event.setOrganizer(organizer);

        Event savedEvent = eventRepository.save(event);
        return mapToEventResponse(savedEvent, currentUser.getId());
    }

    @Transactional
    public EventResponse updateEvent(Long id, EventCreateUpdateRequest request, UserPrincipal currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        validateOwnershipOrAdmin(event, currentUser);
        validateEventSchedule(request.getEventDate(), request.getStartTime(), request.getEndTime(), request.getRegistrationDeadline());

        long activeRegistrationsCount = registrationRepository.countByEventIdAndStatus(id, RegistrationStatus.CONFIRMED);
        if (request.getCapacity() < activeRegistrationsCount) {
            throw new BadRequestException("New capacity (" + request.getCapacity() +
                    ") cannot be less than currently confirmed registrations count (" + activeRegistrationsCount + ")");
        }

        event.setTitle(request.getTitle().trim());
        event.setDescription(request.getDescription().trim());
        event.setCategory(request.getCategory().trim());
        event.setEventDate(request.getEventDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setVenue(request.getVenue().trim());
        event.setCapacity(request.getCapacity());
        event.setRegistrationDeadline(request.getRegistrationDeadline());
        if (request.getPosterUrl() != null) {
            event.setPosterUrl(request.getPosterUrl().trim());
        }

        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            try {
                event.setStatus(EventStatus.valueOf(request.getStatus().trim().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid event status: " + request.getStatus());
            }
        }

        Event updatedEvent = eventRepository.save(event);
        return mapToEventResponse(updatedEvent, currentUser.getId());
    }

    @Transactional
    public EventResponse updateEventStatus(Long id, EventStatusUpdateRequest request, UserPrincipal currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        validateOwnershipOrAdmin(event, currentUser);

        try {
            EventStatus newStatus = EventStatus.valueOf(request.getStatus().trim().toUpperCase());
            event.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid event status: " + request.getStatus());
        }

        Event saved = eventRepository.save(event);
        return mapToEventResponse(saved, currentUser.getId());
    }

    @Transactional
    public EventResponse cancelEvent(Long id, UserPrincipal currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        validateOwnershipOrAdmin(event, currentUser);
        event.setStatus(EventStatus.CANCELLED);
        Event saved = eventRepository.save(event);
        return mapToEventResponse(saved, currentUser.getId());
    }

    @Transactional
    public void deleteEvent(Long id, UserPrincipal currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        validateOwnershipOrAdmin(event, currentUser);
        eventRepository.delete(event);
    }

    private void validateEventSchedule(LocalDate eventDate, java.time.LocalTime startTime,
                                       java.time.LocalTime endTime, LocalDate registrationDeadline) {
        if (endTime.isBefore(startTime) || endTime.equals(startTime)) {
            throw new BadRequestException("Event end time must be after the start time");
        }
        if (registrationDeadline.isAfter(eventDate)) {
            throw new BadRequestException("Registration deadline cannot be after the event date");
        }
    }

    private void validateOwnershipOrAdmin(Event event, UserPrincipal currentUser) {
        boolean isOwner = event.getOrganizer().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to modify this event");
        }
    }

    public EventResponse mapToEventResponse(Event event, Long currentUserId) {
        EventResponse dto = new EventResponse();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setCategory(event.getCategory());
        dto.setEventDate(event.getEventDate());
        dto.setStartTime(event.getStartTime());
        dto.setEndTime(event.getEndTime());
        dto.setVenue(event.getVenue());
        dto.setCapacity(event.getCapacity());
        dto.setRegistrationDeadline(event.getRegistrationDeadline());
        dto.setPosterUrl(event.getPosterUrl());
        dto.setStatus(event.getStatus().name());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());

        if (event.getOrganizer() != null) {
            dto.setOrganizerId(event.getOrganizer().getId());
            dto.setOrganizerName(event.getOrganizer().getFullName());
            dto.setOrganizerDepartment(event.getOrganizer().getDepartment());
            dto.setOrganizerEmail(event.getOrganizer().getEmail());
        }

        long registeredCount = registrationRepository.countByEventIdAndStatus(event.getId(), RegistrationStatus.CONFIRMED);
        dto.setRegisteredCount(registeredCount);

        int availableSeats = Math.max(0, event.getCapacity() - (int) registeredCount);
        dto.setAvailableSeats(availableSeats);

        LocalDate today = LocalDate.now();
        boolean isRegistrationOpen = event.getStatus() == EventStatus.UPCOMING
                && !event.getRegistrationDeadline().isBefore(today)
                && availableSeats > 0;
        dto.setIsRegistrationOpen(isRegistrationOpen);

        if (currentUserId != null) {
            boolean isRegistered = registrationRepository.existsByStudentIdAndEventIdAndStatus(
                    currentUserId, event.getId(), RegistrationStatus.CONFIRMED
            );
            dto.setIsUserRegistered(isRegistered);
        } else {
            dto.setIsUserRegistered(false);
        }

        return dto;
    }
}
