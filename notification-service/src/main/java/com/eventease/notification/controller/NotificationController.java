package com.eventease.notification.controller;

import com.eventease.notification.dto.NotificationResponse;
import com.eventease.notification.dto.RegistrationNotificationRequest;
import com.eventease.notification.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/registration-confirmation")
    public ResponseEntity<NotificationResponse> sendRegistrationConfirmation(
            @Valid @RequestBody RegistrationNotificationRequest request) {
        NotificationResponse response = notificationService.sendRegistrationConfirmation(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "eventease-notification-service");
        status.put("status", "UP");
        status.put("port", 8082);
        status.put("mode", "SIMULATED_NOTIFICATIONS");
        status.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(status);
    }
}
