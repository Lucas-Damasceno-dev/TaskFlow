package com.lucasdamasceno.taskflow.taskflow_backend.dto;

import com.lucasdamasceno.taskflow.taskflow_backend.util.enums.Priority;
import com.lucasdamasceno.taskflow.taskflow_backend.util.enums.TaskStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateTaskDto {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private TaskStatus status;

    @NotNull
    private Priority priority;

    private Long assigneeId;

    @NotNull
    private Long projectId;

    @FutureOrPresent
    private LocalDateTime dueDate;

    private Integer estimatedHours;
}
