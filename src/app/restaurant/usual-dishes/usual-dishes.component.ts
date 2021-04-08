import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-usual-dishes',
  templateUrl: './usual-dishes.component.html',
  styleUrls: ['./usual-dishes.component.scss'],
})
export class UsualDishesComponent implements OnInit {

  @Input()
  removeMargins: boolean;
  @Input()
  dishesType: 'primi' | 'secondi' | 'contorni' | 'pizze';

  constructor() { }

  ngOnInit() {}

  openInfoPopup(){}
}
