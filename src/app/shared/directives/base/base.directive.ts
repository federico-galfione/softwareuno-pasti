import { Directive, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Directive({
  selector: '[appBase]'
})
export class BaseDirective implements OnDestroy {

  destroy$: Subject<void> = new Subject();

  constructor(public formToCheck?: FormGroup) { 
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

}

