package com.eventease.service;

import com.eventease.dto.request.EventCreateUpdateRequest;
import com.eventease.entity.Role;
import com.eventease.exception.BadRequestException;
import com.eventease.repository.EventRepository;
import com.eventease.repository.RegistrationRepository;
import com.eventease.repository.UserRepository;
import com.eventease.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private RegistrationRepository registrationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EventService eventService;

    private UserPrincipal organizerPrincipal;

    @BeforeEach
    void setUp() {
        organizerPrincipal = new UserPrincipal(
                2L,
                "Prof. Ananya Sharma",
                "ananya.cse@eventease.srmist.edu.in",
                "hashedPass",
                "Computer Science and Engineering",
                Role.ORGANISER,
                true,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ORGANISER"))
        );
    }

    @Test
    @DisplayName("Test 1: Reject event when end time is before or equal to start time")
    void shouldRejectEventWhenEndTimeIsBeforeStartTime() {
        EventCreateUpdateRequest request = new EventCreateUpdateRequest();
        request.setTitle("Cloud Computing Workshop");
        request.setDescription("Comprehensive cloud computing hands-on workshop.");
        request.setCategory("Workshop");
        request.setEventDate(LocalDate.now().plusDays(10));
        request.setStartTime(LocalTime.of(14, 0));
        request.setEndTime(LocalTime.of(13, 0)); // Invalid: end time before start time
        request.setVenue("Tech Lab 101");
        request.setCapacity(50);
        request.setRegistrationDeadline(LocalDate.now().plusDays(8));

        BadRequestException exception = assertThrows(BadRequestException.class, () ->
                eventService.createEvent(request, organizerPrincipal)
        );

        assertTrue(exception.getMessage().contains("Event end time must be after the start time"));
    }

    @Test
    @DisplayName("Test 2: Reject event when registration deadline is after event date")
    void shouldRejectEventWhenDeadlineIsAfterEventDate() {
        EventCreateUpdateRequest request = new EventCreateUpdateRequest();
        request.setTitle("Cloud Computing Workshop");
        request.setDescription("Comprehensive cloud computing hands-on workshop.");
        request.setCategory("Workshop");
        request.setEventDate(LocalDate.now().plusDays(10));
        request.setStartTime(LocalTime.of(10, 0));
        request.setEndTime(LocalTime.of(13, 0));
        request.setVenue("Tech Lab 101");
        request.setCapacity(50);
        request.setRegistrationDeadline(LocalDate.now().plusDays(12)); // Invalid: deadline after event date

        BadRequestException exception = assertThrows(BadRequestException.class, () ->
                eventService.createEvent(request, organizerPrincipal)
        );

        assertTrue(exception.getMessage().contains("Registration deadline cannot be after the event date"));
    }
}
