package com.eventease.controller;

import com.eventease.dto.request.UserRoleUpdateRequest;
import com.eventease.dto.request.UserStatusUpdateRequest;
import com.eventease.dto.response.ApiResponse;
import com.eventease.dto.response.UserResponse;
import com.eventease.security.UserPrincipal;
import com.eventease.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role) {
        List<UserResponse> users = adminService.getAllUsers(search, role);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UserRoleUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        UserResponse response = adminService.updateUserRole(id, request, principal);
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", response));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UserStatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        UserResponse response = adminService.updateUserStatus(id, request, principal);
        return ResponseEntity.ok(ApiResponse.success("User account status updated successfully", response));
    }
}
