import { Directive, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { dateFormat } from '../constants';
import * as moment from 'moment';

declare const $: any;

@Directive({ selector: '[daterange_picker]' })

export class DaterangePickerDirective implements OnInit, OnChanges {

  @Input() minDate: string = '';
  @Input() maxDate: string = '';
  @Input() timePicker: boolean = false;
  @Input() format: string = dateFormat;
  @Input() startDate: string = moment().format('YYYY-MM-DD');
  @Input() endDate: string = moment().add(1, 'month').format('YYYY-MM-DD');
  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {

    const that = this;

    const options: any = {
      timePicker: that.timePicker,
      // timePickerIncrement: 30,
      locale: {
        format: that.format
      },
    };

    if (this.startDate) {
      options.startDate = this.startDate;
    }

    if (this.endDate) {
      options.endDate = this.endDate;
    }

    // if (this.minDate) {
    //   options.minDate = this.minDate;
    // }

    if (changes?.minDate?.currentValue) {
      options.minDate = this.minDate;
    }

    // if (this.maxDate) {
    //   options.maxDate = this.maxDate;
    // }

    if (changes?.maxDate?.currentValue) {
      options.maxDate = this.maxDate
    }

    $(this.el.nativeElement).daterangepicker(options, function (start: any, end: any) {
      const start_date = start.format(that.format);
      const end_date = end.format(that.format);
      that.onSelect.emit({ start_date, end_date });
    });

  }

  ngOnInit(): void {

    

  }

}
