import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';
import { Project } from '../../../models/project.model';
import { Task } from '../../../models/task.model';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from '../../tasks/task-list/task-list';

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule, RouterModule, TaskListComponent],
  templateUrl: './project-detail.html',
  styleUrls: ['./project-detail.scss']
})
export class ProjectDetail implements OnInit {
  project: Project | null = null;
  tasks: Task[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProjectDetails(projectId);
      this.loadTasks(projectId);
    }
  }

  loadProjectDetails(id: string): void {
    this.projectService.getProject(id).subscribe({
      next: (project) => {
        this.project = project;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load project details.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  loadTasks(projectId: string): void {
    this.taskService.getTasks(projectId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (err) => {
        // Handle task loading error separately if needed
        console.error('Failed to load tasks:', err);
      }
    });
  }

  handleTaskDeleted(taskId: string): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }
}
