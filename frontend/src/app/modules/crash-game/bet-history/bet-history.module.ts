import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonAdminAuthGuard } from 'src/app/guards';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PipeModule } from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

const betHistoryRoutes: Routes = [
  {
    path: ':id', component: ListComponent,
    canActivate: [CommonAdminAuthGuard],
    data: {
      permissions: {
        crash_game: ['R'],
      }
    }
  },
  { path: 'bet-history' },
  // {
  //   path: ':type/:id', component: DetailComponent, resolve: { betslip: BetHistoryResolverService },
  //   canActivate: [CommonAdminAuthGuard],
  //   data: {
  //     permissions: {
  //       bet_history: ['R'],
  //     }
  //   }
  // }
];

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(betHistoryRoutes),
    ComponentsModule,
    SharedModule,
    DirectivesModule,
    PipeModule,
    TranslateModule
  ]
})
export class BetHistoryModule { }
