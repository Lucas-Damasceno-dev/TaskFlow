import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Task } from '../../models/task.model';
import { ValidationService } from './validation.service';
import { TaskSchema } from '../../models/task.zod';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'api/tasks';

  constructor(private http: HttpClient, private validationService: ValidationService) { }

  getTasks(projectId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}?projectId=${projectId}`);
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    const validationResult = this.validationService.validate(TaskSchema.omit({ id: true }), task);
    if (!validationResult.success) {
      return throwError(() => validationResult.error);
    }

    return this.http.post<Task>(this.apiUrl, validationResult.data);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    const validationResult = this.validationService.validate(TaskSchema.partial(), task);
    if (!validationResult.success) {
      return throwError(() => validationResult.error);
    }

    return this.http.put<Task>(`${this.apiUrl}/${id}`, validationResult.data);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
