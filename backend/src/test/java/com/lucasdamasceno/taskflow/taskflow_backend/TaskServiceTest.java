package com.lucasdamasceno.taskflow.taskflow_backend;

import com.lucasdamasceno.taskflow.taskflow_backend.dto.CreateTaskDto;
import com.lucasdamasceno.taskflow.taskflow_backend.dto.TaskDto;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.Project;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.Task;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.User;
import com.lucasdamasceno.taskflow.taskflow_backend.repository.TaskRepository;
import com.lucasdamasceno.taskflow.taskflow_backend.service.ProjectService;
import com.lucasdamasceno.taskflow.taskflow_backend.service.TaskService;
import com.lucasdamasceno.taskflow.taskflow_backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectService projectService;

    @Mock
    private UserService userService;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private TaskService taskService;

    private CreateTaskDto createTaskDto;
    private Task task;
    private Project project;
    private User assignee;

    @BeforeEach
    void setUp() {
        project = new Project();
        project.setId(1L);
        project.setName("Test Project");

        assignee = new User();
        assignee.setId(2L);
        assignee.setEmail("assignee@example.com");

        createTaskDto = new CreateTaskDto();
        createTaskDto.setTitle("Test Task");
        createTaskDto.setDescription("Task Description");
        createTaskDto.setProjectId(1L);
        createTaskDto.setAssigneeId(2L);

        task = new Task();
        task.setId(1L);
        task.setTitle("Test Task");
        task.setDescription("Task Description");
        task.setProject(project);
        task.setAssignee(assignee);
    }

    @Test
    void createTask_shouldSaveAndReturnTask_withAssignee() {
        when(modelMapper.map(createTaskDto, Task.class)).thenReturn(task);
        when(userService.findUserById(createTaskDto.getAssigneeId())).thenReturn(assignee);
        when(projectService.findProjectById(createTaskDto.getProjectId())).thenReturn(project);
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        Task result = taskService.createTask(createTaskDto);

        assertNotNull(result);
        assertEquals(task.getTitle(), result.getTitle());
        assertEquals(task.getProject(), result.getProject());
        assertEquals(task.getAssignee(), result.getAssignee());
        verify(userService, times(1)).findUserById(createTaskDto.getAssigneeId());
        verify(projectService, times(1)).findProjectById(createTaskDto.getProjectId());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void createTask_shouldSaveAndReturnTask_withoutAssignee() {
        createTaskDto.setAssigneeId(null);
        task.setAssignee(null);

        when(modelMapper.map(createTaskDto, Task.class)).thenReturn(task);
        when(projectService.findProjectById(createTaskDto.getProjectId())).thenReturn(project);
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        Task result = taskService.createTask(createTaskDto);

        assertNotNull(result);
        assertEquals(task.getTitle(), result.getTitle());
        assertEquals(task.getProject(), result.getProject());
        assertNull(result.getAssignee());
        verify(userService, never()).findUserById(anyLong());
        verify(projectService, times(1)).findProjectById(createTaskDto.getProjectId());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void toTaskDto_shouldReturnTaskDto() {
        TaskDto taskDto = new TaskDto();
        taskDto.setTitle(task.getTitle());

        when(modelMapper.map(task, TaskDto.class)).thenReturn(taskDto);

        TaskDto result = taskService.toTaskDto(task);

        assertNotNull(result);
        assertEquals(task.getTitle(), result.getTitle());
        verify(modelMapper, times(1)).map(task, TaskDto.class);
    }
}
