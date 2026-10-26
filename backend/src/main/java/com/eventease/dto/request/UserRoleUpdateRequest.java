package com.eventease.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UserRoleUpdateRequest {

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(ADMIN|ORGANISER|STUDENT)$", message = "Role must be ADMIN, ORGANISER, or STUDENT")
    private String role;

    public UserRoleUpdateRequest() {}

    public UserRoleUpdateRequest(String role) {
        this.role = role;
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
