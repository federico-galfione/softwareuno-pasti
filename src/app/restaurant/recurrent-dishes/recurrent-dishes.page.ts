import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { PopupButton } from 'src/app/shared/models/popupButton';
import { MediaService } from 'src/app/shared/services/media.service';

type DishType = "primi" | "secondi" | "contorni" | "pizze"

@Component({
  selector: 'app-recurrent-dishes',
  templateUrl: './recurrent-dishes.page.html',
  styleUrls: ['./recurrent-dishes.page.scss'],
})
export class RecurrentDishesPage implements OnInit {
  
  dishType: DishType;
  infoPopupType: "fissiInfo" | "frequentiInfo" | null = null;
  infoPopupButton: PopupButton = {
    type: 'secondary',
    fill: true,
    title: 'Ok, ho capito',
    clickFunc: () => of(true)
  }
  constructor(public mediaSvc: MediaService, private router: Router, private route: ActivatedRoute) { 
    this.route.paramMap.subscribe(params => this.dishType = params.get("dish") as DishType);
  }

  ngOnInit(){}
  cancel(){
    this.router.navigate(['']);
  }

  toggleInfoPopup(popupType: "fissiInfo" | "frequentiInfo" | null){
    this.infoPopupType = popupType;
  }

}
