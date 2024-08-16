import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare const $: any;

@Component({
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private router: Router) {  }
  
  ngOnInit(): void {  }

  ngAfterViewInit(): void {
    
    setTimeout(() => {
      $('#preloader').css('height', 0);
      $('#preloader img').hide();
    }, 200);

    $(document.body).addClass('sidebar-mini layout-fixed layout-navbar-fixed layout-footer-fixed');
  }
  

  ngOnDestroy(): void {
    $(document.body).removeClass('sidebar-mini layout-fixed layout-navbar-fixed layout-footer-fixed');
  }

}
