package com.lucasdamasceno.taskflow.taskflow_backend.controller;

import com.lucasdamasceno.taskflow.taskflow_backend.dto.AuthRequest;
import com.lucasdamasceno.taskflow.taskflow_backend.dto.AuthResponse;
import com.lucasdamasceno.taskflow.taskflow_backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthController authController;

    private AuthRequest authRequest;
    private UserDetails userDetails;
    private String jwtToken;

    @BeforeEach
    void setUp() {
        authRequest = new AuthRequest();
        authRequest.setUsername("test@example.com");
        authRequest.setPassword("password");
        userDetails = new User("test@example.com", "password", java.util.Collections.emptyList());
        jwtToken = "mocked.jwt.token";
    }

    @Test
    void login_shouldReturnAuthResponseWithJwtToken_whenAuthenticationSuccessful() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtTokenProvider.generateToken(userDetails)).thenReturn(jwtToken);

        ResponseEntity<AuthResponse> response = authController.login(authRequest);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(jwtToken, response.getBody().getToken());
    }
}