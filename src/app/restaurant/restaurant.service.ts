import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { BaseDirective } from '@shared/directives';
import { Dish, DishType, Menu, RestAndTakeawayOrders, UsualDishesStrings } from '@shared/models';
import { LoadingService, ToastService } from '@shared/services';
import { from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from "src/environments/environment";

enum RestaurantLoadingKeys{
  ADD_MENU = 'addTodayMenu',
  SET_TEMPLATE = 'setTemplate',
  GET_ORDERS = 'getOrders',
  GET_TEMPLATE = 'getTemplate'
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService extends BaseDirective {

  constructor(private firestore: AngularFirestore, private toastSvc: ToastService, private loadingSvc: LoadingService, private fns: AngularFireFunctions) { super() }

  getTemplate(dishType: DishType){
    return this.loadingSvc.startLoading(
      this,
      RestaurantLoadingKeys.GET_TEMPLATE,
      this.firestore.collection('templates').doc<UsualDishesStrings>(dishType).valueChanges().pipe(map(templates => ({
        defaults: templates.defaults.map(name => ({name, selected: false})),
        hints: templates.hints.map(name => ({name, selected: false}))
      }))),
      {message: 'Sto recuperando i piatti.'},
      false
    )
  }

  getOrders(): Observable<RestAndTakeawayOrders>{
    const callable = this.fns.httpsCallable(environment.functionsPrefix + '/getTodaysOrders');
    return this.loadingSvc.startLoading(
      this, 
      RestaurantLoadingKeys.GET_ORDERS, 
      callable({}), 
      {message: 'Sto recuperando tutti gli ordini di Softwareuno.'}
    )
  }

  addTodayMenu(menu: Menu){
    return this.loadingSvc.startLoading(
      this,
      RestaurantLoadingKeys.ADD_MENU,
      from(this.firestore.collection('menus').doc(`${menu.date.getFullYear()}-${menu.date.getMonth()}-${menu.date.getDate()}`).set(menu)),
      {
        message: 'Sto inviando il menù.'
      }
    ).pipe(
      tap(
        _ => this.toastSvc.addSuccessToast({header: 'Menù inviato', message: 'Il menù è stato inviato con successo!'}),
        _ => this.toastSvc.addErrorToast({message: 'Errore durante l\'inserimento del menù'})
      )
    ) 
  }

  setTemplate(dishType: DishType, usualDishes: { defaults: Dish[], hints: Dish[] }){
    const newValue: UsualDishesStrings = {
      defaults: usualDishes.defaults.map(x => x.name),
      hints: usualDishes.hints.map(x => x.name)
    }
    return this.loadingSvc.startLoading(
      this,
      RestaurantLoadingKeys.SET_TEMPLATE,
      from(this.firestore.collection('templates').doc<UsualDishesStrings>(dishType).update(newValue)),
      {
        message: 'Sto modificando le preferenze.'
      }
    ).pipe(tap(
      _ => this.toastSvc.addSuccessToast({
        header: "Piatti ricorrenti salvati",
        message: "Le modifiche sono state salvate correttamente"
      }),
      _ => this.toastSvc.addErrorToast({
        message: "Errore durante il salvataggio dei piatti ricorrenti"
      })
    ));
  }
}
