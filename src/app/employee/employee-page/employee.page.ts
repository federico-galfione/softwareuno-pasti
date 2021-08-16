import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { selectionAnimation } from '@shared/animations';
import { enterFromRightAnimation } from '@shared/animations/generic.animations';
import { BasePageFormDirective } from '@shared/directives';
import { Dish } from '@shared/models';
import { Dishes, DishesForm } from '@shared/models/Dishes';
import { AppService, MediaService, ToastService } from '@shared/services';
import { ordersValidator } from '@shared/validators/orders.validator';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { EmployeeService } from '../employee.service';
import { GuestModalComponent } from './components/guest-modal/guest-modal.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
  animations: [selectionAnimation, enterFromRightAnimation]
})
export class EmployeePage extends BasePageFormDirective {

  todaysMenu$: Observable<DishesForm>;
  todaysMenu: DishesForm = undefined;
  lastValidValue$: Observable<boolean>;
  validityChange$: Observable<boolean>;
  showAbbondante$: Observable<number>;

  constructor(public mediaSvc: MediaService, private employeeSvc: EmployeeService, private appSvc: AppService, private toastSvc: ToastService, private modalCtrl: ModalController) { 
    super();
    this.pageForm = new FormGroup({
      primi: new FormControl([]),
      secondi: new FormControl([]),
      contorni: new FormControl([]),
      pizze: new FormControl([]),
      abbondante: new FormControl(true),
      takeAway: new FormControl(false)
    }, ordersValidator)
    this.todaysMenu$ = this.appSvc.getTodaysMenu().pipe(takeUntil(this.destroy$));
    this.lastValidValue$ = this.pageForm.statusChanges.pipe(takeUntil(this.destroy$), filter(x => (x === 'VALID')), map(_ => JSON.parse(JSON.stringify(this.pageForm.value))));
    this.validityChange$ = this.pageForm.statusChanges.pipe(takeUntil(this.destroy$), map(_ => this.pageForm.errors?.invalidOrder));
    this.todaysMenu$.pipe(
      switchMap(x => {
        this.todaysMenu = x;
        this.pageForm.patchValue(x);
        return this.validityChange$;
      }), 
      distinctUntilChanged(),
      withLatestFrom(this.lastValidValue$), 
      filter(([_, prev]: [any, any]) => {
        if(this.pageForm.errors?.invalidOrder){
          this.pageForm.patchValue(prev);
          this.toastSvc.addInfoToast({
            header: 'Regole', 
            message: `Le combinazioni possibili sono:
- Primo / Contorno (opzionale)
- Secondo / Contorno (opzionale)
- Pizza
- 2 Contorni o 1 Contorno (Abbondante o no)`}, false)
          return false;
        }
        return true;
    })).subscribe();

    this.employeeSvc.getSavedOrder().subscribe((value: Dishes & {takeAway: boolean; abbondante: boolean}) => {
      this.pageForm.patchValue({
        primi: (this.pageForm.get('primi').value as Array<Dish>).map(x => ({name: x.name, selected: value.primi.includes(x.name)})),
        secondi: (this.pageForm.get('secondi').value as Array<Dish>).map(x => ({name: x.name, selected: value.secondi.includes(x.name)})),
        contorni: (this.pageForm.get('contorni').value as Array<Dish>).map(x => ({name: x.name, selected: value.contorni.includes(x.name)})),
        pizze: (this.pageForm.get('pizze').value as Array<Dish>).map(x => ({name: x.name, selected: value.pizze.includes(x.name)})),
        abbondante: value.abbondante,
        takeAway: value.takeAway
      })
    })

    this.showAbbondante$ = this.pageForm.valueChanges.pipe(
      map(x => {
          let contorni = x.contorni;
          let allOtherLengths = 
            this.pageForm.get('primi').value.filter(x => x.selected).length +
            this.pageForm.get('secondi').value.filter(x => x.selected).length +
            this.pageForm.get('pizze').value.filter(x => x.selected).length 
          return (contorni && allOtherLengths === 0)
          ? contorni.filter(contorni => contorni.selected).length 
          : 0
        }
      )
    )
  }

  showGuestModal(){
    this.employeeSvc.getGuestKey().subscribe(async secretKey => {
      const modal = await this.modalCtrl.create({
        component: GuestModalComponent,
        cssClass: 'bottom',
        swipeToClose: true,
        mode: "ios",
        componentProps: {
          secretKey
        }
      });
      await modal.present();
    })
  }

  toggleTakeAway(){
    this.pageForm.get('takeAway').setValue(!this.pageForm.get('takeAway')?.value)
  }

  toggleAbbondante(){
    this.pageForm.get('abbondante').setValue(!this.pageForm.get('abbondante')?.value)
  }

  saveOrder(){
    let currentValue = this.pageForm.value;
    currentValue.abbondante = currentValue.abbondante && (currentValue.contorni.length === 1);
    this.employeeSvc.saveOrder(currentValue);
  }

}
