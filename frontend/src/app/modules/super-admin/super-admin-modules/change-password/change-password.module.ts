import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonAdminAuthGuard } from 'src/app/guards';
import { GaugeModule } from 'angular-gauge';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { ChangePasswordComponent } from './change-password.component';

const passwordRoutes: Routes = [
  {
    path: '', component: ChangePasswordComponent,
    canActivate: [CommonAdminAuthGuard],
  }
]


@NgModule({
  declarations: [
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    RouterModule.forChild(passwordRoutes),
    ComponentsModule,
    SharedModule,
    TranslateModule,
    GaugeModule.forRoot(),
    FormsModule
  ]
})
export class ChangePasswordModule { }
