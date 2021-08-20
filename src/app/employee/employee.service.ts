import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { BaseDirective } from '@shared/directives';
import { DishesForm } from '@shared/models/Dishes';
import { AuthService, LoadingService, ToastService } from '@shared/services';
import { from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

enum EmployeeLoadingNames{
  GUESTKEY = 'getGuestKey',
  SAVEORDER = 'saveOrder'
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends BaseDirective {
  employeeLoadings = EmployeeLoadingNames;
  constructor(private authSvc: AuthService, private toastSvc: ToastService, private firestore: AngularFirestore, private fns: AngularFireFunctions, private loadingSvc: LoadingService) { 
    super();
  }

  getGuestKey(){
    const callable = this.fns.httpsCallable('getSecretLink');
    return this.loadingSvc.startLoading(
      this, 
      this.employeeLoadings.GUESTKEY, 
      callable({}).pipe(map(x => x?.secretKey as string)), 
      {message: 'Sto recuperando il link ospiti'}
    )
  }

  getSavedOrder(){
    const today = new Date();
    return this.firestore.collection('menus')
      .doc(`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`)
      .collection('orders')
      .doc(this.authSvc.currentUser.uid)
      .valueChanges()

  }

  saveOrder(order: DishesForm & {takeAway: boolean; abbondante: boolean}){
      const today = new Date();
      return this.loadingSvc.startLoading(
        this,
        this.employeeLoadings.SAVEORDER,
        from(
          this.firestore.collection('menus')
          .doc(`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`)
          .collection('orders')
          .doc(this.authSvc.currentUser.uid)
          .set({
            ...order,
            primi: order.primi.filter(x => x.selected).map(x => x.name),
            secondi: order.secondi.filter(x => x.selected).map(x => x.name),
            contorni: order.contorni.filter(x => x.selected).map(x => x.name),
            pizze: order.pizze.filter(x => x.selected).map(x => x.name)
          })
        ),
        {message: 'Sto inviando l\'ordine'}
      ).pipe(tap(
        _ => this.toastSvc.addSuccessToast({header: 'Ordine inviato', message: 'L\'ordine è stato inviato con successo! Puoi modificarlo fino allo scadere del tempo.'}),
        _ => this.toastSvc.addErrorToast({message: 'Errore durante il salvataggio dell\'ordine'})
      ))
  }
}
