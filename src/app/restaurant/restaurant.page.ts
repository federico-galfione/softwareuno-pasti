import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MediaService } from '../shared/services/media.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
})
export class RestaurantPage implements OnInit {

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
    this.router.navigate(['restaurant', 'usual', course]);
  }

}
