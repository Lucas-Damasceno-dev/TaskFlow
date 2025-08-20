import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.scss']
})
export class TaskForm implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId: string | null = null;
  projectId: string | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      status: ['Pending', Validators.required] // Default status
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.taskId = this.route.snapshot.paramMap.get('id');

    if (this.taskId) {
      this.isEditMode = true;
      this.isLoading = true;
      this.taskService.getTask(this.taskId).subscribe({
        next: (task) => {
          this.taskForm.patchValue(task);
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load task data.';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    this.isLoading = true;
    const taskData = { ...this.taskForm.value, projectId: this.projectId };

    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, taskData).subscribe({ 
        next: () => this.router.navigate(['/projects', this.projectId]),
        error: (err) => {
          this.error = 'Failed to update task.';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.taskService.createTask(taskData).subscribe({
        next: (newTask) => this.router.navigate(['/projects', this.projectId]),
        error: (err) => {
          this.error = 'Failed to create task.';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }
}
