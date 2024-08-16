import { NgModule } from '@angular/core';
import {
   TruncateStringPipe, ContestUserStatusPipe, SafeHtml,
 PackageTypePipe, LanguagePipe, CurrencySymbolPipe
} from './index';
import { SbNameTranslatePipe } from './sb-name-translate.pipe';
import { SentancecasePipe } from './sentancecase.pipe';
import { SafePipe } from './safe.pipe';

@NgModule({

  declarations: [TruncateStringPipe, ContestUserStatusPipe, SafeHtml,
      PackageTypePipe, SbNameTranslatePipe, LanguagePipe, CurrencySymbolPipe, SentancecasePipe, SafePipe],

  exports: [TruncateStringPipe, ContestUserStatusPipe, SafeHtml,
     PackageTypePipe, SbNameTranslatePipe, LanguagePipe, CurrencySymbolPipe , SentancecasePipe , SafePipe],

})

export class PipeModule { }
