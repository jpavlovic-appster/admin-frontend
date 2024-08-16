import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

declare const $: any;

@Directive({ selector: '[select2]' })

export class Select2Directive implements OnInit {

  @Input() value: any;
  @Output() onSelect: EventEmitter<string> = new EventEmitter();

  constructor(private el: ElementRef) {  }

    ngOnInit(): void {

      const that = this;
      $(this.el.nativeElement).select2().on("change", function (e: any) {
        that.onSelect.emit($(e.currentTarget).val());
      });

    }

}
