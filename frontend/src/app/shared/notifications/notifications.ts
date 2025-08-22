import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Websocket } from '../../services/websocket';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss'
})
export class Notifications {
  notification = signal<string | null>(null);
  show = signal(false);

  constructor(private ws: Websocket) {
    effect(() => {
      this.ws.notifications$.subscribe(msg => {
        if (msg) {
          this.notification.set(msg);
          this.show.set(true);
          setTimeout(() => this.show.set(false), 4000);
        }
      });
    });
  }
}
