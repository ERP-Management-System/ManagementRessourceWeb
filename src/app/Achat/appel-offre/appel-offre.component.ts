import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component,  ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import {   FormBuilder  } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { catchError, throwError  } from 'rxjs';
import { Table } from 'primeng/table';

import * as alertifyjs from 'alertifyjs'  
import { AO, AppelOffre, Coloris, DetailsAppelOffre, Matiere, ModeReglement, TypeCaisse, Unite } from 'src/app/parametrageCenral/domaine/ParametrageCentral';
import { ParametrageCentralService } from 'src/app/parametrageCenral/ParametrageCentralService/parametrage-central.service';


declare const PDFObject: any;
@Component({
  selector: 'app-appel-offre',
  templateUrl: './appel-offre.component.html',
  styleUrl: './appel-offre.component.css', providers: [ConfirmationService, MessageService]
})
export class AppelOffreComponent  implements OnInit  {
  cars!:any[];
  cols!: any[];
  // colors!: SelectItem<any>[];
  // colors! : Array<any>;

  v1!:any[];
  v2!: any[];
  // colors: SelectItem[];

  // colorNames = ['Orange', 'Black', 'Gray', 'Blue', 'Orange', 'Yellow'];
  
  // uniteNames = ['Piece', 'Metre'];


  openModal!: boolean;


  constructor(private confirmationService: ConfirmationService,
     private param_achat_service: ParametrageCentralService, private messageService: MessageService, private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) 
  {
  
    
  }

  pdfData!: Blob;
  isLoading = false;
  ngOnInit(): void {

    this.GelAllAppelOffre();
    // this.Voids();
this.VoidsNew();
 
    
    this.v2 = [
      { field: 'codeSaisie', header: 'Code Saisie' },
      { field: 'designationAr', header: 'Designation' },
      { field: 'unite', header: 'Unite' },
      { field: 'coloris', header: 'Coloris' },
      { field: 'quantite', header: 'Quantite' },
      // { field: 'delete', header: 'Delete' },
    ];
    
    // this.v1 = [
    //   {"designation": "VW", "unite": 2012, "coloris": "Orange", "quantite": "dsad231ff"}
    // ];

  }
 
  RemplirePrint(): void {

    this.param_achat_service.getPDFf().subscribe(blob => {
      const reader = new FileReader();
      const binaryString = reader.readAsDataURL(blob);
      reader.onload = (event: any) => {
        //Here you can do whatever you want with the base64 String
        // console.log("File in Base64: ", event.target.result);
        this.pdfData = event.target.result;
        this.isLoading = false;
        if (this.pdfData) {
          this.handleRenderPdf(this.pdfData);
        }
      };

      reader.onerror = (event: any) => {
        console.log("File could not be read: " + event.target.error.code);
      };
    });

  }

  handleRenderPdf(data: any) {
    const pdfObject = PDFObject.embed(data, '#pdfContainer');
  }


  // desig: string = 'AR'
  // FormControl = new Array<FormControl>();
  // GetFormName(): void {
  //   this.param_achat_service.GetFormControlName(this.desig).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       let errorMessage = '';
  //       if (error.error instanceof ErrorEvent) {
  //       } else {
  //         alertifyjs.set('notifier', 'position', 'top-right');
  //         alertifyjs.error(` ${error.error.message}` + " Parametrage Failed");
  //       }
  //       return throwError(errorMessage);
  //     })

  //   )
  //     .subscribe((data: any) => {
  //       this.FormControl = data
  //       this.searchTerm = '';
  //       this.check_actif = true
  //       this.check_inactif = false
  //     });
  // }

  clear(table: Table) {
    table.clear();
    this.searchTerm = '';
  }

  clearForm() {
    this.code == undefined;
    this.designationAr = '';
    this.designationLt = '';
    this.actif = false;
    this.visible = false;
    this.codeSaisie = ''; 
    this.selectedCodeModeReglement = ''
    // this.listTypeAppelOffreRslt = []; 
    this.onRowUnselect(event);

  }
  check_actif = false;
  check_inactif = false;

