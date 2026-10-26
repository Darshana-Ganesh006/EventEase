package com.eventease.dto.response;

import java.util.List;
import java.util.Map;

public class AdminDashboardResponse {
    private long totalUsers;
    private long totalStudents;
    private long totalOrganizers;
    private long totalAdmins;

    private long totalEvents;
    private long upcomingEvents;
    private long completedEvents;
    private long cancelledEvents;

    private long totalRegistrations;
    private long totalAttended;
    private double overallAttendanceRate;

    private Map<String, Long> eventsByCategory;
    private List<UserResponse> recentUsers;

    public AdminDashboardResponse() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalOrganizers() { return totalOrganizers; }
    public void setTotalOrganizers(long totalOrganizers) { this.totalOrganizers = totalOrganizers; }

    public long getTotalAdmins() { return totalAdmins; }
    public void setTotalAdmins(long totalAdmins) { this.totalAdmins = totalAdmins; }

    public long getTotalEvents() { return totalEvents; }
    public void setTotalEvents(long totalEvents) { this.totalEvents = totalEvents; }

    public long getUpcomingEvents() { return upcomingEvents; }
    public void setUpcomingEvents(long upcomingEvents) { this.upcomingEvents = upcomingEvents; }

    public long getCompletedEvents() { return completedEvents; }
    public void setCompletedEvents(long completedEvents) { this.completedEvents = completedEvents; }

    public long getCancelledEvents() { return cancelledEvents; }
    public void setCancelledEvents(long cancelledEvents) { this.cancelledEvents = cancelledEvents; }

    public long getTotalRegistrations() { return totalRegistrations; }
    public void setTotalRegistrations(long totalRegistrations) { this.totalRegistrations = totalRegistrations; }

    public long getTotalAttended() { return totalAttended; }
    public void setTotalAttended(long totalAttended) { this.totalAttended = totalAttended; }

    public double getOverallAttendanceRate() { return overallAttendanceRate; }
    public void setOverallAttendanceRate(double overallAttendanceRate) { this.overallAttendanceRate = overallAttendanceRate; }

    public Map<String, Long> getEventsByCategory() { return eventsByCategory; }
    public void setEventsByCategory(Map<String, Long> eventsByCategory) { this.eventsByCategory = eventsByCategory; }

    public List<UserResponse> getRecentUsers() { return recentUsers; }
    public void setRecentUsers(List<UserResponse> recentUsers) { this.recentUsers = recentUsers; }
}
