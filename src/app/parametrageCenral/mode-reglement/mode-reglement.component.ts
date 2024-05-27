 

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { catchError, throwError, timeout, of } from 'rxjs';
import { Table } from 'primeng/table';  
import * as alertifyjs from 'alertifyjs'
import { Article, DDE_ACHAT, ParamsModel } from '../domaine/ParametrageCentral';
import { ParametrageCentralService } from '../ParametrageCentralService/parametrage-central.service';


@Component({
  selector: 'app-mode-reglement',
  templateUrl: './mode-reglement.component.html',
 
  styleUrl: './mode-reglement.component.css' ,providers:[ConfirmationService,MessageService]
})  
export class ModeReglementComponent implements OnInit {
  productDialog: boolean = false;
 
  products = new Array<Article>();
  product!: Article;

  selectedProducts!: Article[] | null;

  submitted: boolean = false;

  statuses!: any[];

  constructor(private confirmationService: ConfirmationService, private param_achat_service: ParametrageCentralService, private messageService: MessageService, private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
  }



  sourceProducts!: Article[];

  cities!: Article[];
  qte!: number;
  xx!: any[];
  targetProducts!: Article[];
  selectedValue!: string;
  article2!: Article[];

  viewValue!: string;
  rows: any = [
  ]

  index!: number;
  countries!: any[];
  formGroup: FormGroup | undefined;

  // products!: Article[];


  selectedCity: any;
  clonedProducts: { [s: string]: Article } = {};
  colsAdd!: any[];

  ngOnInit(): void {
    
    this.GelAllModeReglementActif();
    // this.Voids();
    // this.getAllArticleModal();

    
  }


  desig: string = 'AR'
  FormControl = new Array<FormControl>();
  GetFormName(): void {
    this.param_achat_service.GetFormControlName(this.desig).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
        } else {
          alertifyjs.set('notifier', 'position', 'top-left');
          alertifyjs.error(` ${error.error.message}` + " Parametrage Failed");
        }
        return throwError(errorMessage);
      })

    )
      .subscribe((data: any) => {
        this.FormControl = data
        this.searchTerm = '';
        this.check_actif = true
        this.check_inactif = false
      });
  }

  clear(table: Table) {
    table.clear();
  }

  clearForm(): void {
    this.code == undefined;
    this.designation = '';
    this.actif = false;
    this.codeSaisie = '';

  }
  check_actif = false;
  check_inactif = false;

  formHeader = "إضافة مخزن ";
  // data: any = null;
  searchTerm = '';
  visibleModal: boolean = false;
  visDelete: boolean = false;
  code!: number | null;
  codeSaisie!: string;
  designation!: string;
  actif!: boolean;
  designation2!: string;

  selectedddeAchat!: DDE_ACHAT;
  selectedddeAchat2!: DDE_ACHAT;
  selectedCar!: string;
  onRowSelect(event: any) {
    this.code = event.data.code;
    this.actif = event.data.actif;
    this.codeSaisie = event.data.codeSaisie;
    this.designation = event.data.designation;
    console.log('vtData : ', event);
  }
  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////
  article!: Article[];
  GetArticleActif(): void {
    this.param_achat_service.GetArticleActif().pipe(
      //   catchError((error: HttpErrorResponse) => {
      //     let errorMessage = '';
      //     if (error.error instanceof ErrorEvent) {
      //     } else {
      //       alertifyjs.set('notifier', 'position', 'top-left');
      //       alertifyjs.error(` ${error.error.message}` + " Parametrage Failed");

      //     }
      //     return throwError(errorMessage);
      //   })

    )
      .subscribe((data: any) => {
        this.sourceProducts = data;
        this.cdr.markForCheck();
      });
    this.targetProducts = [];

  }



  company = new Array<ParamsModel>();
