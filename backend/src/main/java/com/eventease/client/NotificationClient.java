package com.eventease.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class NotificationClient {

    private static final Logger log = LoggerFactory.getLogger(NotificationClient.class);

    private final RestTemplate restTemplate;
    private final String notificationServiceUrl;

    public NotificationClient(RestTemplate restTemplate,
                              @Value("${eventease.notification-service.url:http://localhost:8082}") String notificationServiceUrl) {
        this.restTemplate = restTemplate;
        this.notificationServiceUrl = notificationServiceUrl;
    }

    public NotificationClientResponse sendRegistrationConfirmation(NotificationRequest request) {
        String endpoint = notificationServiceUrl + "/api/notifications/registration-confirmation";
        try {
            log.info("Sending registration confirmation request to Notification Service at {}", endpoint);
            ResponseEntity<NotificationClientResponse> response = restTemplate.postForEntity(
                    endpoint,
                    request,
                    NotificationClientResponse.class
            );
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                log.info("Notification Service successfully acknowledged registration #{} with delivery ID {}",
                        request.getRegistrationId(), response.getBody().getDeliveryId());
                return response.getBody();
            }
        } catch (Exception ex) {
            // Per requirements: If the notification service is unavailable, do not silently lose or roll back a valid registration.
            // Log the warning safely and proceed.
            log.warn("Notification Service call to {} was unavailable or returned error: {}. Proceeding without failing registration.",
                    endpoint, ex.getMessage());
        }
        return null;
    }
}
