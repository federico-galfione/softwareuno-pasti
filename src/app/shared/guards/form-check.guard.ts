import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UnsavedChangesComponent } from '@shared/components/unsaved-changes/unsaved-changes.component';
import { BasePageFormDirective } from '@shared/directives';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormCheckGuard implements CanDeactivate<BasePageFormDirective> {

  constructor(private modalCtrl: ModalController){}

  canDeactivate(
    component: BasePageFormDirective,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return component.isDirty$.pipe(take(1), switchMap(async dirty => {
        if ( dirty === false ) {
          return true;
        }
        const modal = await this.modalCtrl.create({
          component: UnsavedChangesComponent,
          cssClass: 'bottom',
          swipeToClose: true,
          mode: "ios",
        });
        await modal.present();
        const { data } = await modal.onWillDismiss();
        return data && data.close;
      }))
  }
}
