package com.lucasdamasceno.taskflow.taskflow_backend.repository;

import com.lucasdamasceno.taskflow.taskflow_backend.entity.Project;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.Task;
import com.lucasdamasceno.taskflow.taskflow_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProject(Project project);

    List<Task> findByAssignee(User assignee);
}
