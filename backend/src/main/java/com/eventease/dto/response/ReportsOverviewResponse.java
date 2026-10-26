package com.eventease.dto.response;

import java.util.List;
import java.util.Map;

public class ReportsOverviewResponse {
    private long totalEvents;
    private long totalRegistrations;
    private long totalAttended;
    private double overallAttendanceRate;
    private Map<String, Long> categoryDistribution;
    private Map<String, Long> statusDistribution;
    private List<EventReportItem> eventReports;

    public static class EventReportItem {
        private Long eventId;
        private String title;
        private String category;
        private String eventDate;
        private int capacity;
        private long registrationsCount;
        private long attendedCount;
        private double attendancePercentage;

        public EventReportItem() {}

        public EventReportItem(Long eventId, String title, String category, String eventDate,
                               int capacity, long registrationsCount, long attendedCount, double attendancePercentage) {
            this.eventId = eventId;
            this.title = title;
            this.category = category;
            this.eventDate = eventDate;
            this.capacity = capacity;
            this.registrationsCount = registrationsCount;
            this.attendedCount = attendedCount;
            this.attendancePercentage = attendancePercentage;
        }

        public Long getEventId() { return eventId; }
        public void setEventId(Long eventId) { this.eventId = eventId; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getEventDate() { return eventDate; }
        public void setEventDate(String eventDate) { this.eventDate = eventDate; }

        public int getCapacity() { return capacity; }
        public void setCapacity(int capacity) { this.capacity = capacity; }

        public long getRegistrationsCount() { return registrationsCount; }
        public void setRegistrationsCount(long registrationsCount) { this.registrationsCount = registrationsCount; }

        public long getAttendedCount() { return attendedCount; }
        public void setAttendedCount(long attendedCount) { this.attendedCount = attendedCount; }

        public double getAttendancePercentage() { return attendancePercentage; }
        public void setAttendancePercentage(double attendancePercentage) { this.attendancePercentage = attendancePercentage; }
    }

    public ReportsOverviewResponse() {}

    public long getTotalEvents() { return totalEvents; }
    public void setTotalEvents(long totalEvents) { this.totalEvents = totalEvents; }

    public long getTotalRegistrations() { return totalRegistrations; }
    public void setTotalRegistrations(long totalRegistrations) { this.totalRegistrations = totalRegistrations; }

    public long getTotalAttended() { return totalAttended; }
    public void setTotalAttended(long totalAttended) { this.totalAttended = totalAttended; }

    public double getOverallAttendanceRate() { return overallAttendanceRate; }
    public void setOverallAttendanceRate(double overallAttendanceRate) { this.overallAttendanceRate = overallAttendanceRate; }

    public Map<String, Long> getCategoryDistribution() { return categoryDistribution; }
    public void setCategoryDistribution(Map<String, Long> categoryDistribution) { this.categoryDistribution = categoryDistribution; }

    public Map<String, Long> getStatusDistribution() { return statusDistribution; }
    public void setStatusDistribution(Map<String, Long> statusDistribution) { this.statusDistribution = statusDistribution; }

    public List<EventReportItem> getEventReports() { return eventReports; }
    public void setEventReports(List<EventReportItem> eventReports) { this.eventReports = eventReports; }
}
