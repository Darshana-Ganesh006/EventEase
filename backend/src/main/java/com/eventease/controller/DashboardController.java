package com.eventease.controller;

import com.eventease.dto.response.*;
import com.eventease.security.UserPrincipal;
import com.eventease.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/student")
    public ResponseEntity<ApiResponse<StudentDashboardResponse>> getStudentDashboard(
            @AuthenticationPrincipal UserPrincipal principal) {
        StudentDashboardResponse response = dashboardService.getStudentDashboard(principal);
        return ResponseEntity.ok(ApiResponse.success("Student dashboard retrieved", response));
    }

    @GetMapping("/organizer")
    public ResponseEntity<ApiResponse<OrganizerDashboardResponse>> getOrganizerDashboard(
            @AuthenticationPrincipal UserPrincipal principal) {
        OrganizerDashboardResponse response = dashboardService.getOrganizerDashboard(principal);
        return ResponseEntity.ok(ApiResponse.success("Organizer dashboard retrieved", response));
    }

    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getAdminDashboard() {
        AdminDashboardResponse response = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard retrieved", response));
    }
}
