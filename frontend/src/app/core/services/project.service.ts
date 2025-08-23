import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Project } from '../../models/project.model';
import { ValidationService } from './validation.service';
import { ProjectSchema } from '../../models/project.zod';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'api/projects';

  constructor(private http: HttpClient, private validationService: ValidationService) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
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
