package com.eventease.client;

public class NotificationRequest {
    private String studentName;
    private String studentEmail;
    private String eventTitle;
    private String eventCategory;
    private String eventDate;
    private String startTime;
    private String venue;
    private Long registrationId;

    public NotificationRequest() {}

    public NotificationRequest(String studentName, String studentEmail, String eventTitle,
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
