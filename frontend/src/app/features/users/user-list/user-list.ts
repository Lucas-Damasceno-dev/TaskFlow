import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User } from '@models/user.model';
import { UserService, PaginatedResult } from '@core/services/user.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  paginatedResult!: PaginatedResult<User>;
  isLoading = true;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page: number = 1, pageSize: number = 10): void {
    this.isLoading = true;
    this.userService.getUsers(page, pageSize).subscribe({
      next: (result) => {
        this.paginatedResult = result;
        this.users = result.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  editUser(id: string): void {
    this.router.navigate(['/users/edit', id]);
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.notificationService.showNotification('User deleted successfully.', 'success');
          this.loadUsers(); // Reload the user list
        },
        error: (err) => {
          this.notificationService.showNotification('Failed to delete user.', 'error');
          console.error(err);
        }
      });
    }
  }
}
