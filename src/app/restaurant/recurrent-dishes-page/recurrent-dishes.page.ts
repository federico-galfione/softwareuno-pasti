import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MediaService } from 'src/app/shared/services/media.service';
import { InfoModalComponent } from './components/info-modal/info-modal.component';

type DishType = "primi" | "secondi" | "contorni" | "pizze"

@Component({
  selector: 'app-recurrent-dishes',
  templateUrl: './recurrent-dishes.page.html',
  styleUrls: ['./recurrent-dishes.page.scss'],
})
export class RecurrentDishesPage {
  
  dishType: DishType;
  infoModalType$ = new BehaviorSubject<"fissiInfo" | "frequentiInfo">(null);

  constructor(public mediaSvc: MediaService, private router: Router, private route: ActivatedRoute, private modalCtrl: ModalController) { 
    this.route.paramMap.subscribe(params => this.dishType = params.get("dish") as DishType);
    this.infoModalType$.pipe(filter(x => !!x)).subscribe(async infoModalType => {
      const modal = await this.modalCtrl.create({
        component: InfoModalComponent,
        cssClass: 'bottom',
        swipeToClose: true,
        mode: "ios",
        componentProps: {
          infoModalType
        }
      });
      await modal.present();
    })
  }

  cancel(){
    this.router.navigate(['']);
  }

  toggleInfoPopup(popupType: "fissiInfo" | "frequentiInfo"){
    this.infoModalType$.next(popupType);
  }

}
