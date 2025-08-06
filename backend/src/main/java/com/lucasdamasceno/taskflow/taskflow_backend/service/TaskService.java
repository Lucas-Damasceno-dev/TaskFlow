package com.lucasdamasceno.taskflow.taskflow_backend.service;

import com.lucasdamasceno.taskflow.taskflow_backend.dto.CreateTaskDto;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.Task;
import com.lucasdamasceno.taskflow.taskflow_backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final UserService userService;

    public Task createTask(CreateTaskDto createTaskDto) {
        Task task = new Task();
        task.setTitle(createTaskDto.getTitle());
        task.setDescription(createTaskDto.getDescription());
        task.setStatus(createTaskDto.getStatus());
        task.setPriority(createTaskDto.getPriority());
        task.setDueDate(createTaskDto.getDueDate());
        task.setEstimatedHours(createTaskDto.getEstimatedHours());

        if (createTaskDto.getAssigneeId() != null) {
            task.setAssignee(userService.findUserById(createTaskDto.getAssigneeId()));
        }

        task.setProject(projectService.findProjectById(createTaskDto.getProjectId()));

        return taskRepository.save(task);
    }
}
