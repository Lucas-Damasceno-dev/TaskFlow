import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'pt']);
    const browserLang = this.translate.getBrowserLang();
    this.translate.setDefaultLang('en');
    this.translate.use(browserLang?.match(/en|pt/) ? browserLang : 'en');
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
  }

  getCurrentLang() {
    return this.translate.currentLang;
  }
}
