package com.eventease.controller;

import com.eventease.dto.response.ApiResponse;
import com.eventease.dto.response.RegistrationResponse;
import com.eventease.security.UserPrincipal;
import com.eventease.service.RegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping("/events/{eventId}/registrations")
    public ResponseEntity<ApiResponse<RegistrationResponse>> registerForEvent(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserPrincipal principal) {
        RegistrationResponse response = registrationService.registerForEvent(eventId, principal);
        return new ResponseEntity<>(ApiResponse.success("Successfully registered for event", response), HttpStatus.CREATED);
    }

    @GetMapping("/registrations/me")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getMyRegistrations(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<RegistrationResponse> registrations = registrationService.getMyRegistrations(principal);
        return ResponseEntity.ok(ApiResponse.success("My registrations retrieved", registrations));
    }

    @GetMapping("/events/{eventId}/registrations")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getEventRegistrations(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserPrincipal principal) {
        List<RegistrationResponse> registrations = registrationService.getEventRegistrations(eventId, principal);
        return ResponseEntity.ok(ApiResponse.success("Event participants retrieved", registrations));
    }

    @PatchMapping("/registrations/{registrationId}/cancel")
    public ResponseEntity<ApiResponse<RegistrationResponse>> cancelRegistration(
            @PathVariable Long registrationId,
            @AuthenticationPrincipal UserPrincipal principal) {
        RegistrationResponse response = registrationService.cancelRegistration(registrationId, principal);
        return ResponseEntity.ok(ApiResponse.success("Registration cancelled successfully", response));
    }
}
