import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../models/project.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './project-form.html',
  styleUrls: ['./project-form.scss']
})
export class ProjectForm implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  projectId: string | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.isEditMode = true;
      this.isLoading = true;
      this.projectService.getProject(this.projectId).subscribe({
        next: (project) => {
          this.projectForm.patchValue(project);
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load project data.';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      return;
    }

    this.isLoading = true;
    const projectData = this.projectForm.value;

    if (this.isEditMode && this.projectId) {
      this.projectService.updateProject(this.projectId, projectData).subscribe({
        next: () => this.router.navigate(['/projects', this.projectId]),
        error: (err) => {
          this.error = 'Failed to update project.';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.projectService.createProject(projectData).subscribe({
        next: (newProject) => this.router.navigate(['/projects', newProject.id]),
        error: (err) => {
          this.error = 'Failed to create project.';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }
}
