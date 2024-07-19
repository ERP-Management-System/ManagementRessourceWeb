import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/Access/service/auth.service';
import { catchError, throwError } from 'rxjs';

import * as alertifyjs from 'alertifyjs'

@Component({
  selector: 'app-menu-parametrage-matiere',
  templateUrl: './menu-parametrage-matiere.component.html',
  styleUrl: './menu-parametrage-matiere.component.css'
})
export class MenuParametrageMatiereComponent implements OnInit {
  codeMenuPere : string='menu_parametrage_matiere';
  
  constructor(private accessService: AuthService) { }
  ngOnInit(): void {
    this.GetAccessMenu();
  }
  VisMatiereMenu: boolean = false;
  VisColoris: boolean = false;
  VisTypeMatiere: boolean = false;
  VisTaille: boolean = false;
  VisUnite: boolean = false;
  VisGrilleTaille: boolean = false;
  VisQcStand: boolean = false;

  AccessMenuUser: any;
  DesigntionMenuMatiere:any;
  DesigntionMenuColoris:any;
  DesigntionMenuTypeMatiere:any;
  DesigntionMenuTaille:any;
  DesigntionMenuGrilleTaille:any;
  DesigntionMenuUnite:any;
  DesigntionMenuQcStand:any;
  userConncted:any

  GetAccessMenu() {
    this.userConncted = sessionStorage.getItem('username');
    this.accessService.GetAccessMenu(this.userConncted,this.codeMenuPere).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
        } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` + " Parametrage Failed");

        }
        return throwError(errorMessage);
      })

    ).subscribe(
      (res: any) => {
        this.AccessMenuUser = res;
        let x = this.AccessMenuUser;
        let menuTemp;
        for (let y = 0; y < this.AccessMenuUser.length; y++) {
           menuTemp=this.AccessMenuUser[y].accessMenuUserPK.menu ;
          if(menuTemp =='menu_matiere'){
            this.VisMatiereMenu = this.AccessMenuUser[y].visible; 
            this.DesigntionMenuMatiere = this.AccessMenuUser[y].des
          }else if(menuTemp =='menu_coloris'){
            this.VisColoris = this.AccessMenuUser[y].visible; 
            this.DesigntionMenuColoris = this.AccessMenuUser[y].des 
          }else if(menuTemp =='menu_typeMatiere'){
            this.VisTypeMatiere = this.AccessMenuUser[y].visible; 
            this.DesigntionMenuTypeMatiere= this.AccessMenuUser[y].des 

          } else if(menuTemp =='menu_taille'){
            this.VisTaille = this.AccessMenuUser[y].visible; 
            this.DesigntionMenuTaille= this.AccessMenuUser[y].des 

          } else if(menuTemp =='menu_grille_taille'){
            this.VisGrilleTaille = this.AccessMenuUser[y].visible; 
            this.DesigntionMenuGrilleTaille= this.AccessMenuUser[y].des 

          } else if(menuTemp =='menu_unite'){
            this.VisUnite = this.AccessMenuUser[y].visible; 
            this.DesigntionMenuUnite= this.AccessMenuUser[y].des 

        
          } else if(menuTemp =='menu_qc_stand'){
            this.VisQcStand = this.AccessMenuUser[y].visible; 
            this.DesigntionMenuQcStand= this.AccessMenuUser[y].des 

          } 


        }
 
      }
    );
  }



}
