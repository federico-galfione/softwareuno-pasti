import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, startWith, withLatestFrom } from 'rxjs/operators';
import { itemsAnimation, listAnimation } from '../../animations/list.animations';
import { AddDishesFormOptions } from '../../models/AddDishesFormOptions';
import { Dish } from '../../models/Dish';
import { NewDishInfoComponent } from './new-dish-info.component';

@Component({
  selector: 'app-add-dish',
  templateUrl: './add-dish.component.html',
  styleUrls: ['./add-dish.component.scss'],
  animations: [listAnimation, itemsAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDishComponent implements OnInit {

  @Input()
  dishes: Dish[] = [];
  @Input()
  addDishesFormOptions: AddDishesFormOptions;
  @Input()
  dishesHints$ = new BehaviorSubject<Dish[]>([]);
  @Input()
  showRecurrentDishes = true;

  /**
   * Animations properties
   */
  listAnimationDone$: Subject<boolean> = new Subject();
  showPlaceholder$: Observable<boolean>;
  
  /**
   * Current selected elements from the add dishes form  (the ones in the textarea, each line is an array object)
   */
  private currentValue$ = new BehaviorSubject<String[]>([]);
  
  /**
   * Filtered elements to show un usual dishes space
   */
  filteredHints$: Observable<Dish[]>

  /**
   *  The current value written inside the textarea
   */
  textareaValue = '';

  constructor(private popoverCtrl: PopoverController, private modalCtrl: ModalController) { 
    
  }

  ngOnInit() {
    this.filteredHints$ = combineLatest([this.dishesHints$, this.currentValue$]).pipe(map(([hints, value]) => hints.filter(( el ) => !value.map(x => x.makeComparable()).includes(el.name.makeComparable()) && !this.dishes.map(x => x.name.makeComparable()).includes(el.name.makeComparable()))))
    this.showPlaceholder$ = this.listAnimationDone$.pipe(withLatestFrom(this.filteredHints$), map(([animationDone, hints]) => animationDone && hints.length <= 0), startWith(true));
  }

  /**
   * Show the information on how to add new dishes
   * @param ev 
   */
  async presentPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: NewDishInfoComponent,
      cssClass: 'new-dish-info',
      componentProps: { info: this.addDishesFormOptions.info },
      event: ev,
      mode: "ios",
      showBackdrop: false,

    });
    await popover.present();
  }

  /**
   * Change the currentValue each time the textarea changes
   * @param ev 
   */
  valueChanged(ev){
    if(ev.detail.value)
      this.currentValue$.next((ev.detail.value as string).split(/[\r\n]+/).filter(str => !/^\s*$/.test(str)));
    else
      this.currentValue$.next([]);
  }

  /**
   * Add a dish into the textarea (the change will trigger valueChanged method)
   * @param dish 
   */
  addToTextarea(dish: string){
    this.textareaValue = this.currentValue$.value.join('\n') + ((this.currentValue$.value.length !== 0) ? '\n' : '') + dish.toLowerCase();
  }
  
  /**
   * Close the modal sending back the event (success or cancel)
   * @param ev 
   */
  closeModal(ev: 'success' | 'cancel'){
    this.modalCtrl.dismiss({
      newDishes: (ev === 'success') ? this.currentValue$.value.map(name => ({ name: name.makeComparable() })) : null,
      status: ev
    })
  }
}
