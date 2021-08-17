import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Timestamp } from '@google-cloud/firestore';
import { AppSettings } from '@shared/models';
import { Dishes, DishesForm } from '@shared/models/Dishes';
import { combineLatest, interval, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private firestore: AngularFirestore, private toastSvc: ToastService) { }

  isOrdersEnded(){
    return this.getOrdersTimer().pipe(map(time => time.hours === 0 && time.minutes === 0));
  }

  async changeSettings(appSettings: AppSettings){
    try{
      await this.firestore.collection('app').doc<AppSettings>('settings').update(appSettings);
      this.toastSvc.addSuccessToast({
        header: "Impostazioni salvate",
        message: "Le impostazioni sono state salvate con successo"
      })
      return true;
    } catch(e){
      this.toastSvc.addErrorToast({
        message: "Errore durante il salvataggio delle impostazioni"
      })
    }
    return false;
  }

  getStopOrdersTime(){
    return this.getAppSettings().pipe(map(settings => settings.stopOrdersTime.toDate()));
  }

  getOrdersTimer(){
    return combineLatest([this.getStopOrdersTime(), interval(1000)]).pipe(
      filter(([date, _]) => !!date), // Check if I already retrived a date from firebase
      filter((_, index) => index === 0 || new Date().getSeconds() === 0), // Get only the first element and one everytime a minute start (0 seconds)
      map(([date, _]) => {
        let settedTime = new Date();
        settedTime.setHours(date.getHours());
        settedTime.setMinutes(date.getMinutes());
        settedTime.setSeconds(0);
        let currentTime = new Date();
        if (currentTime > settedTime)
          return { hours: 0, minutes: 0 };
        let diff = Math.abs(settedTime.getTime() - currentTime.getTime());
        const hours = Math.floor((diff % 86400000) / 3600000)
        const minutes = Math.round(((diff % 86400000) % 3600000) / 60000);
        return { hours, minutes }
      })
     )
  }

  getTodaysMenu(): Observable<DishesForm>{
    let currDate = new Date();
    return this.firestore.collection('menus').doc<{date: Timestamp, dishes: Dishes}>(`${currDate.getFullYear()}-${currDate.getMonth()}-${currDate.getDate()}`).valueChanges()
    .pipe(map(menu => menu ? ({
      primi: menu.dishes.primi.map(name => ({name, selected: false})),
      secondi: menu.dishes.secondi.map(name => ({name, selected: false})),
      contorni: menu.dishes.contorni.map(name => ({name, selected: false})),
      pizze: menu.dishes.pizze.map(name => ({name, selected: false})),
    }) : null ));
  }

  getAppSettings(){
    return this.firestore.collection('app').doc<AppSettings>('settings').valueChanges();
  }
}
