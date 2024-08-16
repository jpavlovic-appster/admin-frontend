import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({

  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, NgxPaginationModule,
  ],

  declarations: [],

  exports: [
    FormsModule, ReactiveFormsModule, HttpClientModule, NgxPaginationModule
  ]

})

export class SharedModule { }
