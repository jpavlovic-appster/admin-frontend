import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constants } from '../constants';

export class FGTranslate implements TranslateLoader {

  constructor(private http: HttpClient) { }

  getTranslation(lang: string): Observable<any> {
    return this.http.get(`public/i18n/${lang}.json`).pipe(catchError((_) => this.http.get(`public/i18n/${Constants.defaultLang}.json`)));
  }
}
