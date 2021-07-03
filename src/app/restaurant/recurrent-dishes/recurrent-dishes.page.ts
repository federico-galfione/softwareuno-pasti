import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDefaultContentButton } from 'src/app/shared/models/ModalDefaultContentButton';
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
  infoPopupButton: ModalDefaultContentButton = {
    type: 'secondary',
    fill: true,
    title: 'Ok, ho capito'
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
