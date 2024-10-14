import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  PathLocationStrategy,
  LocationStrategy
} from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';

// Auth
import { AuthGuard } from './_guards/auth.guard';
import { AuthInterceptor } from './_interceptors/auth.interceptor';

// Services
import {
  AuthenticationService,
  CompanyService,
  ContactService,
  ContactSubmissionService,
  ListService,
  ProfileService,
  SpeakerAgreementService,
  SpeakerEsifFormService,
  SpeakerRateDefaultService,
  SpeakerSignService,
  SpeakerValidationService,
  SpeakerValidationFileService,
  SpeakerValidationNoteService,
  SpeakerService,
} from './_services';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from 'app/_components/shared.module';

import {
  SiteLayoutComponent,
  SiteHeaderComponent,
} from './_layouts';

import { LoginComponent } from './login/login.component';
import { DummyComponent } from './_components/dummy.component';

import { EsifFormControlComponent } from './esif-form-control/esif-form-control.component';
import { EsifFormComponent } from './esif-form/esif-form.component';
import { W9ModalComponent } from './esif-form-control/w9-modal.component';
import { InviteOnlyComponent } from './invite-only/invite-only.component';

import { SignComponent } from './sign/sign.component';

import { HomeComponent } from './kol-contracting/home.component';
import { KOLContractingFormComponent } from './kol-contracting/kol-contracting-form.component';
import { KOLContractingEditComponent } from './kol-contracting/kol-contracting-edit.component';
import { SelectKOLComponent } from './kol-contracting/select-kol.component';
import { NewNominationModalComponent } from './kol-contracting/new-nomination-modal.component';
import { BulkSubmissionModalComponent } from './kol-contracting/bulk-submission-modal.component';
import { KOLContractingEditModalComponent } from './kol-contracting/kol-contracting-edit-modal.component';
import { KOLContractingEditTierModalComponent } from './kol-contracting/kol-contracting-edit-tier-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    SiteLayoutComponent,
    SiteHeaderComponent,

    LoginComponent,
    DummyComponent,

    EsifFormControlComponent,
    EsifFormComponent,
    W9ModalComponent,
    InviteOnlyComponent,

    SignComponent,

    HomeComponent,
    KOLContractingFormComponent,
    KOLContractingEditComponent,
    SelectKOLComponent,
    NewNominationModalComponent,
    BulkSubmissionModalComponent,
    KOLContractingEditModalComponent,
    KOLContractingEditTierModalComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,

    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
    }),
  ],
  entryComponents: [
    W9ModalComponent,
    NewNominationModalComponent,
    BulkSubmissionModalComponent,
    KOLContractingEditModalComponent,
    KOLContractingEditTierModalComponent,
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    CompanyService,
    ContactService,
    ContactSubmissionService,
    ListService,
    ProfileService,
    SpeakerAgreementService,
    SpeakerEsifFormService,
    SpeakerRateDefaultService,
    SpeakerSignService,
    SpeakerValidationService,
    SpeakerValidationFileService,
    SpeakerValidationNoteService,
    SpeakerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
