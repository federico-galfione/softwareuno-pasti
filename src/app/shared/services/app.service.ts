import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppSettings } from '@shared/models';
import { combineLatest, interval, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private firestore: AngularFirestore) { }

  changeStopOrdersTime(stopOrdersTime: Date){
    this.firestore.collection('app').doc('settings').update({ stopOrdersTime });
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
        const hours = Math.floor(diff / 3600) % 24;
        diff -= hours * 3600;
        const minutes = Math.floor(diff / 60) % 60;
        diff -= minutes * 60;
        return { hours, minutes }
      })
     )
  }

  getAppSettings(){
    return this.firestore.collection('app').doc('settings').valueChanges() as Observable<AppSettings>;
  }
}
