package com.lucasdamasceno.taskflow.taskflow_backend.entity;

import com.lucasdamasceno.taskflow.taskflow_backend.util.enums.Priority;
import com.lucasdamasceno.taskflow.taskflow_backend.util.enums.TaskStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor @NoArgsConstructor
@Table(name = "tasks")
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @ManyToOne
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @FutureOrPresent
    private LocalDateTime dueDate;

    private Integer estimatedHours;

    private Integer actualHours;
}
