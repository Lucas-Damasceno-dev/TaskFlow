package com.lucasdamasceno.taskflow.taskflow_backend.dto;

import com.lucasdamasceno.taskflow.taskflow_backend.util.enums.Priority;
import com.lucasdamasceno.taskflow.taskflow_backend.util.enums.TaskStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskDto {

    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private Long assigneeId;
    private Long projectId;
    private LocalDateTime createdAt;
    private LocalDateTime dueDate;
    private Integer estimatedHours;
    private Integer actualHours;
}
