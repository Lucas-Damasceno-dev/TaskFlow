package com.lucasdamasceno.taskflow.taskflow_backend.controller;

import com.lucasdamasceno.taskflow.taskflow_backend.dto.CreateTaskDto;
import com.lucasdamasceno.taskflow.taskflow_backend.dto.TaskDto;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.Task;
import com.lucasdamasceno.taskflow.taskflow_backend.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Endpoints for managing tasks")
public class TaskController {

    private final TaskService taskService;
    private final ModelMapper modelMapper;

    @PostMapping
    @Operation(summary = "Create a new task")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Task created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request body"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<TaskDto> createTask(@Valid @RequestBody CreateTaskDto dto) {
        Task task = taskService.createTask(dto);
        return new ResponseEntity<>(modelMapper.map(task, TaskDto.class), HttpStatus.CREATED);
    }
}
