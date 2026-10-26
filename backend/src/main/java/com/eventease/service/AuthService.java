package com.eventease.service;

import com.eventease.dto.request.LoginRequest;
import com.eventease.dto.request.RegisterRequest;
import com.eventease.dto.response.AuthResponse;
import com.eventease.dto.response.UserResponse;
import com.eventease.entity.Role;
import com.eventease.entity.User;
import com.eventease.exception.BadRequestException;
import com.eventease.exception.ConflictException;
import com.eventease.exception.ResourceNotFoundException;
import com.eventease.repository.UserRepository;
import com.eventease.security.JwtTokenProvider;
import com.eventease.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new BadRequestException("This account has been deactivated. Please contact an administrator.");
        }

        UserResponse userResponse = mapToUserResponse(user);
        return new AuthResponse(jwt, userResponse);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email is already registered: " + email);
        }

        // Security requirement: Public self-registration is strictly restricted to STUDENT role.
        // Role cannot be escalated through incoming request parameters.
        Role role = Role.STUDENT;

        User user = new User(
                request.getFullName().trim(),
                email,
                passwordEncoder.encode(request.getPassword()),
                request.getDepartment().trim(),
                role
        );

        User savedUser = userRepository.save(user);

        // Authenticate immediately after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, mapToUserResponse(savedUser));
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UserPrincipal principal) {
        if (principal == null) {
            throw new BadRequestException("User is not authenticated");
        }
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + principal.getId()));
        return mapToUserResponse(user);
    }

    public static UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getDepartment(),
                user.getRole().name(),
                user.getActive(),
                user.getCreatedAt()
        );
    }
}
