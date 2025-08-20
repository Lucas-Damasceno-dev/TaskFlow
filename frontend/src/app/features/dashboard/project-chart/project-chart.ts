import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Project } from '../../../models/project.model';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-project-chart',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './project-chart.html',
  styleUrl: './project-chart.scss'
})
export class ProjectChartComponent implements OnChanges {
  @Input() projects: Project[] = [];

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 0
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projects'] && this.projects) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    // Since Project model doesn't have status field, we'll create a simple count
    const projectCounts: { [key: string]: number } = {
      'Total Projects': this.projects.length
    };

    this.barChartData.labels = Object.keys(projectCounts);
    this.barChartData.datasets = [
      {
        data: Object.values(projectCounts),
        label: 'Number of Projects',
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ];

    // This is important to trigger chart update
    this.barChartData = { ...this.barChartData };
  }
}
