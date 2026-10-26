package com.eventease.controller;

import com.eventease.dto.response.ApiResponse;
import com.eventease.dto.response.ReportsOverviewResponse;
import com.eventease.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<ReportsOverviewResponse>> getReportsOverview() {
        ReportsOverviewResponse overview = reportService.getReportsOverview();
        return ResponseEntity.ok(ApiResponse.success("Reports overview retrieved", overview));
    }

    @GetMapping("/events")
    public ResponseEntity<ApiResponse<Object>> getEventReports() {
        ReportsOverviewResponse overview = reportService.getReportsOverview();
        return ResponseEntity.ok(ApiResponse.success("Event reports retrieved", overview.getEventReports()));
    }

    @GetMapping("/attendance")
    public ResponseEntity<ApiResponse<Object>> getAttendanceReports() {
        ReportsOverviewResponse overview = reportService.getReportsOverview();
        return ResponseEntity.ok(ApiResponse.success("Attendance reports retrieved", overview));
    }
}
