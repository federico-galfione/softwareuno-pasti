import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BasePageFormDirective } from '@shared/directives';
import { DishesForm } from '@shared/models/Dishes';
import { AppService, MediaService } from '@shared/services';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage extends BasePageFormDirective {

  todaysMenu$: Observable<DishesForm>;
  todaysMenu: DishesForm = undefined;

  constructor(public mediaSvc: MediaService, private appSvc: AppService, private router: Router) { 
    super();
    this.pageForm = new FormGroup({
      primi: new FormControl([]),
      secondi: new FormControl([]),
      contorni: new FormControl([]),
      pizze: new FormControl([])
    })
    this.todaysMenu$ = this.appSvc.getTodaysMenu().pipe(takeUntil(this.destroy$));
    this.todaysMenu$.subscribe(x => {
      this.todaysMenu = x;
      this.pageForm.patchValue(x);
    });
  }

}
