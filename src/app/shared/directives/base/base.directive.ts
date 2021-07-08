import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '[appBase]'
})
export class BaseDirective implements OnDestroy {

  destroy$: Subject<void> = new Subject();

  constructor() { }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

}
