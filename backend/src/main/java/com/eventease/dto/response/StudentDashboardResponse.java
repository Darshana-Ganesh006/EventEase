package com.eventease.dto.response;

import java.util.List;

public class StudentDashboardResponse {
    private String studentName;
    private String department;
    private long totalRegistrations;
    private long upcomingEventsCount;
    private long attendedEventsCount;
    private List<RegistrationResponse> upcomingRegistrations;
    private List<RegistrationResponse> recentRegistrations;

    public StudentDashboardResponse() {}

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public long getTotalRegistrations() { return totalRegistrations; }
    public void setTotalRegistrations(long totalRegistrations) { this.totalRegistrations = totalRegistrations; }

    public long getUpcomingEventsCount() { return upcomingEventsCount; }
    public void setUpcomingEventsCount(long upcomingEventsCount) { this.upcomingEventsCount = upcomingEventsCount; }

    public long getAttendedEventsCount() { return attendedEventsCount; }
    public void setAttendedEventsCount(long attendedEventsCount) { this.attendedEventsCount = attendedEventsCount; }

    public List<RegistrationResponse> getUpcomingRegistrations() { return upcomingRegistrations; }
    public void setUpcomingRegistrations(List<RegistrationResponse> upcomingRegistrations) { this.upcomingRegistrations = upcomingRegistrations; }

    public List<RegistrationResponse> getRecentRegistrations() { return recentRegistrations; }
    public void setRecentRegistrations(List<RegistrationResponse> recentRegistrations) { this.recentRegistrations = recentRegistrations; }
}
