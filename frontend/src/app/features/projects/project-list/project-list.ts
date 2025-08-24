import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../core/services/project.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from '../../../shared/pagination/pagination';
import { FormsModule } from '@angular/forms';
import { Websocket } from '../../../services/websocket';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-list',
  imports: [CommonModule, RouterModule, PaginationComponent, FormsModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss'
})
export class ProjectList implements OnInit, OnDestroy {
  projects: Project[] = [];
  isLoading = true;
  error: string | null = null;
  currentPage = 1;
  pageSize = 10;
  totalProjects = 0;
  nameFilter: string = '';
  private projectSubscription: Subscription | undefined;

  constructor(private projectService: ProjectService, private websocket: Websocket) { }

  ngOnInit(): void {
    this.loadProjects();
    this.projectSubscription = this.websocket.projects$.subscribe(project => {
      if (project) {
        this.loadProjects();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.projectSubscription) {
      this.projectSubscription.unsubscribe();
    }
  }

  loadProjects(): void {
    this.isLoading = true;
    this.projectService.getProjects(this.currentPage, this.pageSize, this.nameFilter).subscribe({
      next: (result) => {
        this.projects = result.data;
        this.totalProjects = result.total;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load projects.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  applyFilter(): void {
    this.currentPage = 1;
    this.loadProjects();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProjects();
  }

  deleteProject(id: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.loadProjects(); // Reload projects after deletion
        },
        error: (err) => {
          this.error = 'Failed to delete project.';
          console.error(err);
        }
      });
    }
  }
}
