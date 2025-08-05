package com.lucasdamasceno.taskflow.taskflow_backend.dto;

import com.lucasdamasceno.taskflow.taskflow_backend.util.enums.ProjectStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ProjectSummaryDto {
    private Long id;
    private String name;
    private ProjectStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String ownerName;
    private Integer totalTasks;
    private Integer completedTasks;
    private Integer progressPercentage;
    private Integer totalMembers;
}
