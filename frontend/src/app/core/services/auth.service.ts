import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '@models/user.model';
import { LoginCredentials } from '@models/credentials.model';
import { RegistrationCredentials } from '@models/registration.model';
import { TokenResponse } from '@models/token-response.model';
import { UserSchema, UserRegistrationSchema } from '@models/user.zod';
import { LoginCredentialsSchema } from '@models/credentials.zod';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'api/auth';
  private accessToken: string | null = null;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private validationService: ValidationService) {
    // Initialize token from localStorage on service creation
    this.initializeToken();
  }

  login(credentials: LoginCredentials): Observable<TokenResponse> {
    const validationResult = this.validationService.validate(LoginCredentialsSchema, credentials);
    if (!validationResult.success) {
      return throwError(() => validationResult.error);
    }

    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, validationResult.data).pipe(
      tap(response => {
        this.setToken(response.accessToken);
        this.setRefreshToken(response.refreshToken);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  register(user: RegistrationCredentials): Observable<User> {
    // Try different formats to see which one works
    const userData = {
      name: user.name,
      email: user.email,
      password: user.password
    };
    
    console.log('Sending registration data:', userData);
    
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    this.removeToken();
    this.removeRefreshToken();
    this.isAuthenticatedSubject.next(false);
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    // The backend endpoint /api/auth/refresh needs to be implemented
    return this.http.post<TokenResponse>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap(response => {
        this.setToken(response.accessToken);
      })
    );
  }

  private initializeToken(): void {
    const token = localStorage.getItem('accessToken');
    if (token && !this.isTokenExpired(token)) {
      this.accessToken = token;
    } else if (token) {
      // Token expired, remove it
      localStorage.removeItem('accessToken');
    }
  }

  private hasToken(): boolean {
    return !!this.accessToken;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      return Math.floor(new Date().getTime() / 1000) >= expiry;
    } catch {
      return true;
    }
  }

  setToken(token: string): void {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  getToken(): string | null {
    return this.accessToken;
  }

  removeToken(): void {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
  }

  // Refresh token remains in localStorage for now.
  // For production, it should be stored in a secure HttpOnly cookie handled by the backend.
  setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  removeRefreshToken(): void {
    localStorage.removeItem('refreshToken');
  }
}
