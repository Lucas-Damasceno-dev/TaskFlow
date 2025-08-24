package com.lucasdamasceno.taskflow.taskflow_backend.controller;

import com.lucasdamasceno.taskflow.taskflow_backend.dto.CreateProjectDto;
import com.lucasdamasceno.taskflow.taskflow_backend.dto.ProjectDto;
import com.lucasdamasceno.taskflow.taskflow_backend.dto.UpdateProjectDto;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.Project;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.User;
import com.lucasdamasceno.taskflow.taskflow_backend.service.ProjectService;
import com.lucasdamasceno.taskflow.taskflow_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Endpoints for managing projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService;
    private final ModelMapper modelMapper;

    @PostMapping
    @Operation(summary = "Create a new project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Project created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request body"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<ProjectDto> createProject(@Valid @RequestBody CreateProjectDto dto, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User owner = (User) userService.loadUserByUsername(userDetails.getUsername());
        Project project = projectService.createProject(dto, owner);
        return new ResponseEntity<>(modelMapper.map(project, ProjectDto.class), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all projects")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of projects"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        List<Project> projects = projectService.findAllProjects();
        List<ProjectDto> projectDtos = projects.stream()
                .map(project -> modelMapper.map(project, ProjectDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(projectDtos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a project by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved project"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ProjectDto> getProject(@PathVariable Long id) {
        Project project = projectService.findProjectById(id);
        return ResponseEntity.ok(modelMapper.map(project, ProjectDto.class));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request body"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ProjectDto> updateProject(@PathVariable Long id, @Valid @RequestBody UpdateProjectDto dto, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = (User) userService.loadUserByUsername(userDetails.getUsername());
        Project project = projectService.updateProject(id, dto, user);
        return ResponseEntity.ok(modelMapper.map(project, ProjectDto.class));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Project deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<Void> deleteProject(@PathVariable Long id, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = (User) userService.loadUserByUsername(userDetails.getUsername());
        projectService.deleteProject(id, user);
        return ResponseEntity.noContent().build();
    }
}
