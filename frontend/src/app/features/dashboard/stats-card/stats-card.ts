import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  imports: [],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.scss'
})
export class StatsCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() description: string = '';
}
