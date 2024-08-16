import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
 
export interface IDeactivateComponent {
  canExit: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class DeactivateGuard implements CanDeactivate<IDeactivateComponent> {
 
   canDeactivate(component: IDeactivateComponent,
           route: ActivatedRouteSnapshot, 
           state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
        
        return component.canExit ? component.canExit() : true;
  }
  
}
