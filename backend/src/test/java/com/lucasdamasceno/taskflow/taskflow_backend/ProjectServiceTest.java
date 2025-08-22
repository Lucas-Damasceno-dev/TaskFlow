package com.lucasdamasceno.taskflow.taskflow_backend;

import com.lucasdamasceno.taskflow.taskflow_backend.dto.CreateProjectDto;
import com.lucasdamasceno.taskflow.taskflow_backend.dto.UpdateProjectDto;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.Project;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.User;
import com.lucasdamasceno.taskflow.taskflow_backend.repository.ProjectRepository;
import com.lucasdamasceno.taskflow.taskflow_backend.service.ProjectService;
import com.lucasdamasceno.taskflow.taskflow_backend.util.enums.ProjectStatus;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private ProjectService projectService;

    private User owner;
    private Project project;
    private CreateProjectDto createProjectDto;
    private UpdateProjectDto updateProjectDto;

    @BeforeEach
    void setUp() {
        owner = new User();
        owner.setId(1L);
        owner.setEmail("owner@example.com");

        project = new Project();
        project.setId(1L);
        project.setName("Test Project");
        project.setOwner(owner);
        project.setStatus(ProjectStatus.PLANNING);

        createProjectDto = new CreateProjectDto();
        createProjectDto.setName("New Project");
        createProjectDto.setDescription("Description for new project");

        updateProjectDto = new UpdateProjectDto();
        updateProjectDto.setName("Updated Project");
        updateProjectDto.setDescription("Updated description");
    }

    @Test
    void createProject_shouldSaveAndReturnProject() {
        when(modelMapper.map(createProjectDto, Project.class)).thenReturn(project);
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        Project result = projectService.createProject(createProjectDto, owner);

        assertNotNull(result);
        assertEquals(project.getName(), result.getName());
        assertEquals(owner, result.getOwner());
        assertEquals(ProjectStatus.PLANNING, result.getStatus());
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void findProjectById_shouldReturnProject_whenProjectExists() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));

        Project foundProject = projectService.findProjectById(1L);

        assertNotNull(foundProject);
        assertEquals(project.getId(), foundProject.getId());
        verify(projectRepository, times(1)).findById(1L);
    }

    @Test
    void findProjectById_shouldThrowEntityNotFoundException_whenProjectDoesNotExist() {
        when(projectRepository.findById(2L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(EntityNotFoundException.class, () -> {
            projectService.findProjectById(2L);
        });

        assertEquals("Project not found with id: 2", exception.getMessage());
        verify(projectRepository, times(1)).findById(2L);
    }

    @Test
    void findAllProjects_shouldReturnListOfProjects() {
        List<Project> projects = Arrays.asList(project, new Project());
        when(projectRepository.findAll()).thenReturn(projects);

        List<Project> foundProjects = projectService.findAllProjects();

        assertNotNull(foundProjects);
        assertEquals(2, foundProjects.size());
        verify(projectRepository, times(1)).findAll();
    }

    @Test
    void updateProject_shouldUpdateAndReturnProject_whenProjectExists() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenReturn(project);
        doNothing().when(modelMapper).map(updateProjectDto, project);

        Project updatedProject = projectService.updateProject(1L, updateProjectDto, owner);

        assertNotNull(updatedProject);
        verify(projectRepository, times(1)).findById(1L);
        verify(modelMapper, times(1)).map(updateProjectDto, project);
        verify(projectRepository, times(1)).save(project);
    }

    @Test
    void updateProject_shouldThrowEntityNotFoundException_whenProjectDoesNotExist() {
        when(projectRepository.findById(2L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(EntityNotFoundException.class, () -> {
            projectService.updateProject(2L, updateProjectDto, owner);
        });

        assertEquals("Project not found with id: 2", exception.getMessage());
        verify(projectRepository, times(1)).findById(2L);
        verify(modelMapper, never()).map(any(), any());
        verify(projectRepository, never()).save(any());
    }

    @Test
    void deleteProject_shouldDeleteProject() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));

        projectService.deleteProject(1L, owner);

        verify(projectRepository, times(1)).deleteById(1L);
    }
}