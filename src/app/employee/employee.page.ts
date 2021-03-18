import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit {

  constructor(private authSvc: AuthService, private router: Router) { }

  ngOnInit() {
  }

  async logout(){
    await this.authSvc.logout();
    this.router.navigate(['']);
  }

}
