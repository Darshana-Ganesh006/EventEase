package com.eventease.service;

import com.eventease.dto.response.ReportsOverviewResponse;
import com.eventease.entity.AttendanceStatus;
import com.eventease.entity.Event;
import com.eventease.entity.RegistrationStatus;
import com.eventease.repository.AttendanceRepository;
import com.eventease.repository.EventRepository;
import com.eventease.repository.RegistrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final AttendanceRepository attendanceRepository;

    public ReportService(EventRepository eventRepository,
                         RegistrationRepository registrationRepository,
                         AttendanceRepository attendanceRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @Transactional(readOnly = true)
    public ReportsOverviewResponse getReportsOverview() {
        ReportsOverviewResponse response = new ReportsOverviewResponse();

        List<Event> allEvents = eventRepository.findAll();
        long totalEvents = allEvents.size();
        long totalRegistrations = registrationRepository.countByStatus(RegistrationStatus.CONFIRMED);
        long totalAttended = attendanceRepository.countByAttendanceStatus(AttendanceStatus.PRESENT);

        double rate = 0.0;
        if (totalRegistrations > 0) {
            rate = Math.round(((double) totalAttended / totalRegistrations) * 1000.0) / 10.0;
        }

        Map<String, Long> catDist = new HashMap<>();
        Map<String, Long> statusDist = new HashMap<>();
        List<ReportsOverviewResponse.EventReportItem> eventReports = new ArrayList<>();

        for (Event e : allEvents) {
            catDist.put(e.getCategory(), catDist.getOrDefault(e.getCategory(), 0L) + 1);
            statusDist.put(e.getStatus().name(), statusDist.getOrDefault(e.getStatus().name(), 0L) + 1);

            long regCount = registrationRepository.countByEventIdAndStatus(e.getId(), RegistrationStatus.CONFIRMED);
            long presentCount = attendanceRepository.countByEventIdAndAttendanceStatus(e.getId(), AttendanceStatus.PRESENT);
            double pct = 0.0;
            if (regCount > 0) {
                pct = Math.round(((double) presentCount / regCount) * 1000.0) / 10.0;
            }

            eventReports.add(new ReportsOverviewResponse.EventReportItem(
                    e.getId(),
                    e.getTitle(),
                    e.getCategory(),
                    e.getEventDate().toString(),
                    e.getCapacity(),
                    regCount,
                    presentCount,
                    pct
            ));
        }

        response.setTotalEvents(totalEvents);
        response.setTotalRegistrations(totalRegistrations);
        response.setTotalAttended(totalAttended);
        response.setOverallAttendanceRate(rate);
        response.setCategoryDistribution(catDist);
        response.setStatusDistribution(statusDist);
        response.setEventReports(eventReports);

        return response;
    }
}
