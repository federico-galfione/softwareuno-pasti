import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { Dish, DishType } from '@shared/models';
import { Menu } from '@shared/models/Menu';
import { UsualDishesStrings } from '@shared/models/UsualDishes';
import { ToastService } from '@shared/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddMenuWarnComponent } from './restaurant-page/components/add-menu-warn/add-menu-warn.component';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private firestore: AngularFirestore, private toastSvc: ToastService, private modalCtrl: ModalController) { }

  getTemplate(dishType: DishType){
    return this.firestore.collection('templates').doc<UsualDishesStrings>(dishType).valueChanges().pipe(map(templates => ({
      defaults: templates.defaults.map(name => ({name, selected: false})),
      hints: templates.hints.map(name => ({name, selected: false}))
    })));
  }

  getDefaultDishes(dishType: DishType): Observable<Dish[]>{
    return this.getTemplate(dishType).pipe(map(template => template.defaults));
  }

  getHintDishes(dishType: DishType): Observable<Dish[]>{
    return this.getTemplate(dishType).pipe(map(template => template.hints));
  }

  async addTodayMenu(menu: Menu){
    const modal = await this.modalCtrl.create({
      component: AddMenuWarnComponent,
      cssClass: 'bottom',
      swipeToClose: true,
      mode: "ios"
    });
    await modal.present();
    try{
      const { data } = await modal.onWillDismiss();
      console.log(menu);
      if(data.success){
        await this.firestore.collection('menus').doc(`${menu.date.getFullYear()}-${menu.date.getMonth()}-${menu.date.getDate()}`).set(menu);
        this.toastSvc.addSuccessToast({header: 'Menù inviato', message: 'Il menù è stato inviato con successo!'})
      }
    }catch(e){
      this.toastSvc.addErrorToast({message: 'Errore durante l\'inserimento del menù'});
    }
      
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
