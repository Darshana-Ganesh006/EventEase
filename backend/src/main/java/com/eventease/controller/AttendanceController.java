package com.eventease.controller;

import com.eventease.dto.request.AttendanceUpdateRequest;
import com.eventease.dto.response.ApiResponse;
import com.eventease.dto.response.AttendanceResponse;
import com.eventease.security.UserPrincipal;
import com.eventease.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/events/{eventId}/attendance")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getEventAttendance(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserPrincipal principal) {
        List<AttendanceResponse> attendanceList = attendanceService.getEventAttendance(eventId, principal);
        return ResponseEntity.ok(ApiResponse.success("Attendance records retrieved", attendanceList));
    }

    @PatchMapping("/registrations/{registrationId}/attendance")
    public ResponseEntity<ApiResponse<AttendanceResponse>> updateAttendance(
            @PathVariable Long registrationId,
            @Valid @RequestBody AttendanceUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        AttendanceResponse response = attendanceService.updateAttendance(registrationId, request, principal);
        return ResponseEntity.ok(ApiResponse.success("Attendance updated successfully", response));
    }
}