DesignationCompany =  'Company' ;
  GetCompany(): void {
    this.param_achat_service.GetParams(this.DesignationCompany).pipe(
      catchError(
        (error: HttpErrorResponse) => {
          timeout(35000)
          let errorMessage = '';

          if (error.error instanceof ErrorEvent) {
          } else {
            alertifyjs.set('notifier', 'position', 'top-left');
            alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + `${error.error.message}` + " Parametrage Failed");
          }
          return throwError(errorMessage);
        })
    )
      .subscribe((data: any) => {
        this.company = data;
      })
  }

  formatDate = new Array<any>();
  formatDates :any ;

  FormatDate = "FormatDate" ;
    GetFormatDate(): void {
      this.param_achat_service.GetParams(this.FormatDate).pipe(
        catchError(
          (error: HttpErrorResponse) => {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) {
            } else {
              alertifyjs.set('notifier', 'position', 'top-left');
              alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + `${error.error.message}` + " Parametrage Failed");
            }
            return throwError(errorMessage);
          })
      )
        .subscribe((data: any) => {
          this.formatDate = data.valeur;
          // let cliniq=(JSON.parse(sessionStorage.getItem('nomClinique')))[0].societe;
          // this.formatDates = this.formatDate.valeur
        })
    }
  
    RegionHonoraire = new Array<ParamsModel>();
    RegionHonoraireParams = "RegionHoraire" ;
      GetRegionHoraire(): void {
        this.param_achat_service.GetParams(this.RegionHonoraireParams).pipe(
          catchError(
            (error: HttpErrorResponse) => {
              let errorMessage = '';
              if (error.error instanceof ErrorEvent) {
              } else {
                alertifyjs.set('notifier', 'position', 'top-left');
                alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + `${error.error.message}` + " Parametrage Failed");
              }
              return throwError(errorMessage);
            })
        )
          .subscribe((data: any) => {
            this.RegionHonoraire = data;
          })
      }
    



  DeleteddeAchat(code: any) {
    this.param_achat_service.DeleteDdeAchat(code).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
        } else {
          alertifyjs.set('notifier', 'position', 'top-left');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");
        }
        return throwError(errorMessage);
      })

    ).subscribe(
      (res) => {
        alertifyjs.set('notifier', 'position', 'top-left');
        alertifyjs.success("Success Deleted");
        this.ngOnInit();
        this.check_actif = true;
        this.check_inactif = false;

      }
    )
  }
  clearSelected(): void {
    this.code == undefined;
    this.codeSaisie = '';
    this.designation = '';
    this.actif = false;
    // this.codeFilialle = [];
  }
// videtable ():void{
//    document.getElementById('main-container').reset();

