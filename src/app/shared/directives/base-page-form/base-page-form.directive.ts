import { Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isEqual } from 'lodash';
import { combineLatest, fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, finalize, map, shareReplay, startWith, takeUntil } from 'rxjs/operators';
import { BaseDirective } from '../base/base.directive';

@Directive({
  selector: '[appBasePageForm]'
})
export class BasePageFormDirective extends BaseDirective{
  isDirty$: Observable<boolean>;
  subscription: Subscription;
  pageDefaultFormValue$: Observable<any>;
  pageForm: FormGroup;
  
  constructor() { 
    super();
  }

  ionViewWillEnter(){
    this.isDirty$ = this.pageForm.valueChanges.pipe(
      takeUntil(this.destroy$),
      this.dirtyCheck(this.pageDefaultFormValue$)
    )
    this.subscription = this.isDirty$.subscribe();
  }

  ionViewDidLeave(){
    this.subscription.unsubscribe();
  }

  dirtyCheck<U>(source: Observable<U>) {
    let subscription: Subscription;
    let isDirty = false;
    return <T>(valueChanges: Observable<T>): Observable<boolean> => {
      const isDirty$ = combineLatest([
        source,
        valueChanges,
      ]).pipe(
        debounceTime(300),
        map(([a, b]) => {
          return isDirty = isEqual(a, b) === false
        }),
        finalize(() => subscription.unsubscribe()),
        startWith(false),
        shareReplay({ bufferSize: 1, refCount: true }),
      );

      subscription = fromEvent(window, 'beforeunload').subscribe(event => {
        isDirty && (event.returnValue = false);
      });
  
      return isDirty$;
    };
  }

}
