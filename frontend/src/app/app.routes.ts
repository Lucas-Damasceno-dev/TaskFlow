import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard';
import { ProjectList } from './features/projects/project-list/project-list';
import { ProjectForm } from './features/projects/project-form/project-form';
import { ProjectDetail } from './features/projects/project-detail/project-detail';
import { TaskForm } from './features/tasks/task-form/task-form';
import { UserListComponent } from './features/users/user-list/user-list';
import { UserEditComponent } from './features/users/user-edit/user-edit';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // Rotas públicas
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  
  // Rotas protegidas
  { path: '', redirectTo: 'dashboard', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'projects', component: ProjectList, canActivate: [AuthGuard] },
  { path: 'projects/new', component: ProjectForm, canActivate: [AuthGuard] },
  { path: 'projects/edit/:id', component: ProjectForm, canActivate: [AuthGuard] },
  { path: 'projects/:id', component: ProjectDetail, canActivate: [AuthGuard] },
  { path: 'projects/:projectId/tasks/new', component: TaskForm, canActivate: [AuthGuard] },
  { path: 'projects/:projectId/tasks/edit/:id', component: TaskForm, canActivate: [AuthGuard] },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'users/new', component: UserEditComponent, canActivate: [AuthGuard] },
  { path: 'users/edit/:id', component: UserEditComponent, canActivate: [AuthGuard] },
  
  // Rota curinga para páginas não encontradas
  { path: '**', redirectTo: 'dashboard' }
];
