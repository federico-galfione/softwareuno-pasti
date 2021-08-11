import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@shared/services';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authSvc.checkSecretKey(route.paramMap.get('secretKey'))
      .pipe(
        switchMap(auth => {
          if(auth === 'ERROR')
            return of(auth);
          return from(this.authSvc.loginAsGuest())
        }),
        map(auth => {
          if(auth === 'ERROR')
            return true;
          this.router.navigate(['']);
          return false;
        })
      )
  }
  
}
