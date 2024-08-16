import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

const fpRoutes: Routes = [
  { path: '', component: ForgotPasswordComponent }
]

@NgModule({
  declarations: [
  
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(fpRoutes),
    TranslateModule
  ]
})
export class ForgotPasswordModule { }
