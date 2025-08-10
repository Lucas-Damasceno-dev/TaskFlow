import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar';
import { ToolbarComponent } from './layout/toolbar/toolbar';
import { BreadcrumbsComponent } from './shared/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    ToolbarComponent,
    BreadcrumbsComponent,
    // Importação dinâmica para standalone component
    import('./shared/notifications/notifications').then(m => m.Notifications)
  ],
  templateUrl: './layout/app.html',
  styleUrl: './layout/app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
