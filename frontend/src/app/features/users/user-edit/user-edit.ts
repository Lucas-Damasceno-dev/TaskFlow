import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '@models/user.model';
import { UserService } from '@core/services/user.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.html',
  styleUrls: ['./user-edit.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class UserEditComponent implements OnInit {
  userForm!: FormGroup;
  user!: User;
  isNewUser = false;
  isLoading = true;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isNewUser = !id;

    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    if (!this.isNewUser) {
      this.loadUser(id!);
    }
  }

  loadUser(id: string): void {
    this.isLoading = true;
    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.user = user;
        this.userForm.patchValue(user);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      return;
    }

    const userData = this.userForm.value;

    if (this.isNewUser) {
      // Create new user logic (not implemented in the service yet)
      this.notificationService.showNotification('Create user functionality not implemented yet.', 'error');
    } else {
      this.userService.updateUser(this.user.id, userData).subscribe({
        next: () => {
          this.notificationService.showNotification('User updated successfully.', 'success');
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.notificationService.showNotification('Failed to update user.', 'error');
          console.error(err);
        }
      });
    }
  }
}
