import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaterangePickerDirective, OutsideClickDirective, RemoveHost, Select2Directive, 
  DatePickerDirective } from './index';

@NgModule({
  
  imports: [
    CommonModule,
  ],

  declarations: [
    RemoveHost, OutsideClickDirective, Select2Directive, DaterangePickerDirective, DatePickerDirective
  ],

  exports: [ 
    RemoveHost, OutsideClickDirective, Select2Directive, DaterangePickerDirective, DatePickerDirective
  ]
  
})

export class DirectivesModule { }
