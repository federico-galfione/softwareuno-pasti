import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BasePageFormDirective } from '@shared/directives';
import { Dishes } from '@shared/models/Dishes';
import { UsualDishes } from '@shared/models/UsualDishes';
import { combineLatest, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DishesListComponent } from 'src/app/shared/components/dishes-list/dishes-list.component';
import { AuthService } from '../../shared/services/auth.service';
import { MediaService } from '../../shared/services/media.service';
import { RestaurantService } from '../restaurant.service';
import { fabAnimation } from './restaurant.animations';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
  animations: [fabAnimation]
})
export class RestaurantPage extends BasePageFormDirective implements OnInit {

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
  defaultValue$: Observable<Dishes>;

  get cleanMenuData(): Dishes{
    return {
      primi: this.pageForm.get('primi').value.map(x => x.name),
      secondi: this.pageForm.get('secondi').value.map(x => x.name),
      contorni: this.pageForm.get('contorni').value.map(x => x.name),
      pizze: this.pageForm.get('pizze').value.map(x => x.name)
    }
  }


  constructor(private authSvc: AuthService, private router: Router, public mediaSvc: MediaService, private restaurantSvc: RestaurantService) {
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
    this.defaultValue$ = combineLatest([this.primiUsualDishes$, this.secondiUsualDishes$, this.contorniUsualDishes$, this.pizzeUsualDishes$]).pipe(takeUntil(this.destroy$), 
      map(([primi, secondi, contorni, pizze]) => ({
        primi: [...primi.defaults, ...this.pageForm.get('primi').value],
        secondi: [...secondi.defaults, ...this.pageForm.get('secondi').value],
        contorni: [...contorni.defaults, ...this.pageForm.get('contorni').value],
        pizze: [...pizze.defaults, ...this.pageForm.get('pizze').value],
      })))
    this.pageDefaultFormValue$ = this.defaultValue$;
    this.defaultValue$.subscribe(x => this.pageForm.patchValue(x));
  }

  ngOnInit() {
  }

  async logout(){
    try{
      await this.authSvc.logout();
      this.router.navigate(['']);
    }catch(e){}
  }

  goToUsual(course: 'primi' | 'secondi' | 'contorni' | 'pizze'){
    this.router.navigate(['restaurant', 'recurrent-dishes', course])
  }

  goToSettings(){
    this.router.navigate(['settings'])
  }

  deleteSelectedDishes(){
    this.primiList.deleteSelectedDishes();
    this.secondiList.deleteSelectedDishes();
    this.contorniList.deleteSelectedDishes();
    this.pizzeList.deleteSelectedDishes();
  }

  sendMenu(){
    this.restaurantSvc.addTodayMenu({
      date: new Date(),
      dishes: this.cleanMenuData
    });
  }

}
