package com.eventease.service;

import com.eventease.dto.request.UserRoleUpdateRequest;
import com.eventease.dto.request.UserStatusUpdateRequest;
import com.eventease.dto.response.UserResponse;
import com.eventease.entity.Role;
import com.eventease.entity.User;
import com.eventease.exception.BadRequestException;
import com.eventease.exception.ResourceNotFoundException;
import com.eventease.repository.UserRepository;
import com.eventease.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers(String search, String role) {
        List<User> users = userRepository.findAll();

        return users.stream()
                .filter(u -> {
                    if (role == null || role.trim().isEmpty() || role.equalsIgnoreCase("ALL")) {
                        return true;
                    }
                    return u.getRole().name().equalsIgnoreCase(role.trim());
                })
                .filter(u -> {
                    if (search == null || search.trim().isEmpty()) {
                        return true;
                    }
                    String q = search.trim().toLowerCase();
                    return u.getFullName().toLowerCase().contains(q) ||
                           u.getEmail().toLowerCase().contains(q) ||
                           u.getDepartment().toLowerCase().contains(q);
                })
                .map(AuthService::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse updateUserRole(Long userId, UserRoleUpdateRequest request, UserPrincipal currentUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getId().equals(currentUser.getId()) && !request.getRole().equalsIgnoreCase("ADMIN")) {
            throw new BadRequestException("Administrators cannot demote their own account role");
        }

        try {
            Role newRole = Role.valueOf(request.getRole().trim().toUpperCase());
            user.setRole(newRole);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid role: " + request.getRole());
        }

        User saved = userRepository.save(user);
        return AuthService.mapToUserResponse(saved);
    }

    @Transactional
    public UserResponse updateUserStatus(Long userId, UserStatusUpdateRequest request, UserPrincipal currentUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getId().equals(currentUser.getId()) && Boolean.FALSE.equals(request.getActive())) {
            throw new BadRequestException("Administrators cannot deactivate their own account");
        }

        user.setActive(request.getActive());
        User saved = userRepository.save(user);
        return AuthService.mapToUserResponse(saved);
    }
}
