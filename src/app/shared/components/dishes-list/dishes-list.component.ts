import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  @Output()
  rightButtonClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

}
