import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class LayoutService {

  public sidebarToggle = new BehaviorSubject(true);

  changeSidebarToggle(toggle: boolean) {
    this.sidebarToggle.next(toggle);
  }


}
