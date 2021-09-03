import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BaseDirective } from '@shared/directives';
import { MediaService } from "@shared/services";
import { BehaviorSubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { itemsAnimation, listAnimation, selectionAnimation } from '../../animations/list.animations';
import { AddDishesFormOptions } from '../../models/AddDishesFormOptions';
import { Dish } from '../../models/Dish';
import { AddDishComponent } from '../add-dish/add-dish.component';

@Component({
  selector: 'app-dishes-list',
  templateUrl: './dishes-list.component.html',
  styleUrls: ['./dishes-list.component.scss'],
  animations: [selectionAnimation, listAnimation, itemsAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR, // Is an InjectionToken required by the ControlValueAccessor interface to provide a form value
    useExisting: forwardRef(() => DishesListComponent), // tells Angular to use the existing instance
    multi: true,
  },
  {
    provide: NG_VALIDATORS, // Is an InjectionToken required by this class to be able to be used as an Validator
    useExisting: forwardRef(() => DishesListComponent),
    multi: true,
  }]
})
export class DishesListComponent extends BaseDirective implements ControlValueAccessor, Validator, AfterViewInit{
  @Input()
  color: 'primary' | 'secondary' | 'tertiary' = 'secondary';
  @Input()
  title: string = 'Primi';
  @Input()
  editMode: boolean = true;
  @Input()
  selectable: boolean = true;
  @Input()
  addDishesFormOptions: AddDishesFormOptions = {
    title: "Aggiungi piatti",
    subtitle: "Aggiungi i piatti del giorno"
  };

  currentColor$: BehaviorSubject<string> = new BehaviorSubject<string>('#000');

  trackByName = (index: number, item: Dish) => item.name.makeComparable()

  /**
   * The current dishes in the list
   */
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
  dishesHints$ = new BehaviorSubject<Dish[]>([]);


  
  /**
   * The currently selected dishes
   */
  get selectedDishes(){
    return this.value.filter(x => x.selected);
  }
 
  @Output()
  rightButtonClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor(private modalCtrl: ModalController, private elRef: ElementRef, private mediaSvc: MediaService){super();}

  ngAfterViewInit(){
    this.currentColor$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe(x => this.elRef.nativeElement.style.setProperty('--current-color', x));
    this.currentColor$.next(getComputedStyle(document.documentElement).getPropertyValue('--ion-color-'+this.color));
  }

  /**
   * Add the selected dishes to the list
   */
  addDishes(dishes: Dish[]){
    this.value = [...dishes, ...this.value];
  }

  /**
   * Select or deselect a dish
   * @param dish 
   */
  toggleDish(dish: Dish){
    if(this.selectable){
      dish.selected = !dish.selected
      this.value = [...this.dishes$.value]
    }
  }

  /**
   * Open the modal with the form to add new dishes
   */
  async openAddDishesModal(){
    const modal = await this.modalCtrl.create({
      component: AddDishComponent,
      cssClass: this.mediaSvc.isSmartphone ? 'bottom' : '',
      swipeToClose: true,
      mode: "ios",
      componentProps: {
        addDishesFormOptions: this.addDishesFormOptions,
        dishes: this.value,
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
    this.value = this.value.filter(x => !x.selected);
  }


  /**
   * START FORMARRAY METHODS AND PROPERTIES
   */

  set value(val: Dish[]){
    val = Array.from(val.reduce((m, t) => m.set(t.name.makeComparable(), t), new Map()).values());
    this.dishes$.next(val);
    this.onChange(this.dishes$.value.map(x => JSON.parse(JSON.stringify(x))));
    // this.onValidatorChange();
  }
  get value(){
    return this.dishes$.value;
  }
  onChange = (_: any) => {}; // Called on a value change
  onTouched = () => {}; // Called if you care if the form was touched
  onValidatorChange = () => {}; // Called on a validator change or re-validation;


  registerOnChange(fn: any): void {
      this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
      this.onTouched = fn;
  }

  writeValue(obj: Dish[]): void {
      this.value = obj;
  }

  validate(control: AbstractControl): ValidationErrors | null {
      let valid = true;

      if (!!this.dishes$.value && this.dishes$.value.length > 0) {
          this.dishes$.value.forEach(yourEntry => valid = valid && !!yourEntry); // Perform here your single item validation
      }

      return valid ? null : {invalid: true};
  }

  registerOnValidatorChange?(fn: () => void): void {
      this.onValidatorChange = fn;
  }

  /**
   * END FORMARRAY METHODS AND PROPERTIES
   */

}
