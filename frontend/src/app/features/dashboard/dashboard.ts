import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StatsCardComponent } from './stats-card/stats-card';
import { ProjectChartComponent } from './project-chart/project-chart';
import { BaseChartDirective } from 'ng2-charts';
import { ProgressWidget } from './progress-widget/progress-widget';
import { DateFilter } from './date-filter/date-filter'; // Import DateFilter

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: true,
  imports: [CommonModule, StatsCardComponent, ProjectChartComponent, BaseChartDirective, ProgressWidget, DateFilter] // Add DateFilter here
})
export class DashboardComponent {

  constructor(private authService: AuthService, private router: Router) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
