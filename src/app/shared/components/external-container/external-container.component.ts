import { Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-external-container',
  templateUrl: './external-container.component.html',
  styleUrls: ['./external-container.component.scss'],
})
export class ExternalContainerComponent implements OnChanges {

  // This value is gonna be multiplied by 32 and it will set the max width of the card. (default 23)
  @Input()
  multiplier: number = 28;

  constructor(private elementRef: ElementRef) { }

  ngOnChanges() {
    this.elementRef.nativeElement.style.setProperty('--max-width-multiplier', this.multiplier)
  }

}
