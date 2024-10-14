import { NgModule } from '@angular/core';

import { SettingsRoutingModule } from './settings-routing.module';

import { SharedModule } from 'app/_components/shared.module';

import { SettingsMenuComponent } from './settings-menu.component';
import { ProfileComponent } from './profile.component';
import { ChangePasswordComponent } from './change-password.component';

@NgModule({
  imports: [
    SharedModule,
    SettingsRoutingModule,
  ],
  declarations: [
    SettingsMenuComponent,
    ProfileComponent,
    ChangePasswordComponent,
  ],
})

export class SettingsModule { }
