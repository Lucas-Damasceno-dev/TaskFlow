import { Component, inject } from '@angular/core';
import { SidebarService } from '../../core/services/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  public sidebarService = inject(SidebarService);
  isOpen = this.sidebarService.isOpen$;
}