  formHeader = "....."; 
  searchTerm = '';
  visibleModal: boolean = false;
  visibleModalPrint: boolean = false;
  visDelete: boolean = false;
  code!: number | null;
  codeSaisie: any;
  designationAr: any;
  designationLt: string = "NULL";
  codeTypeCaisse: number = 0;
  codeBanque: string = "NULL";
  actif!: boolean;
  visible!: boolean;

  selectedModeReglement!: ModeReglement; 
  // selectedCar!: string;
  onRowSelect(event: any) {
    this.code = event.data.code;
    this.actif = event.data.actif;
    this.visible = event.data.visible;
    this.codeSaisie = event.data.codeSaisie;
    this.designationAr = event.data.designationAr;
    this.designationLt = event.data.designationLt;
    this.selectedCodeModeReglement = event.data.codeModeReglement; 

    console.log('vtData : ', event);
  }
  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
  }

  //   ngOnInit() {

  //  }



  ///////////////////////////////////////////////////////////////////////////////////////////////
  // article!: Article[];
  // GetArticleActif(): void {
  //   this.param_achat_service.GetArticleActif().pipe(
  //     //   catchError((error: HttpErrorResponse) => {
  //     //     let errorMessage = '';
  //     //     if (error.error instanceof ErrorEvent) {
  //     //     } else {
  //     //       alertifyjs.set('notifier', 'position', 'top-right');
  //     //       alertifyjs.error(` ${error.error.message}` + " Parametrage Failed");

  //     //     }
  //     //     return throwError(errorMessage);
  //     //   })

  //   )
  //     .subscribe((data: any) => {
  //       this.sourceProducts = data;
  //       this.cdr.markForCheck();
  //     });
  //   this.targetProducts = [];

  // }



  //   company = new Array<ParamsModel>();
  // DesignationCompany =  'Company' ;
  //   GetCompany(): void {
  //     this.param_achat_service.GetParams(this.DesignationCompany).pipe(
  //       catchError(
  //         (error: HttpErrorResponse) => {
  //           timeout(35000)
  //           let errorMessage = '';

  //           if (error.error instanceof ErrorEvent) {
  //           } else {
  //             alertifyjs.set('notifier', 'position', 'top-right');
  //             alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + `${error.error.message}` + " Parametrage Failed");
  //           }
  //           return throwError(errorMessage);
  //         })
  //     )
  //       .subscribe((data: any) => {
  //         this.company = data;
  //       })
  //   }

  //   formatDate = new Array<any>();
  //   formatDates :any ;

  // FormatDate = "FormatDate" ;
  //   GetFormatDate(): void {
  //     this.param_achat_service.GetParams(this.FormatDate).pipe(
  //       catchError(
  //         (error: HttpErrorResponse) => {
  //           let errorMessage = '';
  //           if (error.error instanceof ErrorEvent) {
  //           } else {
  //             alertifyjs.set('notifier', 'position', 'top-right');
  //             alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + `${error.error.message}` + " Parametrage Failed");
  //           }
  //           return throwError(errorMessage);
  //         })
  //     )
  //       .subscribe((data: any) => {
  //         this.formatDate = data.valeur;
  //         // let cliniq=(JSON.parse(sessionStorage.getItem('nomClinique')))[0].societe;
  //         // this.formatDates = this.formatDate.valeur
  //       })
  //   }

  // RegionHonoraire = new Array<ParamsModel>();
  // RegionHonoraireParams = "RegionHoraire" ;
  //   GetRegionHoraire(): void {
  //     this.param_achat_service.GetParams(this.RegionHonoraireParams).pipe(
  //       catchError(
  //         (error: HttpErrorResponse) => {
  //           let errorMessage = '';
  //           if (error.error instanceof ErrorEvent) {
  //           } else {
  //             alertifyjs.set('notifier', 'position', 'top-right');
  //             alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + `${error.error.message}` + " Parametrage Failed");
  //           }
  //           return throwError(errorMessage);
  //         })
  //     )
  //       .subscribe((data: any) => {
  //         this.RegionHonoraire = data;
  //       })
  //   }




  DeleteAppelOffre(code: any) {
    this.param_achat_service.DeleteAppelOffre(code).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
        } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");
        }
        return throwError(errorMessage);
      })

    ).subscribe(
      (res:any) => {
        alertifyjs.set('notifier', 'position', 'top-right');
        alertifyjs.success('<i class="success fa fa-chevron-down" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + "Success Deleted");

        this.ngOnInit();
        this.check_actif = true;
        this.check_inactif = false;

      }
    )
  }
  clearSelected(): void {
    this.code == undefined;
    this.codeSaisie = '';
    this.designationAr = '';
    this.designationLt = '';
    this.actif = false;
    // this.codeFilialle = [];
  }
  // videtable ():void{
  //    document.getElementById('main-container').reset();

  // }



  
  public onOpenModal(mode: string) {

    // this.getListActionBloc();

///// tessttt dropdown  with table





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
      this.formHeader = "Nouveau AppelOffre"
      // this.codeSaisie = this.compteurs;
      this.onRowUnselect(event);
      // this.code ==null;
      this.clearSelected();
      this.actif = false;
      this.visibleModal = true;
      this.code == undefined; 
      this.GelMatiereActifVisible();
      this. GelAllModeReglement();
      this.GelUniteActifVisible();
      this.GetColorisActifVisible(); 
      
    }
    if (mode === 'edit') {


      if (this.code == undefined) {
        // alert("Choise A row Please");

        //  
        this.clearForm(); 
        this.onRowUnselect(event);
        alertifyjs.set('notifier', 'position', 'top-right');
        alertifyjs.error("Choise A row Please");
        this.visDelete == false && this.visibleModal == false
      } else {

        button.setAttribute('data-target', '#Modal');
        this.formHeader = "Edit AppelOffre"
        // this.GetDesignationFL();
        // this.GetDesignationFLSelected(this.codeFilialle);
        this.GelMatiereActifVisible();
        this.visibleModal = true;
        this.onRowSelect;
        this. GelAllModeReglement();

        this.GetColorisActifVisible();
        this.GelUniteActifVisible();
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
        alertifyjs.set('notifier', 'position', 'top-right');
        alertifyjs.error("Choise A row Please");
        this.visDelete == false && this.visibleModal == false
      } else {

        {
          button.setAttribute('data-target', '#ModalDelete');
          this.formHeader = "Delete Appel D'Offre"
          this.visDelete = true;
          this.GelMatiereActifVisible();
          this. GelAllModeReglement();
        }
      }

    }

    if (mode === 'Print') {

    
      button.setAttribute('data-target', '#ModalPrint');
      this.formHeader = "Imprimer Liste Reglement"
      this.visibleModalPrint = true;
      this.RemplirePrint();
 

    }

  }

    
  userCreate = "soufien";
  // datecreate !: Date;
  currentDate = new Date(); 

  ajusterHourAndMinutes() {
    let hour = new Date().getHours();
    let hours;
    if (hour < 10) {
      hours = '0' + hour;
    } else {
      hours = hour;
    }
    let min = new Date().getMinutes();
    let mins;
    if (min < 10) {
      mins = '0' + min;
    } else {
      mins = min;
    }
    return hours + ':' + mins
  }
  datform = new Date();
  PostAppelOffre() {
    // let form= this.formatDate.valeur;
    // this.datecreate = new Date();
    // let x=('0' + new Date().getDate()).slice(-2) + '/' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '/' + new Date().getFullYear()+'T'+this.ajusterHourAndMinutes();
    // let x=new Date().getFullYear()+'/' +('0' + (new Date().getMonth() + 1)).slice(-2) + '/' + ('0' + new Date().getDate()).slice(-2)  + 'T'+ ('0' + new Date().getHours()).slice(-2) +':'+ ('0' + new Date().getMinutes()).slice(-2) +':'+('0' + new Date().getSeconds()).slice(-2) +':'+ ('0' + new Date().getMilliseconds()).slice(-2)+':'+ ('0' + new Date().getTimezoneOffset()).slice(-2) ;
    // let y = formatDate(new Date(),format('YYYY-MM-DD h:mm:ss'))
    // let y = 

    // if (this.designationAr ==null) throw   new   


    // ;

    if (!this.designationAr || !this.designationLt || !this.selectedCodeModeReglement || !this.codeSaisie) {
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Field Required");

    } else {


      let body = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        codeModeReglement: this.selectedCodeModeReglement, 
        userCreate: this.userCreate,
        codeFournisseur :null,
        dateCreate: new Date().toISOString(), //
        code: this.code,
        actif: this.actif,
        visible: this.visible,

      }
      if (this.code != null) {
        body['code'] = this.code;

        this.param_achat_service.UpdateAppelOffre(body).pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) {
            } else {
              alertifyjs.set('notifier', 'position', 'top-right');
              alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

            }
            return throwError(errorMessage);
          })

        ).subscribe(

          (res: any) => {
            alertifyjs.set('notifier', 'position', 'top-right');
            alertifyjs.success('<i class="success fa fa-chevron-down" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + "Success Updated");
            this.visibleModal = false;
            this.clearForm();
            this.ngOnInit();
            this.check_actif = true;
            this.check_inactif = false;
            this.onRowUnselect(event);
            this.clearSelected();

          }
        );


      }
      else {
        this.param_achat_service.PostModeReglement(body).pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) { } else {
              alertifyjs.set('notifier', 'position', 'top-right');
              alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

            }
            return throwError(errorMessage);
          })
        ).subscribe(
          (res:any) => {
            alertifyjs.set('notifier', 'position', 'top-right');
            // alertifyjs.success("Success Saved");
            alertifyjs.success('<i class="success fa fa-chevron-down" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + "Success Saved");
            this.visibleModal = false;
            this.clearForm();
            this.ngOnInit();
            this.code;
            this.check_actif = true;
            this.check_inactif = false;
            this.onRowUnselect(event);
            this.clearSelected();

          }
        )
      }
    }


  }
 

  Voids(): void {
    this.matieres = [

    ].sort((car1, car2) => {
      return 0;
    });

  }
  // onRowEditInit(car: AppelOffre) {
  //   this.clonedCars[car.codeSaisie] = { ...car };
 

  // }


  public remove(index: number): void {
    this.listDesig.splice(index, 1);
    console.log("index",index);
  }

 
  // onRowEditSave(car: AppelOffre) {
  //   delete this.clonedCars[car.codeSaisie];
  // }

  // onRowEditCancel(car: AppelOffre, index: number) {
  //   this.cars[index] = this.clonedCars[car.codeSaisie];
  //   delete this.clonedCars[car.codeSaisie];
  // }

  types!: any[];






  selectedMatiere: any;
  selectedCodeModeReglement: any;
  compteur: number = 0;
  listDesig = new Array<any>();
  matieres!: Matiere[];

  


 
  MouveToTable() {
  
    console.log( "selectedMatiere MouveToTable" ,this.selectedMatiere)
    console.log( "matieres MouveToTable " ,this.matieres)
    var exist = false;
    for (var y = 0; y < this.matieres.length; y++) {
      if (this.selectedMatiere != this.matieres[y].code) {
        exist = false;
      } else {
        exist = true;

        alertifyjs.set('notifier', 'position', 'top-right');
        alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + "Matière déjà choisie");

        break;
      }
    }
    if ((this.selectedMatiere != undefined) && (this.selectedMatiere != "") && (!exist)) {
      this.param_achat_service.GetMatiereByCode(this.selectedMatiere).subscribe((xxx: any) => {
        console.log( "mouve selectedMatiere after get " ,this.selectedMatiere)
        console.log( "mouve matieres after get " ,this.matieres)
        this.matieres[this.compteur] = xxx;
        this.compteur = this.compteur + 1;
        this.listDesig.push(xxx);
      })
    }
  }
  clickDropDownUp(dropDownModUp: any) {
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



    
  articles!: Matiere[];
  selectedarticle: any;
  // compteur: number = 0;
  listDesig2 = new Array<any>();
  MouveToTableNew() {
    var exist = false;
    for (var y = 0; y < this.listDesig2.length; y++) {
      if (this.selectedarticle != this.listDesig2[y].code) {
        exist = false;
      } else {
        exist = true;

        alertifyjs.set('notifier', 'position', 'top-left');
        alertifyjs.error('Item Used');
        break;
      }
    }
    if ((this.selectedarticle != undefined) && (this.selectedarticle != "") && (!exist)) {
      this.param_achat_service.GetMatiereByCode(this.selectedarticle).subscribe((xxx: any) => {
        this.articles[this.compteur] = xxx;
        this.compteur = this.compteur + 1;
        this.listDesig2.push(xxx);
      })
    }
  }



  VoidsNew(): void {
    this.articles = [

    ].sort((car1, car2) => {
      return 0;
    });

  }
 

  public removeNew(index: number): void {
    this.listDesig2.splice(index, 1);
    console.log(index);
    // 
  }





  // cars!: Array<AppelOffre>;
  brands!: SelectItem[];
  clonedCars: { [s: string]: AppelOffre } = {}; 
  codeModeReglementDde: {}[] = [];
  dataAppelOffre = new Array<AppelOffre>();
  banque: any; 
  GelAllAppelOffre() {
    this.param_achat_service.GetAppelOffre().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {



      this.dataAppelOffre = data;
      this.onRowUnselect(event);
 
    }) 
  }

 
  dataModeReglement = new Array<ModeReglement>();
  listModeReglementPushed = new Array<any>();
  listModeReglementRslt = new Array<any>();
  GelAllModeReglement() {
    this.param_achat_service.GetAllModeReglement().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.dataModeReglement = data;
      this.listModeReglementPushed = [];
      for (let i = 0; i < this.dataModeReglement.length; i++) {
        this.listModeReglementPushed.push({ label: this.dataModeReglement[i].designationAr, value: this.dataModeReglement[i].code })
      }
      this.listModeReglementRslt = this.listModeReglementPushed;
    }) 
  }



  
 
  dataMatiere = new Array<Matiere>();
  listMatierePushed = new Array<any>();
  listMatiereRslt = new Array<any>();
  GelMatiereActifVisible() {
    this.param_achat_service.GetMatiere().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.dataMatiere = data;
      this.listMatierePushed = [];
      for (let i = 0; i < this.dataMatiere.length; i++) {
        this.listMatierePushed.push({ label: this.dataMatiere[i].designationAr, value: this.dataMatiere[i].code })
      }
      this.listMatiereRslt = this.listMatierePushed;
    }) 
  }



  DataUnite = new Array<Unite>();
  listUnitePushed = new Array<any>();
  listUniteRslt = new Array<any>();
  selectedUnite:any;
  GelUniteActifVisible() {
    this.param_achat_service.GetUnite().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.DataUnite = data;
      this.listUnitePushed = [];
      for (let i = 0; i < this.DataUnite.length; i++) {
        this.listUnitePushed.push({ label: this.DataUnite[i].designationAr, value: this.DataUnite[i].codeSaisie  })
      }
      this.listUniteRslt = this.listUnitePushed;
    }) 
  }
 
  unite = this.listUniteRslt.map((name) => {
    return { label: name, value: name }
  }); 




  
  DataColoris = new Array<Coloris>();
  listColorisPushed = new Array<any>();
  listColorisRslt = new Array<Coloris>();
  selectedColoris: any | "";
  GetColorisActifVisible() {
    this.param_achat_service.GetColoris().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.DataColoris = data;
      this.listColorisPushed = [];
      for (let i = 0; i < this.DataColoris.length; i++) {
        this.listColorisPushed.push({ label: this.DataColoris[i].designationAr, value: this.DataColoris[i].codeSaisie  })
      }
      this.listColorisRslt = this.listColorisPushed;
    }) 
  }

 
  colors = this.listColorisRslt.map((name) => {
    return { label: name, value: name }
  }); 

  actionBlocs:any;
  listeActionBlocs = new Array<any>();
  getListActionBloc() {
    this.listeActionBlocs = [];
    this.param_achat_service.GetAllBanque().subscribe(data => {
      this.actionBlocs = data;
      for (let i = 0; i < this.actionBlocs.length; i++) {
        this.listeActionBlocs.push({ label: this.actionBlocs[i].designationAr, value: this.actionBlocs[i].code });
      }
    });
  }

  codeEtatSelec: string = '';
}
 


