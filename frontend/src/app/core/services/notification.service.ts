import { Injectable, signal } from '@angular/core';

export type NotificationStatus = 'success' | 'error' | 'info' | 'warning';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  message = signal<string | null>(null);
  status = signal<NotificationStatus>('info');
  show = signal(false);

  showNotification(message: string, status: NotificationStatus = 'info') {
    this.message.set(message);
    this.status.set(status);
    this.show.set(true);

    setTimeout(() => {
      this.show.set(false);
    }, 4000);
  }
}
