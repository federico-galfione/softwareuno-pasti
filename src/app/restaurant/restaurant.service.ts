import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Dish, DishType } from '@shared/models';
import { UsualDishesStrings } from '@shared/models/UsualDishes';
import { ToastService } from '@shared/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private firestore: AngularFirestore, private toastSvc: ToastService) { }

  getTemplate(dishType: DishType){
    return this.firestore.collection('templates').doc<UsualDishesStrings>(dishType).valueChanges().pipe(map(templates => ({
      defaults: templates.defaults.map(name => ({name})),
      hints: templates.hints.map(name => ({name}))
    })));
  }

  getDefaultDishes(dishType: DishType): Observable<Dish[]>{
    return this.getTemplate(dishType).pipe(map(template => template.defaults));
  }

  getHintDishes(dishType: DishType): Observable<Dish[]>{
    return this.getTemplate(dishType).pipe(map(template => template.hints));
  }

  async setTemplate(dishType: DishType, usualDishes: { defaults: Dish[], hints: Dish[] }){
    const newValue: UsualDishesStrings = {
      defaults: usualDishes.defaults.map(x => x.name),
      hints: usualDishes.hints.map(x => x.name)
    }
    try{
      await this.firestore.collection('templates').doc<UsualDishesStrings>(dishType).update(newValue);
      this.toastSvc.addSuccessToast({
        header: "Piatti ricorrenti salvati",
        message: "Le modifiche sono state salvate correttamente"
      })
      return true;
    } catch(e){
      this.toastSvc.addErrorToast({
        message: "Errore durante il salvataggio dei piatti ricorrenti"
      })
    }
    return false;
  }
}
