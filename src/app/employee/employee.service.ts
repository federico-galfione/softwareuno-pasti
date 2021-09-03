import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { BaseDirective } from '@shared/directives';
import { DishesForm } from '@shared/models';
import { AuthService, LoadingService, ToastService } from '@shared/services';
import { from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

enum EmployeeLoadingNames{
  GUEST_KEY = 'getGuestKey',
  SAVE_ORDER_KEY = 'saveOrder',
  GET_SAVED_ORDERS_KEY = 'getSavedOrder'
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
      this.employeeLoadings.GUEST_KEY, 
      callable({}).pipe(map(x => x?.secretKey as string)), 
      {message: 'Sto recuperando il link ospiti'}
    )
  }

  getSavedOrder(){
    const today = new Date();
    return this.loadingSvc.startLoading(
      this,
      this.employeeLoadings.GET_SAVED_ORDERS_KEY,
      this.firestore.collection('menus')
        .doc(`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`)
        .collection('orders')
        .doc(this.authSvc.currentUser.uid)
        .valueChanges(),
      {message: 'Sto recuperando il tuo ordine salvato.'},
      false
    ) 
  }

  saveOrder(order: DishesForm & {takeAway: boolean; abbondante: boolean}){
      const today = new Date();
      return this.loadingSvc.startLoading(
        this,
        this.employeeLoadings.SAVE_ORDER_KEY,
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
