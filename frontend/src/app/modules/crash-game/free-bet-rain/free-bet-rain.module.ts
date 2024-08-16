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
import { EditComponent } from './edit/edit.component';
import {DatePipe} from '@angular/common';

const freeBetRainRoutes: Routes = [
  {
    path: '', component: ListComponent,
    canActivate: [CommonAdminAuthGuard],
  },
  {
    path: 'edit/:id', component: EditComponent,
    canActivate: [CommonAdminAuthGuard],
  },
];

@NgModule({
  declarations: [
    ListComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(freeBetRainRoutes),
    ComponentsModule ,
    SharedModule ,
    DirectivesModule ,
    PipeModule ,
    TranslateModule
  ],
  providers: [DatePipe]
})
export class FreeBetRainModule { }
