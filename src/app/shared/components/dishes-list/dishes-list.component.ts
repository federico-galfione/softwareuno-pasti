import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { PopupButton } from '../../models/popupButton';

@Component({
  selector: 'app-dishes-list',
  templateUrl: './dishes-list.component.html',
  styleUrls: ['./dishes-list.component.scss'],
})
export class DishesListComponent implements OnInit {

  @Input()
  title: string = 'Primi';
  @Input()
  rightText: string = 'Piatti ricorrenti';
  @Input()
  dishes: string[] = [];
  @Input()
  editMode: boolean = true;
  @Input()
  showHeader: boolean = true;
  /**
   * Default dishes that can be selected while adding new dishes 
   * to not re-write them each time
   */
  @Input()
  dishesHints: string[] = ["Pasta alla carbonara", "Pasta all'amatriciana", "Tortellini in brodo", "Pasta al pesto"];
  @Output()
  rightButtonClicked: EventEmitter<void> = new EventEmitter<void>();
  showAddDishForm: boolean = false
  cancelButton: PopupButton = {
    title: 'Annulla',
    fill: false,
    type: 'secondary'
  };
  successButton: PopupButton = {
    title: 'Aggiungi',
    fill: true,
    type: 'secondary',
    clickFunc: () => of(true)
  }

  constructor() { }

  ngOnInit() {
    console.log(this.dishesHints)
  }

  addDish(){
    this.showAddDishForm = true;
  }

}
