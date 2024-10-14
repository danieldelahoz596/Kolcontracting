import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DataTablesModule } from 'angular-datatables';
import { SignaturePadModule } from 'angular2-signaturepad';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';

import { TitlizePipe } from 'app/_pipes/titlize.pipe';
import { FullNamePipe } from 'app/_pipes/full-name.pipe';
import { NameCharsPipe } from 'app/_pipes/name-chars.pipe';

import { CheckboxGroupComponent } from './checkbox-group/checkbox-group.component';

import { BaseComponent } from './base.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,

    SignaturePadModule,
    DataTablesModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
  ],
  declarations: [
    // Pipes
    TitlizePipe,
    FullNamePipe,
    NameCharsPipe,

    // Common Components
    BaseComponent,
    CheckboxGroupComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,

    SignaturePadModule,
    DataTablesModule,
    BsDatepickerModule,
    BsDropdownModule,
    AccordionModule,

    // Pipes
    TitlizePipe,
    FullNamePipe,
    NameCharsPipe,

    // Common Components
    CheckboxGroupComponent,
  ],
  entryComponents: []
})

export class SharedModule { }

