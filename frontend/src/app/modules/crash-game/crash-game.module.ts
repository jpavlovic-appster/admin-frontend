import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/shared/components/components.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PipeModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const crashRoutes: Routes = [
  { path: '', redirectTo: 'bet-history', pathMatch: 'full' },
  
  { path: 'bet-history', loadChildren: () => import('./bet-history/bet-history.module').then(m => m.BetHistoryModule) },

  { path: 'free-bets', loadChildren: () => import('./free-bets/free-bets.module').then(m => m.FreeBetsModule) },

  { path: 'free-bet-rain', loadChildren: () => import('./free-bet-rain/free-bet-rain.module').then(m => m.FreeBetRainModule) }
]

@NgModule({
  declarations: [
   
  
   
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(crashRoutes),
    ComponentsModule,
    DirectivesModule,
    PipeModule,
    SharedModule
  ]
})
export class CrashGameModule { 
  
}
