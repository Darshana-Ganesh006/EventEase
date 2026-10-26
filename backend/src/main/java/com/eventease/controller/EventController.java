package com.eventease.controller;

import com.eventease.dto.request.EventCreateUpdateRequest;
import com.eventease.dto.request.EventStatusUpdateRequest;
import com.eventease.dto.response.ApiResponse;
import com.eventease.dto.response.EventResponse;
import com.eventease.security.UserPrincipal;
import com.eventease.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAllEvents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long currentUserId = principal != null ? principal.getId() : null;
        List<EventResponse> events = eventService.getAllEvents(search, category, status, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Events retrieved successfully", events));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long currentUserId = principal != null ? principal.getId() : null;
        EventResponse event = eventService.getEventById(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Event details retrieved", event));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(
            @Valid @RequestBody EventCreateUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        EventResponse response = eventService.createEvent(request, principal);
        return new ResponseEntity<>(ApiResponse.success("Event created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventCreateUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        EventResponse response = eventService.updateEvent(id, request, principal);
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", response));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<EventResponse>> updateEventStatus(
            @PathVariable Long id,
            @Valid @RequestBody EventStatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        EventResponse response = eventService.updateEventStatus(id, request, principal);
        return ResponseEntity.ok(ApiResponse.success("Event status updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> cancelEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        EventResponse response = eventService.cancelEvent(id, principal);
        return ResponseEntity.ok(ApiResponse.success("Event cancelled successfully", response));
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        eventService.deleteEvent(id, principal);
        return ResponseEntity.ok(ApiResponse.success("Event permanently deleted"));
    }
}
