import { Directive, ElementRef, EventEmitter, HostListener, Output } from "@angular/core";

@Directive({ selector: '[outside-click]' })

export class OutsideClickDirective {

    @Output() outSideClick = new EventEmitter;
    
    constructor(private el: ElementRef) {}

    @HostListener('document:click', ['$event.target'])

    public onClick(targetElement: any) {
      const clickedInside = this.el.nativeElement.contains(targetElement);
      if (!clickedInside) {
        this.outSideClick.emit();
      }
    }

}