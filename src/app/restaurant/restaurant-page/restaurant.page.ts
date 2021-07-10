import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseDirective } from '@shared/directives';
import { UsualDishes } from '@shared/models/UsualDishes';
import { Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DishesListComponent } from 'src/app/shared/components/dishes-list/dishes-list.component';
import { ModalDefaultContentButton } from '../../shared/models/ModalDefaultContentButton';
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
export class RestaurantPage extends BaseDirective implements OnInit {

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

  menuForm = new FormGroup({
    primi: new FormControl([]),
    secondi: new FormControl([]),
    contorni: new FormControl([]),
    pizze: new FormControl([])
  })



  cancelButton: ModalDefaultContentButton = {
    title: 'Annulla',
    fill: false,
    type: 'secondary'
  };
  successButton: ModalDefaultContentButton = {
    title: 'Salva',
    fill: true,
    type: 'secondary'
  }

  constructor(private authSvc: AuthService, private router: Router, public mediaSvc: MediaService, private restaurantSvc: RestaurantService) {
    super();
    this.primiUsualDishes$ = this.restaurantSvc.getTemplate('primi');
    this.secondiUsualDishes$ = this.restaurantSvc.getTemplate('secondi');
    this.contorniUsualDishes$ = this.restaurantSvc.getTemplate('contorni');
    this.pizzeUsualDishes$ = this.restaurantSvc.getTemplate('pizze');
    this.primiUsualDishes$.pipe(takeUntil(this.destroy$)).subscribe(value => this.menuForm.get('primi').setValue([...value.defaults, ...this.menuForm.value.primi]));
    this.secondiUsualDishes$.pipe(takeUntil(this.destroy$)).subscribe(value => this.menuForm.get('secondi').setValue([...value.defaults, ...this.menuForm.value.secondi]));
    this.contorniUsualDishes$.pipe(takeUntil(this.destroy$)).subscribe(value => this.menuForm.get('contorni').setValue([...value.defaults, ...this.menuForm.value.contorni]));
    this.pizzeUsualDishes$.pipe(takeUntil(this.destroy$)).subscribe(value => this.menuForm.get('pizze').setValue([...value.defaults, ...this.menuForm.value.pizze]));
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
    this.router.navigate(['restaurant', 'settings'])
  }

  deleteSelectedDishes(){
    this.primiList.deleteSelectedDishes();
    this.secondiList.deleteSelectedDishes();
    this.contorniList.deleteSelectedDishes();
    this.pizzeList.deleteSelectedDishes();
  }

  saveDishes(test: string){
    console.log(test, this.showUsualDishes);
    return of(true);
  }

}
