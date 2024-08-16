import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizationTokenHandler, ErrorHandler } from './helpers';
import { SharedModule } from './shared/shared.module';

import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
// import { NgProgressRouterModule } from 'ngx-progressbar/router';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { FGTranslate } from './shared/loader/FGTranslate.loader';
import { Constants } from './shared/constants';

@NgModule({

  declarations: [
    AppComponent
  ],

  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    NgProgressModule.withConfig({
      spinnerPosition: "right",
      color: "#f71cff"
    }),
    NgProgressHttpModule,
    // NgProgressRouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: FGTranslate,
        deps: [HttpClient],
      }
    }),
  ],

  providers: [ErrorHandler, AuthorizationTokenHandler],

  bootstrap: [AppComponent]

})

export class AppModule { 
  
  constructor(private translateService: TranslateService) { 
    this.translateService.addLangs(Object.keys(Constants.supportedLangs));
    this.translateService.setDefaultLang(Constants.defaultLang);
  }
  
}
