import { Component, Input, OnInit } from '@angular/core';
import { Roles } from '../../services/auth.service';

@Component({
  selector: 'app-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.scss'],
})
export class DefaultPageComponent implements OnInit {
  @Input()
  role: Roles;
  @Input()
  title: string;
  @Input()
  subtitle: string;
  constructor() { }

  ngOnInit() {}

}
