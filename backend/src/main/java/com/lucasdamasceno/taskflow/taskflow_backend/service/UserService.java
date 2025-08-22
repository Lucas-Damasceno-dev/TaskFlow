package com.lucasdamasceno.taskflow.taskflow_backend.service;

import com.lucasdamasceno.taskflow.taskflow_backend.dto.RegisterRequest;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.User;
import com.lucasdamasceno.taskflow.taskflow_backend.repository.UserRepository;
import com.lucasdamasceno.taskflow.taskflow_backend.util.enums.UserRole;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EntityExistsException("User with email " + request.getEmail() + " already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(UserRole.USER);

        return userRepository.save(user);
    }

    public User findUserById(Long id) throws EntityNotFoundException {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Carregando usuário com email: {}", username);
        return userRepository.findByEmail(username)
                .orElseThrow(() -> {
                    log.error("Usuário não encontrado com email: {}", username);
                    return new UsernameNotFoundException("User not found with email: " + username);
                });
    }
}
