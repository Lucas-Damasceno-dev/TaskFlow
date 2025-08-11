package com.lucasdamasceno.taskflow.taskflow_backend.service;

import com.lucasdamasceno.taskflow.taskflow_backend.dto.CreateProjectDto;
import com.lucasdamasceno.taskflow.taskflow_backend.dto.ProjectDto;
import com.lucasdamasceno.taskflow.taskflow_backend.dto.ProjectSummaryDto;
import com.lucasdamasceno.taskflow.taskflow_backend.dto.UpdateProjectDto;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.Project;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.User;
import com.lucasdamasceno.taskflow.taskflow_backend.repository.ProjectRepository;
import com.lucasdamasceno.taskflow.taskflow_backend.util.enums.ProjectStatus;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ModelMapper modelMapper;

    public Project createProject(CreateProjectDto createProjectDto, User owner) {
        Project project = modelMapper.map(createProjectDto, Project.class);
        project.setOwner(owner);
        project.setStatus(ProjectStatus.PLANNING);

        return projectRepository.save(project);
    }

    public Project findProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + id));
    }

    public List<Project> findAllProjects() {
        return projectRepository.findAll();
    }

    public Project updateProject(Long id, UpdateProjectDto dto, User user) {
        Project project = findProjectById(id);
        if (!isOwner(user, project)) {
            throw new AccessDeniedException("You are not the owner of this project.");
        }
        modelMapper.map(dto, project);
        return projectRepository.save(project);
    }

    public void deleteProject(Long id, User user) {
        Project project = findProjectById(id);
        if (!isOwner(user, project)) {
            throw new AccessDeniedException("You are not the owner of this project.");
        }
        projectRepository.deleteById(id);
    }

    private boolean isOwner(User user, Project project) {
        return project.getOwner().getId().equals(user.getId());
    }

    public ProjectDto toProjectDto(Project project) {
        return modelMapper.map(project, ProjectDto.class);
    }

    public ProjectSummaryDto toProjectSummaryDto(Project project) {
        return modelMapper.map(project, ProjectSummaryDto.class);
    }
}
