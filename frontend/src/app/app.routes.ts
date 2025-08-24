import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard';
import { ProjectList } from './features/projects/project-list/project-list';
import { ProjectForm } from './features/projects/project-form/project-form';
import { ProjectDetail } from './features/projects/project-detail/project-detail';
import { TaskForm } from './features/tasks/task-form/task-form';
import { UserListComponent } from './features/users/user-list/user-list';
import { UserEditComponent } from './features/users/user-edit/user-edit';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'projects', component: ProjectList },
  { path: 'projects/new', component: ProjectForm },
  { path: 'projects/edit/:id', component: ProjectForm },
  { path: 'projects/:id', component: ProjectDetail },
  { path: 'projects/:projectId/tasks/new', component: TaskForm },
  { path: 'projects/:projectId/tasks/edit/:id', component: TaskForm },
  { path: 'users', component: UserListComponent },
  { path: 'users/new', component: UserEditComponent },
  { path: 'users/edit/:id', component: UserEditComponent },
];
