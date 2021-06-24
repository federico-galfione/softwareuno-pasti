import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { PopupButton } from '../../shared/models/popupButton';
import { AuthService } from '../../shared/services/auth.service';
import { MediaService } from '../../shared/services/media.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
})
export class RestaurantPage implements OnInit {

  showUsualDishes: 'primi' | 'secondi' | 'contorni' | 'pizze' = null;
  cancelButton: PopupButton = {
    title: 'Annulla',
    fill: false,
    type: 'secondary'
  };
  successButton: PopupButton = {
    title: 'Salva',
    fill: true,
    type: 'secondary',
    clickFunc: () => this.saveDishes('brum brum')
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

  saveDishes(test: string){
    console.log(test, this.showUsualDishes);
    return of(true);
  }

}
