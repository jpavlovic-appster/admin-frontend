import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PipeModule } from 'src/app/pipes/pipes.module';
import { BetReportComponent } from './bet-report/bet-report.component';
import { TranslateModule } from '@ngx-translate/core';

const tenantsRoutes: Routes = [
  { path: '', redirectTo: 'bet-report', pathMatch: 'full' },
  
  { path: 'bet-report', component: BetReportComponent },
]

@NgModule({
  
  declarations: [
       BetReportComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild(tenantsRoutes),
    ComponentsModule,
    DirectivesModule,
    PipeModule,
    SharedModule,
    TranslateModule
  ]

})
  
export class ReportsModule { }
