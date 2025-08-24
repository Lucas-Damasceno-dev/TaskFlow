import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Task } from '../../../models/task.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, RouterModule, DragDropModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.scss']
})
export class TaskListComponent implements OnChanges {
  @Input() tasks: Task[] = [];
  @Output() taskDeleted = new EventEmitter<string>();
  @Output() taskStatusChanged = new EventEmitter<{ taskId: string; newStatus: Task['status'] }>();

  // Group tasks by status
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  inReviewTasks: Task[] = [];
  doneTasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnChanges() {
    // When tasks input changes, reorganize them by status
    this.organizeTasksByStatus();
  }

  organizeTasksByStatus() {
    this.todoTasks = this.tasks.filter(task => task.status === 'todo');
    this.inProgressTasks = this.tasks.filter(task => task.status === 'inprogress');
    this.inReviewTasks = this.tasks.filter(task => task.status === 'inreview');
    this.doneTasks = this.tasks.filter(task => task.status === 'done');
  }

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

  onTaskDrop(event: CdkDragDrop<Task[]>, newStatus: Task['status']) {
    if (event.previousContainer === event.container) {
      // Reorder within the same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Move task between columns
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      // Update task status
      const task = event.container.data[event.currentIndex];
      this.updateTaskStatus(task.id, newStatus);
    }
  }

  updateTaskStatus(taskId: string, newStatus: Task['status']) {
    this.taskService.updateTask(taskId, { status: newStatus }).subscribe({
      next: (updatedTask) => {
        this.taskStatusChanged.emit({ taskId, newStatus });
      },
      error: (err) => {
        console.error('Failed to update task status:', err);
        // Revert the change in UI if the API call fails
        this.organizeTasksByStatus(); // This will reset the arrays to their correct state
      }
    });
  }

  getStatusDisplayName(status: Task['status']): string {
    const statusMap: Record<Task['status'], string> = {
      'todo': 'To Do',
      'inprogress': 'In Progress',
      'inreview': 'In Review',
      'done': 'Done'
    };
    return statusMap[status];
  }
}
