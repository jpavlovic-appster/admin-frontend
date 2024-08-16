import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const superAdminRoutes: Routes = [
  {
    path: 'subscriber-dashboard',
    loadChildren: () => import('../subscriber-dashboard/subscriber-dashboard.module').then(m => m.SubscriberDashboardModule)
  },
  {
    path: 'subscribers',
    loadChildren: () => import('./super-admin-modules/subscribers/subscribers.module').then(m => m.SubscribersModule)
  },
  {
    path: 'configurations',
    loadChildren: () => import('./super-admin-modules/configurations/configurations.module').then(m => m.ConfigurationsModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./super-admin-modules/change-password/change-password.module').then(m => m.ChangePasswordModule)
  },
  {
    path: 'organizations',
    loadChildren: () => import('./super-admin-modules/organizations/organizations.module').then(m => m.OrganizationsModule)
  },
  {
    path: 'currencies',
    loadChildren: () => import('./super-admin-modules/currencies/currencies.module').then(m => m.CurrenciesModule)
  },
  {
    path: 'languages',
    loadChildren: () => import('./super-admin-modules/languages/languages.module').then(m => m.LanguagesModule)
  },
  // {
  //   path: 'casino',
  //   loadChildren: () => import('./super-admin-modules/casino/casino.module').then(m => m.CasinoModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(superAdminRoutes)],
  exports: [RouterModule]
})

export class SuperAdminRoutingModule { }
