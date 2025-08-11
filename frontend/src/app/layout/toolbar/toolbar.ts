import { Component, inject, Renderer2 } from '@angular/core';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-toolbar',
  imports: [],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss'
})
export class Toolbar {
  private sidebarService = inject(SidebarService);
  private renderer = inject(Renderer2);

  constructor() {
    this.renderer.addClass(document.body, 'light-theme');
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  toggleTheme() {
    if (document.body.classList.contains('dark-theme')) {
      this.renderer.removeClass(document.body, 'dark-theme');
      this.renderer.addClass(document.body, 'light-theme');
    } else {
      this.renderer.removeClass(document.body, 'light-theme');
      this.renderer.addClass(document.body, 'dark-theme');
    }
  }
}
