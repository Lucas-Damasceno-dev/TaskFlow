package com.lucasdamasceno.taskflow.taskflow_backend.service;

import com.lucasdamasceno.taskflow.taskflow_backend.dto.CreateTaskDto;
import com.lucasdamasceno.taskflow.taskflow_backend.dto.TaskDto;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.Task;
import com.lucasdamasceno.taskflow.taskflow_backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final UserService userService;
    private final ModelMapper modelMapper;

    public Task createTask(CreateTaskDto createTaskDto) {
        Task task = modelMapper.map(createTaskDto, Task.class);

        if (createTaskDto.getAssigneeId() != null) {
            task.setAssignee(userService.findUserById(createTaskDto.getAssigneeId()));
        }

        task.setProject(projectService.findProjectById(createTaskDto.getProjectId()));

        return taskRepository.save(task);
    }

    public TaskDto toTaskDto(Task task) {
        return modelMapper.map(task, TaskDto.class);
    }
}
