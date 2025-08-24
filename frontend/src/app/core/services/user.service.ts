import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { User } from '../../models/user.model';
import { ValidationService } from './validation.service';
import { UserSchema } from '../../models/user.zod';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'api/users';

  constructor(private http: HttpClient, private validationService: ValidationService) { }

  getUsers(page: number = 1, pageSize: number = 10, name?: string): Observable<PaginatedResult<User>> {
    // Note: This is a client-side pagination and filtering simulation.
    // For a real application, this should be handled by the backend.
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        let filteredUsers = users;
        if (name) {
          filteredUsers = users.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));
        }

        const total = filteredUsers.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = filteredUsers.slice(startIndex, endIndex);
        return { data: paginatedData, total };
      })
    );
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    const validationResult = this.validationService.validate(UserSchema.partial(), user);
    if (!validationResult.success) {
        return throwError(() => validationResult.error);
    }

    return this.http.put<User>(`${this.apiUrl}/${id}`, validationResult.data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
