import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-date-filter',
  imports: [FormsModule], // Add FormsModule here
  templateUrl: './date-filter.html',
  styleUrl: './date-filter.scss'
})
export class DateFilter {
  startDate: string = '';
  endDate: string = '';

  applyFilter() {
    console.log('Applying filter:', this.startDate, this.endDate);
    // Here you would typically emit an event or call a service to apply the filter
  }
}