// }
  public onOpenModal(mode: string) {
    // this.showForm = true;
    // 

    
    this.visibleModal = false;
    this.visDelete = false;
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#Modal');
      this.formHeader = "Nouveau Mode Reglemnt"
      // this.codeSaisie = this.compteurs;
      this.onRowUnselect(event);
      // this.code ==null;
      this.clearSelected();
      this.actif = false;
      this.visibleModal = true;
      this.code == undefined;
      // this.codeFilialle = [];
      // this.getAllArticleModal();


    }
    if (mode === 'edit') {


      if (this.code == undefined) {
        // alert("Choise A row Please");

        //  
        this.onRowUnselect(event);
        alertifyjs.set('notifier', 'position', 'top-left');
        alertifyjs.error("Choise A row Please");
        this.visDelete == false && this.visibleModal == false
      } else {

        button.setAttribute('data-target', '#Modal');
        this.formHeader = "تعديل طلب تحويل "
        // this.GetDesignationFL();
        // this.GetDesignationFLSelected(this.codeFilialle);
        // this.GetDesignationAdress();
        this.visibleModal = true;
        this.onRowSelect;
        // this.getAllArticleModal();
        // this.getAllFilialleModalModifier();

      }

      // }
      // }

    }
    // if (mode === 'delete') {
    //   button.setAttribute('data-target', '#deletePL');
    // }
    // if (mode === 'Voir') {
    //   button.setAttribute('data-target', '#voirPL');
    //   this.formHeader = "عرض فرع "

    // }

    if (mode === 'Delete') {

      if (this.code == undefined) {
        // alert("Choise A row Please");

        // 
        this.onRowUnselect;
        alertifyjs.set('notifier', 'position', 'top-left');
        alertifyjs.error("Choise A row Please");
        this.visDelete == false && this.visibleModal == false
      } else {

        {
          button.setAttribute('data-target', '#ModalDelete');
          this.formHeader = "حذف طلب تحويل "
          this.visDelete = true;

        }
      }

    }

  }

  coutdemande= "3200";
  codeDemandeur !: number;
  userCreate= "soufien";
  // datecreate !: Date;
  currentDate = new Date();
  // today = new Date();
  // changedDate! : string |"" ;
  // pipe = new DatePipe('en-US');
  // changeFormat(today){
  //   let ChangedFormat = this.pipe.transform(this.today, 'dd/MM/YYYY');
  //   this.changedDate = ChangedFormat;
  //   console.log(this.changedDate);
  // }
  ajusterHourAndMinutes(){
    let hour=new Date().getHours();
    let hours;
    if(hour<10){
     hours='0'+hour;
    }else {
      hours=hour;
    }
    let min=new Date().getMinutes();
    let mins;
    if(min<10){
     mins='0'+min;
    }else{
      mins=min;
    }
    return hours+':'+mins
  }
  datform = new Date();
  PostDdeAchat() {
    // let form= this.formatDate.valeur;
    // this.datecreate = new Date();
    // let x=('0' + new Date().getDate()).slice(-2) + '/' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '/' + new Date().getFullYear()+'T'+this.ajusterHourAndMinutes();
    // let x=new Date().getFullYear()+'/' +('0' + (new Date().getMonth() + 1)).slice(-2) + '/' + ('0' + new Date().getDate()).slice(-2)  + 'T'+ ('0' + new Date().getHours()).slice(-2) +':'+ ('0' + new Date().getMinutes()).slice(-2) +':'+('0' + new Date().getSeconds()).slice(-2) +':'+ ('0' + new Date().getMilliseconds()).slice(-2)+':'+ ('0' + new Date().getTimezoneOffset()).slice(-2) ;
// let y = formatDate(new Date(),format('YYYY-MM-DD h:mm:ss'))
// let y = 
    let body = {
      coutdemande: this.coutdemande,
      codeDemandeur: this.codeModeReglementDde,  
      etatdemande: "PRL",
      nom_Demandeur: "soufien",
      userCreate: this.userCreate,
      
      dateCreate: new Date().toISOString(), //
      code: this.code,
      

    }
    if (this.code != null) {
      body['code'] = this.code;

      // this.param_achat_service.GetModeReglementActifAndVisible().pipe(
      //   catchError((error: HttpErrorResponse) => {
      //     let errorMessage = '';
      //     if (error.error instanceof ErrorEvent) {
      //     } else {
      //       alertifyjs.set('notifier', 'position', 'top-left');
      //       alertifyjs.error(` ${error.error.message}`);
      //     }
      //     return throwError(errorMessage);
      //   })

      // ).subscribe(

      //   (res) => {
      //     alertifyjs.set('notifier', 'position', 'top-left');
      //     alertifyjs.success("update Success Saved");
      //     close();
      //     this.clearForm();
      //     this.ngOnInit();
      //     this.check_actif = true;
      //     this.check_inactif = false;
      //   }
      // );


    }
    else {
      this.param_achat_service.PostDdeTransfert(body).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) { } else {
            alertifyjs.set('notifier', 'position', 'top-left');
            alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");
            // this.showToast1();
          }
          return throwError(errorMessage);
        })
      ).subscribe(
        (res) => {
          // alertifyjs.set('notifier', 'position', 'top-left');
          // alertifyjs.success("Success Saved");
          // this.showToast1(error);
          // this.CloseForm();
          this.clearForm();
          this.ngOnInit();
          this.code;
          this.check_actif = true;
          this.check_inactif = false;

        }
      )
    }
  }
  codeAdressFilialle: {}[] = [];

  our = new Array<any>();
  pushvalue = new Array<any>();
  GetArticleActifs(): void {
    this.param_achat_service.GetArticleActif().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
        } else {
          alertifyjs.set('notifier', 'position', 'top-left');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");
        }
        return throwError(errorMessage);
      })
    )
      .subscribe((data: any) => {
        this.products = data;
        this.our = [];
        for (let i = 0; i < data["length"]; i++) {
        }
        this.pushvalue = this.our;
      });
  }
  // clears(table: Table) {
  //   table.lazy = false;
  //   table.clear();
  //   table.lazy = true;
  //   table.clear();
    
  // }
  
  Voids():void{
    this.cars = [

    ].sort((car1, car2) => {
      return 0;
    });

  }
  onRowEditInit(car: Articles) {
    this.clonedCars[car.code_saisie] = { ...car };
  }


