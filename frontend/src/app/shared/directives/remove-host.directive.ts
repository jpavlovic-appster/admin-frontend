import { Directive, ElementRef } from "@angular/core";

@Directive({ selector: '[remove-host]' })

export class RemoveHost {
    
    constructor(private el: ElementRef) {}

    //wait for the component to render completely
    ngOnInit() {
        const nativeElement: HTMLElement = this.el.nativeElement;
        const parentElement: any = nativeElement.parentElement;
        // move all children out of the element
        while (nativeElement.firstChild) {
            parentElement.insertBefore(nativeElement.firstChild, nativeElement);
        }
        // remove the empty element(the host)
        parentElement.removeChild(nativeElement);
    }

}