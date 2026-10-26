package com.eventease.notification.dto;

import java.time.LocalDateTime;

public class NotificationResponse {
    private boolean success;
    private String message;
    private String deliveryId;
    private String recipient;
    private LocalDateTime timestamp;
    private String deliveryChannel;

    public NotificationResponse() {}

    public NotificationResponse(boolean success, String message, String deliveryId,
                                String recipient, LocalDateTime timestamp, String deliveryChannel) {
        this.success = success;
        this.message = message;
        this.deliveryId = deliveryId;
        this.recipient = recipient;
        this.timestamp = timestamp;
        this.deliveryChannel = deliveryChannel;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getDeliveryId() { return deliveryId; }
    public void setDeliveryId(String deliveryId) { this.deliveryId = deliveryId; }

    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getDeliveryChannel() { return deliveryChannel; }
    public void setDeliveryChannel(String deliveryChannel) { this.deliveryChannel = deliveryChannel; }
}
