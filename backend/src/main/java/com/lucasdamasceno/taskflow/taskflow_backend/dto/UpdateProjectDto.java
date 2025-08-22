package com.lucasdamasceno.taskflow.taskflow_backend.dto;

import com.lucasdamasceno.taskflow.taskflow_backend.util.enums.ProjectStatus;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class UpdateProjectDto {

    @Size(min = 3, max = 100, message = "Project name must be between 3 and 100 characters")
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    private LocalDate startDate;
    private LocalDate endDate;

    private ProjectStatus status;

    private List<Long> addMemberIds;
    private List<Long> removeMemberIds;

    @AssertTrue(message = "End date must be after start date")
    public boolean isEndDateValid() {
        if (startDate == null || endDate == null) {
            return true;
        }
        return endDate.isAfter(startDate);
    }
}