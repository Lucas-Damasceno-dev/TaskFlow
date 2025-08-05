package com.lucasdamasceno.taskflow.taskflow_backend.dto;

import com.lucasdamasceno.taskflow.taskflow_backend.util.enums.ProjectStatus;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProjectDto {
    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long ownerId;
    private String ownerName;
    private String ownerEmail;

    private List<ProjectMemberDto> members;

    private Integer totalTasks;
    private Integer completedTasks;
    private Integer progressPercentage;

    @Data
    public static class ProjectMemberDto {
        private Long userId;
        private String firstName;
        private String lastName;
        private String email;
        private String role;
    }
}