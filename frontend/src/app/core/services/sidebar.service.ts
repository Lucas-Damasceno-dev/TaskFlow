import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isOpen = signal(true);

  get isOpen$() {
    return this.isOpen.asReadonly();
  }

  toggle() {
    this.isOpen.update(isOpen => !isOpen);
  }
}
