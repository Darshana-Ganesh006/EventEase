package com.eventease.notification.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RegistrationNotificationRequest {

    @NotBlank(message = "Student name is required")
    private String studentName;

    @NotBlank(message = "Student email is required")
    @Email(message = "Invalid email format")
    private String studentEmail;

    @NotBlank(message = "Event title is required")
    private String eventTitle;

    @NotBlank(message = "Event category is required")
    private String eventCategory;

    @NotBlank(message = "Event date is required")
    private String eventDate;

    @NotBlank(message = "Start time is required")
    private String startTime;

    @NotBlank(message = "Venue is required")
    private String venue;

    @NotNull(message = "Registration ID is required")
    private Long registrationId;

    public RegistrationNotificationRequest() {}

    public RegistrationNotificationRequest(String studentName, String studentEmail, String eventTitle,
                                         String eventCategory, String eventDate, String startTime,
                                         String venue, Long registrationId) {
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.eventTitle = eventTitle;
        this.eventCategory = eventCategory;
        this.eventDate = eventDate;
        this.startTime = startTime;
        this.venue = venue;
        this.registrationId = registrationId;
    }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

    public String getEventCategory() { return eventCategory; }
    public void setEventCategory(String eventCategory) { this.eventCategory = eventCategory; }

    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public Long getRegistrationId() { return registrationId; }
    public void setRegistrationId(Long registrationId) { this.registrationId = registrationId; }
}
