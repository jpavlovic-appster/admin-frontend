import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
declare const $: any;

@Component({
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})

export class NotFoundComponent implements OnInit, AfterViewInit, OnDestroy {
  
  constructor() { }

  ngOnInit() { 
    console.log(location.host)
   }

  ngAfterViewInit(): void {
    $(document.body).addClass('hold-transition login-page');
  }

  ngOnDestroy(): void {
    $(document.body).removeClass('login-page');
  }

}
