import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BaseDirective } from '@shared/directives';
import { DishType } from '@shared/models';
import { BehaviorSubject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { MediaService } from 'src/app/shared/services/media.service';
import { RestaurantService } from '../restaurant.service';
import { InfoModalComponent } from './components/info-modal/info-modal.component';

@Component({
  selector: 'app-recurrent-dishes',
  templateUrl: './recurrent-dishes.page.html',
  styleUrls: ['./recurrent-dishes.page.scss'],
})
export class RecurrentDishesPage extends BaseDirective{
  
  dishType: DishType;
  infoModalType$ = new BehaviorSubject<"fissiInfo" | "frequentiInfo">(null);
  recurrentDishesForm: FormGroup = new FormGroup({
    defaults: new FormControl([]),
    hints: new FormControl([])
  })

  constructor(public mediaSvc: MediaService, private router: Router, private route: ActivatedRoute, private modalCtrl: ModalController, private restaurantSvc: RestaurantService) { 
    super();
    this.route.paramMap.pipe(switchMap(params => {
      this.dishType = params.get("dish") as DishType;
      return this.restaurantSvc.getTemplate(this.dishType);
    }), takeUntil(this.destroy$))
    .subscribe(templates => this.recurrentDishesForm.patchValue(templates))
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

  async saveTemplate(){
    !(
      await this.restaurantSvc.setTemplate(this.dishType, this.recurrentDishesForm.value)
    ) || this.cancel();
  }

  toggleInfoPopup(popupType: "fissiInfo" | "frequentiInfo"){
    this.infoModalType$.next(popupType);
  }

}
