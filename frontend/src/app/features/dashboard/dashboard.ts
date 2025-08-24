import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StatsCardComponent } from './stats-card/stats-card';
import { ProjectChartComponent } from './project-chart/project-chart';
import { ProgressWidget } from './progress-widget/progress-widget';
import { DateFilter } from './date-filter/date-filter';
import { ProjectService } from '@core/services/project.service';
import { TaskService } from '@core/services/task.service';
import { Project } from '@models/project.model';
import { Task } from '@models/task.model';
import { forkJoin, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: true,
  imports: [CommonModule, StatsCardComponent, ProjectChartComponent, ProgressWidget, DateFilter]
})
export class DashboardComponent implements OnInit {
  totalProjects: number = 0;
  pendingTasks: number = 0;
  completedTasks: number = 0;
  projects: Project[] = [];
  tasks: Task[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private projectService: ProjectService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.projectService.getProjects().pipe(
      mergeMap(paginatedResult => {
        this.projects = paginatedResult.data;
        this.totalProjects = paginatedResult.total;

        if (this.projects.length === 0) {
          return of([]); // No projects, so no tasks
        }

        const taskObservables = this.projects.map(project =>
          this.taskService.getTasks(project.id).pipe(
            catchError(err => {
              console.error(`Failed to load tasks for project ${project.id}:`, err);
              return of([]); // Return empty array on error to not break the stream
            })
          )
        );
        return forkJoin(taskObservables);
      }),
      map(tasksArray => {
        this.tasks = tasksArray.flat(); // Flatten the array of arrays into a single array
        // Corrigindo a comparação de status - usando o tipo correto
        this.pendingTasks = this.tasks.filter(task => task.status !== 'done').length;
        this.completedTasks = this.tasks.filter(task => task.status === 'done').length;
        this.isLoading = false;
      }),
      catchError(err => {
        this.error = 'Failed to load dashboard data.';
        this.isLoading = false;
        console.error(err);
        return of(null); // Return null to complete the observable
      })
    ).subscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

