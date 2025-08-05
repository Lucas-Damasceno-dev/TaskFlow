package com.lucasdamasceno.taskflow.taskflow_backend.controller;

import com.lucasdamasceno.taskflow.taskflow_backend.dto.CreateProjectDto;
import com.lucasdamasceno.taskflow.taskflow_backend.dto.ProjectDto;
import com.lucasdamasceno.taskflow.taskflow_backend.dto.UpdateProjectDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody CreateProjectDto dto) {
        return null;
    }

    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        return null;
    }

    @GetMapping("/id")
    public ResponseEntity<ProjectDto> getProject(@PathVariable Long id) {
        return null;
    }

    @PutMapping("/id")
    public ResponseEntity<ProjectDto> updateProject(@PathVariable Long id, @RequestBody UpdateProjectDto dto) {
        return null;
    }

    @DeleteMapping("/id")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        return null;
    }
}
