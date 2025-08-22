import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-widget',
  imports: [],
  templateUrl: './progress-widget.html',
  styleUrl: './progress-widget.scss'
})
export class ProgressWidget {
  @Input() progress: number = 0;
}
