package com.eventease.dto.response;

import java.util.List;

public class OrganizerDashboardResponse {
    private String organizerName;
    private long totalEventsCreated;
    private long upcomingEventsCount;
    private long completedEventsCount;
    private long totalRegistrationsReceived;
    private long totalPresentCount;
    private double attendanceRate;
    private List<EventResponse> myEvents;
    private List<RegistrationResponse> recentRegistrations;

    public OrganizerDashboardResponse() {}

    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }

    public long getTotalEventsCreated() { return totalEventsCreated; }
    public void setTotalEventsCreated(long totalEventsCreated) { this.totalEventsCreated = totalEventsCreated; }

    public long getUpcomingEventsCount() { return upcomingEventsCount; }
    public void setUpcomingEventsCount(long upcomingEventsCount) { this.upcomingEventsCount = upcomingEventsCount; }

    public long getCompletedEventsCount() { return completedEventsCount; }
    public void setCompletedEventsCount(long completedEventsCount) { this.completedEventsCount = completedEventsCount; }

    public long getTotalRegistrationsReceived() { return totalRegistrationsReceived; }
    public void setTotalRegistrationsReceived(long totalRegistrationsReceived) { this.totalRegistrationsReceived = totalRegistrationsReceived; }

    public long getTotalPresentCount() { return totalPresentCount; }
    public void setTotalPresentCount(long totalPresentCount) { this.totalPresentCount = totalPresentCount; }

    public double getAttendanceRate() { return attendanceRate; }
    public void setAttendanceRate(double attendanceRate) { this.attendanceRate = attendanceRate; }

    public List<EventResponse> getMyEvents() { return myEvents; }
    public void setMyEvents(List<EventResponse> myEvents) { this.myEvents = myEvents; }

    public List<RegistrationResponse> getRecentRegistrations() { return recentRegistrations; }
    public void setRecentRegistrations(List<RegistrationResponse> recentRegistrations) { this.recentRegistrations = recentRegistrations; }
}
