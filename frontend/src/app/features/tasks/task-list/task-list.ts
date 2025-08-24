import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../models/task.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.scss']
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() taskDeleted = new EventEmitter<string>();

  constructor(private taskService: TaskService) {}

  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.taskDeleted.emit(taskId);
        },
        error: (err) => {
          console.error('Failed to delete task:', err);
          // Optionally, show an error message to the user
        }
      });
    }
  }
}
