package com.lucasdamasceno.taskflow.taskflow_backend;

import com.lucasdamasceno.taskflow.taskflow_backend.entity.User;
import com.lucasdamasceno.taskflow.taskflow_backend.repository.UserRepository;
import com.lucasdamasceno.taskflow.taskflow_backend.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void findUserById_shouldReturnUser_whenUserExists() {
        Long userId = 1L;
        User user = new User();
        user.setId(userId);
        user.setEmail("test@example.com");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        User foundUser = userService.findUserById(userId);

        assertNotNull(foundUser);
        assertEquals(userId, foundUser.getId());
        assertEquals("test@example.com", foundUser.getEmail());
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    void findUserById_shouldThrowEntityNotFoundException_whenUserDoesNotExist() {
        Long userId = 1L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(EntityNotFoundException.class, () -> {
            userService.findUserById(userId);
        });

        assertEquals("User not found with id: " + userId, exception.getMessage());
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    void loadUserByUsername_shouldReturnUserDetails_whenUserExists() {
        String email = "test@example.com";
        User user = new User();
        user.setId(1L);
        user.setEmail(email);
        user.setPassword("password"); // Password is required for UserDetails

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        User foundUser = (User) userService.loadUserByUsername(email);

        assertNotNull(foundUser);
        assertEquals(email, foundUser.getUsername());
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    void loadUserByUsername_shouldThrowUsernameNotFoundException_whenUserDoesNotExist() {
        String email = "nonexistent@example.com";

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        Exception exception = assertThrows(UsernameNotFoundException.class, () -> {
            userService.loadUserByUsername(email);
        });

        assertEquals("User not found with email: " + email, exception.getMessage());
        verify(userRepository, times(1)).findByEmail(email);
    }
}
