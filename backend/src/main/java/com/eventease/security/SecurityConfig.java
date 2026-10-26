package com.eventease.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public authentication endpoints & dev tools
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()

                        // Public event discovery and landing page stats
                        .requestMatchers(HttpMethod.GET, "/api/events/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reports/overview").permitAll()

                        // Admin-only endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/dashboard/admin").hasRole("ADMIN")

                        // Organizer endpoints
                        .requestMatchers(HttpMethod.POST, "/api/events").hasAnyRole("ORGANISER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/events/*").hasAnyRole("ORGANISER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/events/*").hasAnyRole("ORGANISER", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/events/*/status").hasAnyRole("ORGANISER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/events/*/registrations").hasAnyRole("ORGANISER", "ADMIN")
                        .requestMatchers("/api/events/*/attendance/**").hasAnyRole("ORGANISER", "ADMIN")
                        .requestMatchers("/api/dashboard/organizer").hasAnyRole("ORGANISER", "ADMIN")

                        // Student endpoints
                        .requestMatchers(HttpMethod.POST, "/api/events/*/registrations").hasRole("STUDENT")
                        .requestMatchers("/api/registrations/me").hasRole("STUDENT")
                        .requestMatchers("/api/dashboard/student").hasRole("STUDENT")

                        // Registration cancellation & attendance updating
                        .requestMatchers(HttpMethod.PATCH, "/api/registrations/*/cancel").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/registrations/*/attendance").hasAnyRole("ORGANISER", "ADMIN")

                        // Reports
                        .requestMatchers("/api/reports/**").hasAnyRole("ORGANISER", "ADMIN")

                        // Any other request must be authenticated
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
