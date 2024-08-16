import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriberDashboardComponent } from './subscriber-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonAdminAuthGuard } from 'src/app/guards/common-admin-auth.guard';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { FormsModule } from '@angular/forms';
import { GaugeModule } from 'angular-gauge';
import { TranslateModule } from '@ngx-translate/core';

const subscriberDashboardRoutes: Routes = [
  {
    path: '', component: SubscriberDashboardComponent,
    canActivate: [CommonAdminAuthGuard]
  }
]

@NgModule({
  declarations: [
    SubscriberDashboardComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    RouterModule.forChild(subscriberDashboardRoutes),
    FormsModule,
    GaugeModule.forRoot(),
    TranslateModule
  ]
})
export class SubscriberDashboardModule { }
