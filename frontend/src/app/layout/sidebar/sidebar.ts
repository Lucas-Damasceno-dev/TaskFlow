import { Component, inject } from '@angular/core';
import { SidebarService } from '../../core/services/sidebar.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, TranslateModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  standalone: true
})
export class SidebarComponent {
  public sidebarService = inject(SidebarService);
  public languageService = inject(LanguageService);
  isOpen = this.sidebarService.isOpen$;

  switchLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }
}
