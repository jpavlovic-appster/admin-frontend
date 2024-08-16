import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { CommonAdminAuthGuard } from 'src/app/guards';
import { PipeModule } from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { DetailComponent } from './detail/detail.component';

const userRoutes: Routes = [
  {
    path: '', component: ListComponent,
    canActivate: [CommonAdminAuthGuard],
    data: {
      permissions: {
        users: ['R'],
      }
    }
  },
  {
    path: 'detail/:id', component: DetailComponent,
    canActivate: [CommonAdminAuthGuard],
    data: {
      permissions: {
        users: ['R'],
      }
    }
  },
];

@NgModule({
  declarations: [ListComponent, DetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes),
    SharedModule,
    ComponentsModule,
    DirectivesModule,
    PipeModule,
    TranslateModule
  ],
})

export class UserModule { }
