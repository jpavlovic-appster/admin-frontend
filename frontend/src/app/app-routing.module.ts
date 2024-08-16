import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards';

const routes: Routes = [
  { path: '', loadChildren: () => import('./shared/layout/layout.module').then(m => m.LayoutModule) },
  // { path: 'login', loadChildren: () => import('./modules/admin/admin-modules/login/login.module').then(m => m.LoginModule), canActivate: [NoAuthGuard] },
  { path: 'super-admin/login', loadChildren: () => import('./modules/super-admin/super-admin-modules/login/login.module').then(m => m.LoginModule), canActivate: [NoAuthGuard] },
  { path: 'subscriber/login', loadChildren: () => import('./modules/subscriber-system/subscriber-modules/login/login.module').then(m => m.LoginModule), canActivate: [NoAuthGuard] },
  { path: 'subscriber/forgot-password', loadChildren: () => import('./modules/subscriber-system/subscriber-modules/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule), canActivate: [NoAuthGuard] },
  { path: 'subscriber/reset-password', loadChildren: () => import('./modules/subscriber-system/subscriber-modules/reset-password/reset-password.module').then(m => m.ResetPasswordModule), canActivate: [NoAuthGuard] },
  { path: '404', loadChildren: () => import('./modules/not-found/not-found.module').then(m => m.NotFoundModule) },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
