import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { DishesListComponent } from 'src/app/shared/components/dishes-list/dishes-list.component';
import { ModalDefaultContentButton } from '../../shared/models/ModalDefaultContentButton';
import { AuthService } from '../../shared/services/auth.service';
import { MediaService } from '../../shared/services/media.service';
import { fabAnimation } from './restaurant.animations';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
  animations: [fabAnimation]
})
export class RestaurantPage implements OnInit {

  showUsualDishes: 'primi' | 'secondi' | 'contorni' | 'pizze' = null;
  
  @ViewChild('primiList')
  primiList: DishesListComponent;
  @ViewChild('secondiList')
  secondiList: DishesListComponent;
  @ViewChild('contorniList')
  contorniList: DishesListComponent;
  @ViewChild('pizzeList')
  pizzeList: DishesListComponent;

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

  constructor(private authSvc: AuthService, private router: Router, public mediaSvc: MediaService) { 
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
