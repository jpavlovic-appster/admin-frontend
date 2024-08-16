import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

const loginRoutes: Routes = [
  { path: '', component: LoginComponent }
]

@NgModule({

  declarations: [
    LoginComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(loginRoutes),
    TranslateModule
  ]

})

export class LoginModule { }
