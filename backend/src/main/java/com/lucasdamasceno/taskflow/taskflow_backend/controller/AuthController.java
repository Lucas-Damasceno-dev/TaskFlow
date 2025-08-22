package com.lucasdamasceno.taskflow.taskflow_backend.controller;

import com.lucasdamasceno.taskflow.taskflow_backend.dto.AuthRequest;
import com.lucasdamasceno.taskflow.taskflow_backend.dto.AuthResponse;
import com.lucasdamasceno.taskflow.taskflow_backend.dto.RegisterRequest;
import com.lucasdamasceno.taskflow.taskflow_backend.security.JwtTokenProvider;
import com.lucasdamasceno.taskflow.taskflow_backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Recebendo requisição de registro para o email: {}", request.getEmail());
        userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        log.info("Recebendo requisição de login para o usuário: {}", request.getUsername());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            final String jwt = jwtTokenProvider.generateToken(userDetails);

            log.info("Login bem-sucedido para o usuário: {}", request.getUsername());
            return ResponseEntity.ok(new AuthResponse(jwt));
        } catch (Exception e) {
            log.error("Erro durante a autenticação do usuário: {}", request.getUsername(), e);
            throw e;
        }
    }
}
