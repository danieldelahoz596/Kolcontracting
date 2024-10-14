import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_guards/auth.guard';

import { SiteLayoutComponent } from './_layouts';

import { LoginComponent } from './login/login.component';
import { DummyComponent } from './_components/dummy.component';
import { HomeComponent } from './kol-contracting/home.component';
import { KOLContractingEditComponent } from './kol-contracting/kol-contracting-edit.component';
import { SelectKOLComponent } from './kol-contracting/select-kol.component';
import { EsifFormComponent } from './esif-form/esif-form.component';
import { SignComponent } from './sign/sign.component';

const routes: Routes = [
  {
    path: 'form',
    component: EsifFormComponent,
  },
  {
    path: 'sign',
    component: SignComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: SiteLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'speaker/new', component: KOLContractingEditComponent },
      { path: 'speaker/:id/edit', component: KOLContractingEditComponent },
      { path: 'select-kol', component: SelectKOLComponent },
      { path: 'settings', loadChildren: './settings/settings.module#SettingsModule' },
    ]
  },
  { path: 'dummy', component: DummyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
