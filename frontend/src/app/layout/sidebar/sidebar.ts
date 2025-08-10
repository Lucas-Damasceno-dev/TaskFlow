import { Component, inject } from '@angular/core';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  private sidebarService = inject(SidebarService);
  isOpen = this.sidebarService.isOpen$;
}
