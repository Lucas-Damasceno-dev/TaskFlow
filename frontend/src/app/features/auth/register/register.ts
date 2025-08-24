import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistrationCredentials } from '../../../models/registration.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }

  register(): void {
    if (this.registerForm.invalid) {
      return;
    }

    // Extract only the fields needed for registration
    const { name, email, password } = this.registerForm.value;
    
    // Log the data being sent
    console.log('Registering user with data:', { name, email, password });

    this.authService.register({ name, email, password }).subscribe(
      () => {
        this.router.navigate(['/auth/login']);
      },
      (error: any) => {
        console.error('Registration failed:', error);
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }
}
