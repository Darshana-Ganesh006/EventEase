package com.eventease.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class AttendanceUpdateRequest {

    @NotBlank(message = "Attendance status is required")
    @Pattern(regexp = "^(NOT_MARKED|PRESENT|ABSENT)$", message = "Status must be NOT_MARKED, PRESENT, or ABSENT")
    private String status;

    public AttendanceUpdateRequest() {}

    public AttendanceUpdateRequest(String status) {
        this.status = status;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
