package com.lucasdamasceno.taskflow.taskflow_backend.entity;

import com.lucasdamasceno.taskflow.taskflow_backend.util.enums.Priority;
import com.lucasdamasceno.taskflow.taskflow_backend.util.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor @NoArgsConstructor
@Table(name = "tasks")
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    @Enumerated(EnumType.STRING)
    private TaskStatus status;
    @Enumerated(EnumType.STRING)
    private Priority priority;
    @ManyToOne
    @JoinColumn(name = "assignee_id")
    private User assignee;
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    private LocalDateTime createdAt;
    private LocalDateTime dueDate;
    private Integer estimatedHours;
    private Integer actualHours;
}
