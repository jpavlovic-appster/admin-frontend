import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'subscriber-dashboard',


  },
  {
    path: 'sub-dashboard',
    loadChildren: () => import('../subscriber-dashboard/subscriber-dashboard.module').then(m => m.SubscriberDashboardModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SubscriberSystemRoutingModule { }
