package com.lucasdamasceno.taskflow.taskflow_backend.service;

import com.lucasdamasceno.taskflow.taskflow_backend.entity.User;
import com.lucasdamasceno.taskflow.taskflow_backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
    }
}
