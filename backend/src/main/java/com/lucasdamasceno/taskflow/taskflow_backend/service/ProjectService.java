package com.lucasdamasceno.taskflow.taskflow_backend.service;

import com.lucasdamasceno.taskflow.taskflow_backend.dto.CreateProjectDto;
import com.lucasdamasceno.taskflow.taskflow_backend.dto.UpdateProjectDto;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.Project;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.User;
import com.lucasdamasceno.taskflow.taskflow_backend.repository.ProjectRepository;
import com.lucasdamasceno.taskflow.taskflow_backend.util.enums.ProjectStatus;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public Project createProject(CreateProjectDto createProjectDto, User owner) {
        Project project = new Project();
        project.setName(createProjectDto.getName());
        project.setDescription(createProjectDto.getDescription());
        project.setStartDate(createProjectDto.getStartDate());
        project.setEndDate(createProjectDto.getEndDate());
        project.setOwner(owner);
        project.setStatus(ProjectStatus.NOT_STARTED);

        return projectRepository.save(project);
    }

    public Project findProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + id));
    }

    public List<Project> findAllProjects() {
        return projectRepository.findAll();
    }

    public Project updateProject(Long id, UpdateProjectDto dto) {
        Project project = findProjectById(id);
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        project.setStatus(dto.getStatus());
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
