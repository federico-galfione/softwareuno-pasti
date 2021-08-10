import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { DishesForm } from '@shared/models/Dishes';
import { AuthService, ToastService } from '@shared/services';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private authSvc: AuthService, private toastSvc: ToastService, private firestore: AngularFirestore, private fns: AngularFireFunctions) { }

  getGuestKey(){
    const callable = this.fns.httpsCallable('getSecretLink');
    return callable({}).pipe(take(1), map(x => x?.secretKey as string));
  }

  async saveOrder(order: DishesForm & {takeAway: boolean; abbondante: boolean}){
    try{
      let today = new Date();
      await this.firestore.firestore.collection('menus')
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
        this.toastSvc.addSuccessToast({header: 'Menù inviato', message: 'Il menù è stato inviato con successo!'})
    }catch(e){
      console.error(e)
      this.toastSvc.addErrorToast({message: 'Errore durante il salvataggio dell\'ordine'});
    }
    
  }
}
