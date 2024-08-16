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
import { GrantFreeBetComponent } from './grant-free-bet/grant-free-bet.component';
import {DatePipe} from '@angular/common';

const freeBetsRoutes: Routes = [
  {
    path: '', component: ListComponent,
    canActivate: [CommonAdminAuthGuard],
    // data: {
    //   permissions: {
    //     crash_game: ['R'],
    //   }
    // }
  },
  {
    path: 'create/:id', component: GrantFreeBetComponent,
    canActivate: [CommonAdminAuthGuard],
    // data: {
    //   permissions: {
    //     crash_game: ['R'],
    //   }
    // }
  },
];

@NgModule({
  declarations: [
    ListComponent,
    GrantFreeBetComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(freeBetsRoutes),
    ComponentsModule ,
    SharedModule ,
    DirectivesModule ,
    PipeModule ,
    TranslateModule
  ],
  providers: [DatePipe]
})
export class FreeBetsModule { }
