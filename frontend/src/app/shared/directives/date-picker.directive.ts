import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { dateFormat } from '../constants';

declare const $: any;

@Directive({ selector: '[date_picker]' })

export class DatePickerDirective implements OnInit {

  @Input() format: string = dateFormat;
  @Input() timePicker: boolean = false;
  @Input() autoUpdateInput: boolean = false;
  @Input() minDate: string = '';
  @Input() maxDate: string = '';
  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef) { }

  ngOnInit(): void {

    const that = this;
    let options: any = {
      locale: {
        format: that.format,
        maxDate: new Date
      },
      singleDatePicker: true,
      showDropdowns: true,
      timePicker: this.timePicker,
      autoUpdateInput: this.autoUpdateInput,
    };

    if (this.minDate) {
      options.minDate = this.minDate;
    }

    if (this.maxDate) {
      options.maxDate = this.maxDate;
    }

    $(this.el.nativeElement).daterangepicker(options, function (start: any) {
      that.onSelect.emit(start.format(that.format));
    });

  }

}
