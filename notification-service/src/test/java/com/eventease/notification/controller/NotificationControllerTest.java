package com.eventease.notification.controller;

import com.eventease.notification.dto.RegistrationNotificationRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Health endpoint returns UP status and simulated notification mode")
    void shouldReturnHealthStatusUp() throws Exception {
        mockMvc.perform(get("/api/notifications/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("eventease-notification-service"))
                .andExpect(jsonPath("$.mode").value("SIMULATED_NOTIFICATIONS"));
    }

    @Test
    @DisplayName("Registration confirmation endpoint acknowledges simulated delivery")
    void shouldAcknowledgeRegistrationNotification() throws Exception {
        RegistrationNotificationRequest request = new RegistrationNotificationRequest(
                "Aarav Patel",
                "aarav.student@eventease.srmist.edu.in",
                "Cloud Computing Masterclass",
                "Workshop",
                "2026-11-15",
                "09:30:00",
                "Tech Park Lab 402",
                101L
        );

        mockMvc.perform(post("/api/notifications/registration-confirmation")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.deliveryChannel").value("SIMULATED_EMAIL"))
                .andExpect(jsonPath("$.deliveryId").exists());
    }
}
