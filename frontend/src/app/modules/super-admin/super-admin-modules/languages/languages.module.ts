import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { CommonAdminAuthGuard } from 'src/app/guards';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { EditComponent } from './edit/edit.component';

const languagesRoutes: Routes = [
  {
    path: '', component: ListComponent,
    canActivate: [CommonAdminAuthGuard],
    // data: {
    //   permissions: {
    //     currencies: ['R'],
    //   }
    // }
  },
  {
    path: ':id/:dId', component: EditComponent,
    canActivate: [CommonAdminAuthGuard],
    // data: {
    //   permissions: {
    //     currencies: ['C', 'U'],
    //   }
    // }
  }
]

@NgModule({
  declarations: [ListComponent, EditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(languagesRoutes),
    ComponentsModule,
    SharedModule,
    TranslateModule
  ]
})
export class LanguagesModule { }
