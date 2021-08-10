import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { enterFromRightAnimation } from '@shared/animations/generic.animations';
import { DishesListComponent } from '@shared/components/dishes-list/dishes-list.component';
import { BasePageFormDirective } from '@shared/directives';
import { DishType } from '@shared/models';
import { BehaviorSubject } from 'rxjs';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { MediaService } from 'src/app/shared/services/media.service';
import { RestaurantService } from '../restaurant.service';
import { InfoModalComponent } from './components/info-modal/info-modal.component';

@Component({
  selector: 'app-recurrent-dishes',
  templateUrl: './recurrent-dishes.page.html',
  styleUrls: ['./recurrent-dishes.page.scss'],
  animations: [enterFromRightAnimation]
})
export class RecurrentDishesPage extends BasePageFormDirective {

  @ViewChild('defaultsList')
  defaultsList: DishesListComponent;
  @ViewChild('hintsList')
  hintsList: DishesListComponent;
  
  dishType: DishType;
  infoModalType$ = new BehaviorSubject<"fissiInfo" | "frequentiInfo">(null);
  

  constructor(public mediaSvc: MediaService, private router: Router, private route: ActivatedRoute, private modalCtrl: ModalController, private restaurantSvc: RestaurantService, private activatedRoute: ActivatedRoute) { 
    super();
    this.pageForm = new FormGroup({
      defaults: new FormControl([]),
      hints: new FormControl([])
    });
    this.route.paramMap.pipe(switchMap(params => {
      this.dishType = params.get("dish") as DishType;
      this.pageDefaultFormValue$ = this.restaurantSvc.getTemplate(this.dishType);
      return this.pageDefaultFormValue$;
    }), takeUntil(this.destroy$))
    .subscribe(templates =>  this.pageForm.patchValue(templates) )

    
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
    this.router.navigate(['../..'], {relativeTo: this.activatedRoute});
  }

  async saveTemplate(){
    !(
       await this.restaurantSvc.setTemplate(this.dishType, this.pageForm.value)
    ) || this.isDirty$.pipe(filter(x => !x), take(1)).subscribe(_ => this.cancel());
  }

  deleteSelectedDishes(){
    this.defaultsList.deleteSelectedDishes();
    this.hintsList.deleteSelectedDishes();
  }

  toggleInfoPopup(popupType: "fissiInfo" | "frequentiInfo"){
    this.infoModalType$.next(popupType);
  }

}
