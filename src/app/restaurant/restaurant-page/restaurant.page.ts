import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { enterFromRightAnimation } from '@shared/animations/generic.animations';
import { BasePageFormDirective } from '@shared/directives';
import { DishesForm } from '@shared/models/Dishes';
import { UsualDishes } from '@shared/models/UsualDishes';
import { AppService } from '@shared/services';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { DishesListComponent } from 'src/app/shared/components/dishes-list/dishes-list.component';
import { MediaService } from '../../shared/services/media.service';
import { RestaurantService } from '../restaurant.service';
import { AddMenuWarnComponent } from './components/add-menu-warn/add-menu-warn.component';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
  animations: [enterFromRightAnimation]
})
export class RestaurantPage extends BasePageFormDirective {

  showUsualDishes: 'primi' | 'secondi' | 'contorni' | 'pizze' = null;
  
  
  @ViewChild('primiList')
  primiList: DishesListComponent;
  @ViewChild('secondiList')
  secondiList: DishesListComponent;
  @ViewChild('contorniList')
  contorniList: DishesListComponent;
  @ViewChild('pizzeList')
  pizzeList: DishesListComponent;

  primiUsualDishes$: Observable<UsualDishes>;
  secondiUsualDishes$: Observable<UsualDishes>;
  contorniUsualDishes$: Observable<UsualDishes>;
  pizzeUsualDishes$: Observable<UsualDishes>;
  defaultValue$: Observable<DishesForm>;
  todayMenu$: Observable<DishesForm>;
  isOrdersEnded$: Observable<boolean>;

  get cleanMenuData(){
    return {
      primi: this.pageForm.get('primi').value.map(x => x.name),
      secondi: this.pageForm.get('secondi').value.map(x => x.name),
      contorni: this.pageForm.get('contorni').value.map(x => x.name),
      pizze: this.pageForm.get('pizze').value.map(x => x.name)
    }
  }


  constructor(private router: Router, public mediaSvc: MediaService, private restaurantSvc: RestaurantService, private appSvc: AppService, private modalCtrl: ModalController) {
    super();
    this.pageForm = new FormGroup({
      primi: new FormControl([]),
      secondi: new FormControl([]),
      contorni: new FormControl([]),
      pizze: new FormControl([])
    })
    this.primiUsualDishes$ = this.restaurantSvc.getTemplate('primi');
    this.secondiUsualDishes$ = this.restaurantSvc.getTemplate('secondi');
    this.contorniUsualDishes$ = this.restaurantSvc.getTemplate('contorni');
    this.pizzeUsualDishes$ = this.restaurantSvc.getTemplate('pizze');

    this.todayMenu$ = this.appSvc.getTodaysMenu();
    this.isOrdersEnded$ = this.appSvc.isOrdersEnded();

    let editDefaultValue$ = combineLatest([this.primiUsualDishes$, this.secondiUsualDishes$, this.contorniUsualDishes$, this.pizzeUsualDishes$]).pipe(
      map(([primi, secondi, contorni, pizze]) => ({
        primi: [...primi.defaults, ...this.pageForm.get('primi').value],
        secondi: [...secondi.defaults, ...this.pageForm.get('secondi').value],
        contorni: [...contorni.defaults, ...this.pageForm.get('contorni').value],
        pizze: [...pizze.defaults, ...this.pageForm.get('pizze').value],
      })))

    this.defaultValue$ = combineLatest([this.isOrdersEnded$, this.todayMenu$, editDefaultValue$]).pipe(
      switchMap(([timeExpired, menu, _]) => (timeExpired || menu) ? this.todayMenu$ : editDefaultValue$),
      takeUntil(this.destroy$)
    )
    this.pageDefaultFormValue$ = this.defaultValue$;
    this.defaultValue$.subscribe(x => this.pageForm.patchValue(x));
  }

  goToUsual(course: 'primi' | 'secondi' | 'contorni' | 'pizze'){
    this.router.navigate(['restaurant', 'recurrent-dishes', course])
  }

  goToSettings(){
    this.router.navigate(['restaurant', 'settings'])
  }

  goToOrders(){
    this.router.navigate(['restaurant', 'orders'])
  }

  deleteSelectedDishes(){
    this.primiList.deleteSelectedDishes();
    this.secondiList.deleteSelectedDishes();
    this.contorniList.deleteSelectedDishes();
    this.pizzeList.deleteSelectedDishes();
  }

  async sendMenu(){
    try{
      const modal = await this.modalCtrl.create({
        component: AddMenuWarnComponent,
        cssClass: 'bottom',
        swipeToClose: true,
        mode: "ios"
      });
      await modal.present();
      const { data } = await modal.onWillDismiss();
      if(data.success){
        this.restaurantSvc.addTodayMenu({
          date: new Date(),
          dishes: this.cleanMenuData
        }).subscribe();
      }
    }catch(e){}
  }

}
