package com.lucasdamasceno.taskflow.taskflow_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lucasdamasceno.taskflow.taskflow_backend.dto.CreateProjectDto;
import com.lucasdamasceno.taskflow.taskflow_backend.dto.UpdateProjectDto;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.Project;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.User;
import com.lucasdamasceno.taskflow.taskflow_backend.repository.ProjectRepository;
import com.lucasdamasceno.taskflow.taskflow_backend.repository.UserRepository;
import com.lucasdamasceno.taskflow.taskflow_backend.util.enums.ProjectStatus;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        projectRepository.deleteAll();
        userRepository.deleteAll();

        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setPassword("password"); // In a real app, this would be encoded
        testUser = userRepository.save(testUser);
    }

    @AfterEach
    void tearDown() {
        projectRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void createProject_shouldReturnCreatedProject() throws Exception {
        CreateProjectDto dto = new CreateProjectDto();
        dto.setName("New Project");
        dto.setDescription("Description for new project");

        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("New Project")))
                .andExpect(jsonPath("$.description", is("Description for new project")))
                .andExpect(jsonPath("$.status", is(ProjectStatus.PLANNING.toString())));
    }

    @Test
    void getAllProjects_shouldReturnListOfProjects() throws Exception {
        Project project1 = new Project();
        project1.setName("Project 1");
        project1.setOwner(testUser);
        project1.setStatus(ProjectStatus.PLANNING);
        projectRepository.save(project1);

        Project project2 = new Project();
        project2.setName("Project 2");
        project2.setOwner(testUser);
        project2.setStatus(ProjectStatus.IN_PROGRESS);
        projectRepository.save(project2);

        mockMvc.perform(get("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.*", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Project 1")))
                .andExpect(jsonPath("$[1].name", is("Project 2")));
    }

    @Test
    void getProject_shouldReturnProjectById() throws Exception {
        Project project = new Project();
        project.setName("Single Project");
        project.setOwner(testUser);
        project.setStatus(ProjectStatus.COMPLETED);
        project = projectRepository.save(project);

        mockMvc.perform(get("/api/projects/{id}", project.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Single Project")))
                .andExpect(jsonPath("$.status", is(ProjectStatus.COMPLETED.toString())));
    }

    @Test
    void updateProject_shouldUpdateProject() throws Exception {
        Project project = new Project();
        project.setName("Old Project Name");
        project.setOwner(testUser);
        project.setStatus(ProjectStatus.PLANNING);
        project = projectRepository.save(project);

        UpdateProjectDto dto = new UpdateProjectDto();
        dto.setName("Updated Project Name");
        dto.setDescription("Updated Description");
        dto.setStatus(ProjectStatus.IN_PROGRESS);

        mockMvc.perform(put("/api/projects/{id}", project.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Project Name")))
                .andExpect(jsonPath("$.description", is("Updated Description")))
                .andExpect(jsonPath("$.status", is(ProjectStatus.IN_PROGRESS.toString())));
    }

    @Test
    void deleteProject_shouldDeleteProject() throws Exception {
        Project project = new Project();
        project.setName("Project to Delete");
        project.setOwner(testUser);
        project.setStatus(ProjectStatus.PLANNING);
        project = projectRepository.save(project);

        mockMvc.perform(delete("/api/projects/{id}", project.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/projects/{id}", project.getId()))
                .andExpect(status().isNotFound());
    }
}
