import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { DishesForm } from '@shared/models/Dishes';
import { AuthService, ToastService } from '@shared/services';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private authSvc: AuthService, private toastSvc: ToastService, private firestore: AngularFirestore, private fns: AngularFireFunctions) { }

  getGuestKey(){
    const callable = this.fns.httpsCallable('getSecretLink');
    return callable({}).pipe(take(1), map(x => x?.secretKey as string));
  }

  getSavedOrder(){
    const today = new Date();
    return this.firestore.collection('menus')
      .doc(`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`)
      .collection('orders')
      .doc(this.authSvc.currentUser.uid)
      .valueChanges()

  }

  async saveOrder(order: DishesForm & {takeAway: boolean; abbondante: boolean}){
    try{
      this.isLoading$.next(true);
      const today = new Date();
      await this.firestore.collection('menus')
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
      this.isLoading$.next(false);
      this.toastSvc.addSuccessToast({header: 'Ordine inviato', message: 'L\'ordine è stato inviato con successo! Puoi modificarlo fino allo scadere del tempo.'})
    }catch(e){
      console.error(e)
      this.isLoading$.next(false);
      this.toastSvc.addErrorToast({message: 'Errore durante il salvataggio dell\'ordine'});
    }
    
  }
}
