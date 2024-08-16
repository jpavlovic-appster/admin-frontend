import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscribersComponent } from './subscribers.component';
import { EditSubscriberComponent } from './edit-subscriber/edit-subscriber.component';
import { CommonAdminAuthGuard, DeactivateGuard } from 'src/app/guards';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { SubscriberDetailComponent } from './subscriber-detail/subscriber-detail.component';
import { PipeModule } from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { PlayersComponent } from './players/players.component';
import { AccountsComponent } from './accounts/accounts.component';

const subscribersRoutes: Routes = [
  {
    path: 'list/:id', component: SubscribersComponent,
    canActivate: [CommonAdminAuthGuard],
    data: {
      permissions: {
        subscribers: ['R'],
      }
    }
  },
  {
    path: ':id', component: EditSubscriberComponent,
    canActivate: [CommonAdminAuthGuard],
    canDeactivate: [DeactivateGuard],
    data: {
      permissions: {
        subscribers: ['R', 'C', 'U'],
      }
    }
  },
  {
    path: 'details/:id', component: SubscriberDetailComponent,
    canActivate: [CommonAdminAuthGuard],
    data: {
      permissions: {
        subscribers: ['R'],
      }
    }
  },
]

@NgModule({
  declarations: [
    SubscribersComponent,
    EditSubscriberComponent,
    SubscriberDetailComponent,
    PlayersComponent,
    AccountsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(subscribersRoutes),
    ComponentsModule,
    DirectivesModule,
    PipeModule,
    SharedModule,
    TranslateModule
  ],
  providers: [DeactivateGuard]
})

export class SubscribersModule { }
