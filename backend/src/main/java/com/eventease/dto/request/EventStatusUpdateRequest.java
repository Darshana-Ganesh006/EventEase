package com.eventease.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class EventStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(UPCOMING|ONGOING|COMPLETED|CANCELLED)$", message = "Invalid event status")
    private String status;

    public EventStatusUpdateRequest() {}

    public EventStatusUpdateRequest(String status) {
        this.status = status;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
