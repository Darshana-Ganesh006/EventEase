package com.eventease.controller;

import com.eventease.dto.request.LoginRequest;
import com.eventease.dto.request.RegisterRequest;
import com.eventease.dto.response.AuthResponse;
import com.eventease.dto.response.UserResponse;
import com.eventease.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @MockBean
    private AuthService authService;

    @Test
    @DisplayName("Verify BCrypt hash of password123 against seed.sql")
    void shouldMatchSeedPasswordHash() {
        org.junit.jupiter.api.Assertions.assertTrue(passwordEncoder.matches("password123", "$2a$10$wRvg2Q9f8R/PSTYoTRVV9u3L10BM/aoE8.IQz8bX3ykhTm/DhJzkq"));
    }

    @Test
    @DisplayName("Test 9: POST /api/auth/register validates and registers a student")
    void shouldRegisterStudentSuccessfully() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "Priya Sharma",
                "priya.student@eventease.srmist.edu.in",
                "Computer Science and Engineering",
                "securePass123"
        );

        UserResponse userResponse = new UserResponse(
                10L,
                "Priya Sharma",
                "priya.student@eventease.srmist.edu.in",
                "Computer Science and Engineering",
                "STUDENT",
                true,
                LocalDateTime.now()
        );
        AuthResponse authResponse = new AuthResponse("mock-jwt-token-xyz", userResponse);

        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("mock-jwt-token-xyz"))
                .andExpect(jsonPath("$.data.user.role").value("STUDENT"));
    }

    @Test
    @DisplayName("Test 10: POST /api/auth/login succeeds with valid credentials")
    void shouldLoginSuccessfully() throws Exception {
        LoginRequest request = new LoginRequest("priya.student@eventease.srmist.edu.in", "securePass123");

        UserResponse userResponse = new UserResponse(
                10L,
                "Priya Sharma",
                "priya.student@eventease.srmist.edu.in",
                "Computer Science and Engineering",
                "STUDENT",
                true,
                LocalDateTime.now()
        );
        AuthResponse authResponse = new AuthResponse("mock-login-token", userResponse);

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("mock-login-token"));
    }
}
