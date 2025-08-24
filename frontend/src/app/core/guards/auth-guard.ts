import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    // Check if user is authenticated
    return this.authService.isAuthenticated$.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          return of(true);
        } else {
          // If not authenticated, navigate to login
          this.router.navigate(['/auth/login']);
          return of(false);
        }
      })
    );
  }
}
