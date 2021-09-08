import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-new-dish-info',
  styles: ['div { color: white; font-size: 2rem; padding: var(--space-2)}'],
  template: `
    <div>{{(info) ? info : "Puoi selezionare i piatti dalla lista di piatti frequenti e aggiungerne di nuovi scrivendo il loro nome nell'apposito spazio. Ogni riga equivale ad un piatto."}}</div>
  `
})
export class NewDishInfoComponent {
    @Input()
    info: string;
}
