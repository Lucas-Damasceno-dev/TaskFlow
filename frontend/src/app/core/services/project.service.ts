import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { Project } from '../../models/project.model';
import { ValidationService } from './validation.service';
import { ProjectSchema } from '../../models/project.zod';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'api/projects';

  constructor(private http: HttpClient, private validationService: ValidationService) { }

  getProjects(page: number = 1, pageSize: number = 10, name?: string): Observable<PaginatedResult<Project>> {
    // Note: This is a client-side pagination and filtering simulation.
    // For a real application, this should be handled by the backend.
    return this.http.get<Project[]>(this.apiUrl).pipe(
      map(projects => {
        let filteredProjects = projects;
        if (name) {
          filteredProjects = projects.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
        }

        const total = filteredProjects.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = filteredProjects.slice(startIndex, endIndex);
        return { data: paginatedData, total };
      })
    );
  }

  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  createProject(project: Omit<Project, 'id'>): Observable<Project> {
    const validationResult = this.validationService.validate(ProjectSchema.omit({ id: true }), project);
    if (!validationResult.success) {
      return throwError(() => validationResult.error);
    }

    return this.http.post<Project>(this.apiUrl, validationResult.data);
  }

  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    const validationResult = this.validationService.validate(ProjectSchema.partial(), project);
    if (!validationResult.success) {
        return throwError(() => validationResult.error);
    }

    return this.http.put<Project>(`${this.apiUrl}/${id}`, validationResult.data);
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
