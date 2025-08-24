import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';
import { Project } from '../../../models/project.model';
import { Task } from '../../../models/task.model';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from '../../tasks/task-list/task-list';
import { Websocket } from '../../../services/websocket';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule, RouterModule, TaskListComponent],
  templateUrl: './project-detail.html',
  styleUrls: ['./project-detail.scss']
})
export class ProjectDetail implements OnInit, OnDestroy {
  project: Project | null = null;
  tasks: Task[] = [];
  isLoading = true;
  private taskSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private taskService: TaskService,
    private websocket: Websocket
  ) { }

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProjectDetails(projectId);
      this.loadTasks(projectId);

      this.taskSubscription = this.websocket.tasks$.subscribe(task => {
        if (task && task.projectId === projectId) {
          this.loadTasks(projectId);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
  }

  loadProjectDetails(id: string): void {
    this.projectService.getProject(id).subscribe({
      next: (project) => {
        this.project = project;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadTasks(projectId: string): void {
    this.taskService.getTasks(projectId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      }
    });
  }

  handleTaskDeleted(taskId: string): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }
}
