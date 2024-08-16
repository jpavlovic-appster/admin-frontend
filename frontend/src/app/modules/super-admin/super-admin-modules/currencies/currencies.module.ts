import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { EditComponent } from './edit/edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonAdminAuthGuard } from 'src/app/guards';
import { TranslateModule } from '@ngx-translate/core';

const currenciesRoutes: Routes = [
  {
    path: '', component: ListComponent,
    canActivate: [CommonAdminAuthGuard],
    data: {
      permissions: {
        currencies: ['R'],
      }
    }
  },
  {
    path: ':id', component: EditComponent,
    canActivate: [CommonAdminAuthGuard],
    data: {
      permissions: {
        currencies: ['C', 'U'],
      }
    }
  }
]

@NgModule({
  declarations: [ListComponent, EditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(currenciesRoutes),
    ComponentsModule,
    SharedModule,
    TranslateModule
  ]
})

export class CurrenciesModule { }
