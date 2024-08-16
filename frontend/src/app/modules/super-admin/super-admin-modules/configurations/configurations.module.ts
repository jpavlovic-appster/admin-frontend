import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './hero/hero.component';
import { CommonAdminAuthGuard } from 'src/app/guards';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { BackgroundComponent } from './background/background.component';
import { SoundComponent } from './sound/sound.component';
import { StartAnimationComponent } from './start-animation/start-animation.component';
import { CrashAnimationComponent } from './crash-animation/crash-animation.component';

const configRoutes: Routes = [
  {
    path: 'hero/:id', component: HeroComponent,
    canActivate: [CommonAdminAuthGuard],
  },
  {
    path: 'background/:id', component: BackgroundComponent,
    canActivate: [CommonAdminAuthGuard],
  },
  {
    path: 'sound/:id', component: SoundComponent,
    canActivate: [CommonAdminAuthGuard],
  },
  {
    path: 'start-animation/:id', component: StartAnimationComponent,
    canActivate: [CommonAdminAuthGuard],
  },
  {
    path: 'crash-animation/:id', component: CrashAnimationComponent,
    canActivate: [CommonAdminAuthGuard],
  },

]

@NgModule({
  declarations: [
    HeroComponent,
    BackgroundComponent,
    SoundComponent,
    StartAnimationComponent,
    CrashAnimationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(configRoutes),
    ComponentsModule,
    SharedModule ,
    TranslateModule
  ]
})
export class ConfigurationsModule { }
