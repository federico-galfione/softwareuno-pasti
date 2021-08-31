import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Timestamp } from '@google-cloud/firestore';
import { BaseDirective } from '@shared/directives';
import { AppSettings } from '@shared/models';
import { Dishes, DishesForm } from '@shared/models/Dishes';
import { from, interval, Observable } from 'rxjs';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AppService extends BaseDirective {

  constructor(private firestore: AngularFirestore, private toastSvc: ToastService, private loadingSvc: LoadingService) { super() }

  isOrdersEnded(){
    return this.getOrdersTimer().pipe(map(time => time.hours === 0 && time.minutes === 0));
  }

  changeSettings(appSettings: AppSettings){
    return this.loadingSvc.startLoading(
      this,
      null,
      from(this.firestore.collection('app').doc<AppSettings>('settings').update(appSettings)),
      {
        message: 'Sto modificando le impostazioni.'
      }
    ).pipe(tap(
      _ => this.toastSvc.addSuccessToast({
        header: "Impostazioni salvate",
        message: "Le impostazioni sono state salvate con successo"
      }),
      _ => this.toastSvc.addErrorToast({
        message: "Errore durante il salvataggio delle impostazioni"
      })
    ))
  }

  getStopOrdersTime(){
    return this.getAppSettings().pipe(map(settings => settings.stopOrdersTime.toDate()));
  }

  getOrdersTimer(){
    return this.getStopOrdersTime().pipe(
      switchMap(_ => interval(1000).pipe(
        withLatestFrom(this.getStopOrdersTime()),
        filter((_, index) => index === 0 || new Date().getSeconds() === 0), // Get only the first element and one everytime a minute start (0 seconds)
        map(([_, date]) => {
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
      ))
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

  private getHours
}
