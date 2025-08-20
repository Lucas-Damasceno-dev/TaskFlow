import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginCredentials } from '../../../models/credentials.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value as LoginCredentials).subscribe(
      () => {
        this.router.navigate(['/dashboard']);
      },
      (error: any) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    );
  }
}
