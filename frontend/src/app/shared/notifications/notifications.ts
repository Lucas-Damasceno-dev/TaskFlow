import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss'
})
export class Notifications {
  constructor(public notificationService: NotificationService) {}

  get notification() {
    return this.notificationService.message;
  }

  get show() {
    return this.notificationService.show;
  }

  get status() {
    return this.notificationService.status;
  }
}
