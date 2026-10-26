package com.eventease.service;

import com.eventease.client.NotificationClient;
import com.eventease.client.NotificationRequest;
import com.eventease.dto.response.RegistrationResponse;
import com.eventease.entity.*;
import com.eventease.exception.BadRequestException;
import com.eventease.exception.ConflictException;
import com.eventease.exception.UnauthorizedException;
import com.eventease.repository.AttendanceRepository;
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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RegistrationServiceTest {

    @Mock
    private RegistrationRepository registrationRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private NotificationClient notificationClient;

    @InjectMocks
    private RegistrationService registrationService;

    private UserPrincipal studentPrincipal;
    private UserPrincipal organizerPrincipal;
    private User studentUser;
    private User organizerUser;
    private Event sampleEvent;

    @BeforeEach
    void setUp() {
        studentPrincipal = new UserPrincipal(
                4L,
                "Aarav Patel",
                "aarav.student@eventease.srmist.edu.in",
                "hashedPass",
                "Computer Science and Engineering",
                Role.STUDENT,
                true,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_STUDENT"))
        );

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

        studentUser = new User("Aarav Patel", "aarav.student@eventease.srmist.edu.in", "pass", "CSE", Role.STUDENT);
        studentUser.setId(4L);

        organizerUser = new User("Prof. Ananya Sharma", "ananya.cse@eventease.srmist.edu.in", "pass", "CSE", Role.ORGANISER);
        organizerUser.setId(2L);

        sampleEvent = new Event();
        sampleEvent.setId(10L);
        sampleEvent.setTitle("AI & Robotics Seminar");
        sampleEvent.setDescription("Cutting edge seminar on robotics");
        sampleEvent.setCategory("Seminar");
        sampleEvent.setEventDate(LocalDate.now().plusDays(7));
        sampleEvent.setStartTime(LocalTime.of(10, 0));
        sampleEvent.setEndTime(LocalTime.of(12, 0));
        sampleEvent.setVenue("Hall A");
        sampleEvent.setCapacity(2);
        sampleEvent.setRegistrationDeadline(LocalDate.now().plusDays(5));
        sampleEvent.setStatus(EventStatus.UPCOMING);
        sampleEvent.setOrganizer(organizerUser);
    }

    @Test
    @DisplayName("Test 3: Reject registration if user is not a student")
    void shouldRejectWhenUserIsNotStudent() {
        UnauthorizedException ex = assertThrows(UnauthorizedException.class, () ->
                registrationService.registerForEvent(10L, organizerPrincipal)
        );
        assertTrue(ex.getMessage().contains("Only students can register"));
    }

    @Test
    @DisplayName("Test 4: Reject duplicate active student registration")
    void shouldRejectDuplicateRegistration() {
        when(eventRepository.findById(10L)).thenReturn(Optional.of(sampleEvent));
        when(registrationRepository.existsByStudentIdAndEventIdAndStatus(4L, 10L, RegistrationStatus.CONFIRMED))
                .thenReturn(true);

        ConflictException ex = assertThrows(ConflictException.class, () ->
                registrationService.registerForEvent(10L, studentPrincipal)
        );
        assertTrue(ex.getMessage().contains("already registered"));
    }

    @Test
    @DisplayName("Test 5: Reject registration when event capacity is full")
    void shouldRejectWhenEventIsFull() {
        when(eventRepository.findById(10L)).thenReturn(Optional.of(sampleEvent));
        when(registrationRepository.existsByStudentIdAndEventIdAndStatus(4L, 10L, RegistrationStatus.CONFIRMED))
                .thenReturn(false);
        when(registrationRepository.countByEventIdAndStatus(10L, RegistrationStatus.CONFIRMED)).thenReturn(2L); // capacity is 2

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                registrationService.registerForEvent(10L, studentPrincipal)
        );
        assertTrue(ex.getMessage().contains("Event is full"));
    }

    @Test
    @DisplayName("Test 6: Reject registration after deadline has passed")
    void shouldRejectWhenDeadlineHasPassed() {
        sampleEvent.setRegistrationDeadline(LocalDate.now().minusDays(1)); // passed
        when(eventRepository.findById(10L)).thenReturn(Optional.of(sampleEvent));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                registrationService.registerForEvent(10L, studentPrincipal)
        );
        assertTrue(ex.getMessage().contains("Registration has closed"));
    }

    @Test
    @DisplayName("Test 7: Reject registration for cancelled event")
    void shouldRejectWhenEventIsCancelled() {
        sampleEvent.setStatus(EventStatus.CANCELLED);
        when(eventRepository.findById(10L)).thenReturn(Optional.of(sampleEvent));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                registrationService.registerForEvent(10L, studentPrincipal)
        );
        assertTrue(ex.getMessage().contains("Cannot register for a cancelled event"));
    }

    @Test
    @DisplayName("Test 8: Successful registration creates record, linked attendance, and triggers notification")
    void shouldRegisterSuccessfullyAndTriggerNotification() {
        when(eventRepository.findById(10L)).thenReturn(Optional.of(sampleEvent));
        when(registrationRepository.existsByStudentIdAndEventIdAndStatus(4L, 10L, RegistrationStatus.CONFIRMED)).thenReturn(false);
        when(registrationRepository.countByEventIdAndStatus(10L, RegistrationStatus.CONFIRMED)).thenReturn(0L);
        when(userRepository.findById(4L)).thenReturn(Optional.of(studentUser));

        Registration mockSaved = new Registration(studentUser, sampleEvent);
        mockSaved.setId(100L);
        when(registrationRepository.save(any(Registration.class))).thenReturn(mockSaved);

        RegistrationResponse response = registrationService.registerForEvent(10L, studentPrincipal);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("CONFIRMED", response.getStatus());

        verify(attendanceRepository, times(1)).save(any(Attendance.class));
        verify(notificationClient, times(1)).sendRegistrationConfirmation(any(NotificationRequest.class));
    }
}
