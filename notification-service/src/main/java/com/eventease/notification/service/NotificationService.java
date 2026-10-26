package com.eventease.notification.service;

import com.eventease.notification.dto.NotificationResponse;
import com.eventease.notification.dto.RegistrationNotificationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    public NotificationResponse sendRegistrationConfirmation(RegistrationNotificationRequest request) {
        String deliveryId = "SIM-NOTIF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        // Mask recipient email for safe logging (e.g. s***a@domain.com)
        String maskedEmail = maskEmail(request.getStudentEmail());

        log.info("[SIMULATED NOTIFICATION] Sent Registration Confirmation -> Recipient: {}, Event: '{}' [{}], Date: {}, Venue: '{}', DeliveryId: {}",
                maskedEmail,
                request.getEventTitle(),
                request.getEventCategory(),
                request.getEventDate(),
                request.getVenue(),
                deliveryId);

        return new NotificationResponse(
                true,
                "Simulated confirmation notification delivered successfully to " + maskedEmail,
                deliveryId,
                maskedEmail,
                LocalDateTime.now(),
                "SIMULATED_EMAIL"
        );
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "***";
        }
        String[] parts = email.split("@");
        String name = parts[0];
        String domain = parts[1];
        if (name.length() <= 2) {
            return name.charAt(0) + "***@" + domain;
        }
        return name.charAt(0) + "***" + name.charAt(name.length() - 1) + "@" + domain;
    }
}
