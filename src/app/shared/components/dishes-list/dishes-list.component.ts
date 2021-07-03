import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { itemsAnimation, listAnimation, selectionAnimation } from '../../animations/list.animations';
import { AddDishesFormOptions } from '../../models/AddDishesFormOptions';
import { Dish } from '../../models/Dish';
import { AddDishComponent } from '../add-dish/add-dish.component';

@Component({
  selector: 'app-dishes-list',
  templateUrl: './dishes-list.component.html',
  styleUrls: ['./dishes-list.component.scss'],
  animations: [selectionAnimation, listAnimation, itemsAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DishesListComponent{

  @Input()
  title: string = 'Primi';
  @Input()
  rightText: string = 'Piatti ricorrenti';
  @Input()
  editMode: boolean = true;
  @Input()
  addDishesFormOptions: AddDishesFormOptions = {
    title: "Aggiungi piatti",
    subtitle: "Aggiungi i piatti del giorno"
  };

  trackByName = (index: number, item: Dish) => item.name.makeComparable()

  /**
   * The current dishes in the list
   */
  @Input()
  set dishes(val: Dish[]){
    val = Array.from(val.reduce((m, t) => m.set(t.name.makeComparable(), t), new Map()).values());
    this.dishes$.next(val);
  }
  get dishes(){
    return this.dishes$.value;
  }
  dishes$ = new BehaviorSubject<Dish[]>([]);
  /**
   * Default dishes which can be selected while adding new dishes 
   * to not re-write them each time
   */
  @Input()
  set dishesHints(val: Dish[]){
    this.dishesHints$.next(val);
  }
  get dishesHints(){
    return this.dishesHints$.value;
  }
  dishesHints$ = new BehaviorSubject<Dish[]>([{ id: '1', name: 'Pasta in bianco'}, {id: '2', name:'Pasta al pomodoro'}]);
  
  /**
   * The currently selected dishes
   */
  get selectedDishes(){
    return this.dishes.filter(x => x.selected);
  }
 
  @Output()
  rightButtonClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor(private modalCtrl: ModalController){}

  /**
   * Add the selected dishes to the list
   */
  addDishes(dishes: Dish[]){
    this.dishes = [...this.dishes, ...dishes];
  }

  /**
   * Select or deselect a dish
   * @param dish 
   */
  toggleDish(dish: Dish){
    dish.selected = !dish.selected
  }

  /**
   * Open the modal with the form to add new dishes
   */
  async openAddDishesModal(){
    const modal = await this.modalCtrl.create({
      component: AddDishComponent,
      cssClass: 'bottom',
      swipeToClose: true,
      mode: "ios",
      componentProps: {
        addDishesFormOptions: this.addDishesFormOptions,
        dishes: this.dishes,
        dishesHints$: this.dishesHints$
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if(data && data.status == "success"){
      this.addDishes(data.newDishes);
    }
  }

  /**
   * Delete the selected dishes
   */
  deleteSelectedDishes(){
    this.dishes = this.dishes.filter(x => !x.selected);
  }

}