public remove( index: number): void {
  this.listDesig.splice(index, 1);
  console.log(index);
 }
  onRowEditSave(car: Articles) {
    delete this.clonedCars[car.code_saisie];
  }

  onRowEditCancel(car: Articles, index: number) {
    this.cars[index] = this.clonedCars[car.code_saisie];
    delete this.clonedCars[car.code_saisie];
  }




  dataArticle = new Array<Article>();
  listarticlepushed = new Array<any>();
  listarticlerslt = new Array<any>();
  getAllArticleModal() {
    this.param_achat_service.GetArticleActif().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-left');
          alertifyjs.error(` ${error.error.message}`);
        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.dataArticle = data;
      this.listarticlepushed = [];
      for (let i = 0; i < this.dataArticle.length; i++) {
        this.listarticlepushed.push({ label: this.dataArticle[i].designation, value:  this.dataArticle[i].code  })
      }
      this.listarticlerslt = this.listarticlepushed;
    })
    // })
  }
  selectedarticle:any;
  compteur: number = 0;
  listDesig = new Array<any>();
  OnBlur() {
    var exist = false;
    for (var y = 0; y < this.cars.length; y++) {
      if (this.selectedarticle.code != this.cars[y].code) {
        exist = false;
      } else {
        exist = true;
        break;
      }
    }
    if ((this.selectedarticle != undefined) && (this.selectedarticle != "") && (!exist)) {
      this.param_achat_service.GetArticleBycode(this.selectedarticle).subscribe((data:any) => {
      this.cars[this.compteur] = data;
      this.compteur = this.compteur + 1;
      this.listDesig.push(data);
      })
    }
  }
  clickDropDownUp(dropDownModUp:any) {
    if ((dropDownModUp.documentClickListener !== undefined && dropDownModUp.selectedOption !== null && dropDownModUp.itemClick) || dropDownModUp.itemClick) {
      dropDownModUp.focus();
      if (!dropDownModUp.overlayVisible) {
        dropDownModUp.show();
        event!.preventDefault();
      } else {
        dropDownModUp.hide();
        event!.preventDefault();
      }
    }
  }
  cars!: Array<Articles>;
  brands!: SelectItem[];
  clonedCars: { [s: string]: Articles } = {};
  NewDate = new Date();
  codeModeReglementDde : {}[] = [];
  dataModeReglementDde = new Array<Article>();
  listModeReglementPushed = new Array<any>();
  listModeReglementRslt = new Array<any>();
  GelAllModeReglementActif() {
    this.param_achat_service.GetModeReglementActif().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-left');
          alertifyjs.error(` ${error.error.message}`);
        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.dataModeReglementDde = data;
      this.listModeReglementPushed = [];
      for (let i = 0; i < this.dataModeReglementDde.length; i++) {
        this.listModeReglementPushed.push({ label: this.dataModeReglementDde[i].designation, value:  this.dataModeReglementDde[i].code  })
      }
      this.listModeReglementRslt = this.listModeReglementPushed;
    })
    // })
  }
}
export interface Articles {
  code:number;
  code_saisie: string;
  designation: string;
  actif: string;
  qte:number;
}




