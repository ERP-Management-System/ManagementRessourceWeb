import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ChangeDetectorRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { catchError, Subject, throwError } from 'rxjs';
import { Table } from 'primeng/table';

import * as alertifyjs from 'alertifyjs'
import { AO, AODetails, AppelOffre, Coloris, DetailsAppelOffre, Matiere, ModeReglement, TypeCaisse, Unite } from 'src/app/parametrageCenral/domaine/ParametrageCentral';
import { ParametrageCentralService } from 'src/app/parametrageCenral/ParametrageCentralService/parametrage-central.service';


declare const PDFObject: any;



@Component({
  selector: 'app-appel-offre',
  templateUrl: './appel-offre.component.html',
  styleUrl: './appel-offre.component.css', providers: [ConfirmationService, MessageService]
})
export class AppelOffreComponent {

  dtTrigger: Subject<any> = new Subject();

  selectedUniteForPush(event: any) {
    console.log(event.target.value)
    // this.listDataAOWithDetails.push(event.target.value);
    // this.codeUnite = event.target.value
  }
  selectedColorisForPush(event: any) {
    console.log(event.target.value)
    // this.listDataAOWithDetails.push(event.target.value);

  }


  public ProductHeader = [
    { name: "test", code: "1" },
    { name: "test1", code: "2" },
    { name: "test2", code: "3" },
    { name: "test3", code: "4" },
    { name: "test4", code: "5" }
  ];
  persons: any = [];


  cars!: any[];
  cols!: any[];
  // colors!: SelectItem<any>[];
  // colors! : Array<any>;

  v1!: any[];
  v2!: any[];
  // colors: SelectItem[];

  // colorNames = ['Orange', 'Black', 'Gray', 'Blue', 'Orange', 'Yellow'];

  // uniteNames = ['Piece', 'Metre'];


  openModal!: boolean;


  constructor(private confirmationService: ConfirmationService,
    private param_achat_service: ParametrageCentralService, private messageService: MessageService, private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {


  }
  selectedMatiere: any;

  owner = [1, 2, 3];

  selectedId: any;
  brandss = [
    {
      Id: 1,
      name: "test"
    },
    {
      Id: 2,
      name: "test2"
    },
    {
      Id: 3,
      name: "test3"
    }
  ];


  pdfData!: Blob;
  isLoading = false;
  ngOnInit(): void {



    this.GelAllAppelOffre();
    // this.Voids();
    this.VoidsNew();

    this.v2 = [
      { field: 'codeSaisie', header: 'Code Saisie' },
      { field: 'designationAr', header: 'Designation', style: 'width: 100px !important;' },
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
    this.selectedModeReglement = '';
    this.selectedMatiereToAdd='';
    // this.listTypeAppelOffreRslt = []; 
    this.onRowUnselect(event);
    this.listDataAOWithDetails = new Array<any>();
  }
  check_actif = false;
  check_inactif = false;

  formHeader = ".....";
  searchTerm = '';
  // visibleModal: boolean = false;
  visibleNewModal: boolean = false;
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

  selectedAppelOffre!: AppelOffre;
  // selectedModeReglement!:ModeReglement;
  selectedModeReglement: any;
  // selectedCar!: string;
  onRowSelect(event: any) {
    this.code = event.data.code;
    this.actif = event.data.actif;
    this.visible = event.data.visible;
    this.codeSaisie = event.data.codeSaisie;
    this.designationAr = event.data.designationAr;
    this.designationLt = event.data.designationLt;
    this.selectedModeReglement = event.data.codeModeReglement; 
    this.observation = event.data.observation;
    console.log('vtData : ', event);
  }
  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
    // this.listDataAOWithDetails = new Array<any>();
    this.selectedModeReglement =null;
    this.selectedMatiereToAdd =null;
    this.observation =null;
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
      (res: any) => {
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
    this.listDataAOWithDetails = new Array<any>();
    // this.codeFilialle = [];
  }
  // videtable ():void{
  //    document.getElementById('main-container').reset();

  // }




  public onOpenModal(mode: string) {


    // this.visibleNewModal = false;
    // this.visDelete = false;
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'Newadd') {
      button.setAttribute('data-target', '#NewModal');
      this.formHeader = "Nouveau Appel Offre";
      // document.getElementById('DecontamBoiteBloc').style.display = 'none';
    
      this.listDataAOWithDetails = new Array<any>();
      this.onRowUnselect(event); 
      this.clearSelected();
      this.actif = false;
      this.visibleNewModal = true;
      this.visDelete = false;
      this.code == undefined;
      this.GelMatiereActifVisible();
      this.GelAllModeReglement();
      this.GelUniteActifVisible();
      this.GetColorisActifVisible();

    }else
    if (mode === 'edit') {

      // this.visibleNewModal = false;
      // this.visDelete = false;
      if (this.code == undefined) {
        // alert("Choise A row Please");

         this.visDelete = false ; this.visibleNewModal = false
        this.clearForm();
        this.onRowUnselect(event);
        alertifyjs.set('notifier', 'position', 'top-right');
    
        alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' +   " Choise A row Please");

        // this.listDataAOWithDetails = new Array<any>();
   
      } else {

        button.setAttribute('data-target', '#NewModal');
        this.formHeader = "Edit Appel Offre"
 
        this.GelMatiereActifVisible();
     

        this.onRowSelect;
        this.GelAllModeReglement();

        this.GetColorisActifVisible();
        this.GelUniteActifVisible();
        this.GetAppelOffreByCode();
        this.visibleNewModal = true;
        this.visDelete = false;
      }

    }else

    if (mode === 'Delete') {

      if (this.code == undefined) {
        // alert("Choise A row Please");

        // 
        this.onRowUnselect;
        alertifyjs.set('notifier', 'position', 'top-right');
        alertifyjs.error("Choise A row Please");
        // this.visDelete = false ; this.visibleNewModal = false
      } else {

        {
          button.setAttribute('data-target', '#ModalDelete');
          this.formHeader = "Delete Appel D'Offre"
          
          this.GelMatiereActifVisible();
          this.GelAllModeReglement();
          this.visDelete = true;
          this.visibleNewModal = true;
        }
      }

    }
    // (mode === 'Print') 
    else {


      button.setAttribute('data-target', '#ModalPrint');
      this.formHeader = "Imprimer Liste Reglement"
      this.visibleModalPrint = true;
      this.RemplirePrint();


    }
    // if (mode === 'Newadd') {
    //   button.setAttribute('data-target', '#NewModal');
    //   this.formHeader = "Nouveau Appel Offre" 
    //   this.onRowUnselect(event); 
    //   this.clearSelected();
    //   this.actif = false;
    //   this.visibleNewModal = true;
    //   this.code == undefined;
    //   this.GelMatiereActifVisible();
    //   this.GelAllModeReglement();
    //   this.GelUniteActifVisible();
    //   this.GetColorisActifVisible();

    // }
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

  GetDataFromTableEditor: any;
  final = new Array<any>();
  codeColoris: any;
  qteDemander: any;
  codeSaisieMaitere: any;
  codeUnite: any;
  observation: any;
  // codeEtatReception:any;
  PostAppelOffre() {



    for (let y = 0; y < this.listDataAOWithDetails.length; y++) {
      this.GetDataFromTableEditor = {

        codematiere: { code: this.listDataAOWithDetails[y].codeMatieres },
        qteDemander: this.listDataAOWithDetails[y].qteDemander, userCreate: this.userCreate,
        codeUnite: { code: this.listDataAOWithDetails[y].codeUnites },
        codeColoris: { code: this.listDataAOWithDetails[y].codeColoriss },
      }
      this.final.push(this.GetDataFromTableEditor);
    }




    if (!this.designationAr || !this.designationLt || !this.selectedModeReglement || !this.codeSaisie) {
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Field Required");

    } else {


      let body = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        codeModeReglement: this.selectedModeReglement,
        userCreate: this.userCreate,
        codeFournisseur: null,
        // dateCreate: new Date().toISOString(), //
        code: this.code,
        actif: this.actif,
        visible: this.visible,
        detailsAppelOffreDTOs: this.final,
        observation: this.observation,
        codeEtatReception: "2"
      }

      

      if (this.code != null) {
        body['code'] = this.code;
        console.log("Body to Update", body)
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
 
            this.clearForm();
            this.ngOnInit();
            this.check_actif = true;
            this.check_inactif = false;
            this.onRowUnselect(event);
            this.clearSelected();
            this.visibleNewModal =false;
            this.visDelete =false;
             

          }
        );


      }
      else {
        console.log("Body to Post", body)
        this.param_achat_service.PostAppelOffre(body).pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) { } else {
              alertifyjs.set('notifier', 'position', 'top-right');
              alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

            }
            return throwError(errorMessage);
          })
        ).subscribe(
          (res: any) => {
            alertifyjs.set('notifier', 'position', 'top-right');
            // alertifyjs.success("Success Saved");
            alertifyjs.success('<i class="success fa fa-chevron-down" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + "Success Saved");
            this.visibleNewModal =false;
            this.visDelete =false;
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
    this.listDataAOWithDetails.splice(index, 1);
    console.log("index", index);
  }


  public pushCodeColoris(index: number): void {
    this.listDataAOWithDetails.push(index, this.selectedUniteForPush);
    console.log("index", index);
  }

  // onRowEditSave(car: AppelOffre) {
  //   delete this.clonedCars[car.codeSaisie];
  // }

  // onRowEditCancel(car: AppelOffre, index: number) {
  //   this.cars[index] = this.clonedCars[car.codeSaisie];
  //   delete this.clonedCars[car.codeSaisie];
  // }

  types!: any[];






  // selectedMatiere: any;
  selectedCodeModeReglement: any;
  compteur: number = 0;
  listDesig = new Array<any>();
  matieres!: Matiere[];





  // MouveToTable() {

  //   console.log("selectedMatiere MouveToTable", this.selectedMatiere)
  //   console.log("matieres MouveToTable ", this.matieres)
  //   var exist = false;
  //   for (var y = 0; y < this.matieres.length; y++) {
  //     if (this.selectedMatiere != this.matieres[y].code) {
  //       exist = false;
  //     } else {
  //       exist = true;

  //       alertifyjs.set('notifier', 'position', 'top-right');
  //       alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + "Matière déjà choisie");

  //       break;
  //     }
  //   }
  //   if ((this.selectedMatiere != undefined) && (this.selectedMatiere != "") && (!exist)) {
  //     this.param_achat_service.GetMatiereByCode(this.selectedMatiere).subscribe((xxx: any) => {
  //       console.log("mouve selectedMatiere after get ", this.selectedMatiere)
  //       console.log("mouve matieres after get ", this.matieres)
  //       this.matieres[this.compteur] = xxx;
  //       this.compteur = this.compteur + 1;
  //       this.listDesig.push(xxx);
  //     })
  //   }
  // }
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
  // selectedarticle: any;
  // compteur: number = 0;
  listDesig2 = new Array<any>();
  // MouveToTableNew() {
  //   var exist = false;
  //   for (var y = 0; y < this.listDesig2.length; y++) {
  //     if (this.selectedarticle != this.listDesig2[y].code) {
  //       exist = false;
  //     } else {
  //       exist = true;

  //       alertifyjs.set('notifier', 'position', 'top-left');
  //       alertifyjs.error('Item Used');
  //       break;
  //     }
  //   }
  //   if ((this.selectedarticle != undefined) && (this.selectedarticle != "") && (!exist)) {
  //     this.param_achat_service.GetMatiereByCode(this.selectedarticle).subscribe((xxx: any) => {
  //       this.articles[this.compteur] = xxx;
  //       this.compteur = this.compteur + 1;
  //       this.listDesig2.push(xxx);
  //       console.log(" MouveToTableNew listDesig2", this.listDesig2);
  //       console.log(" MouveToTableNew articles", this.articles);

  //     })
  //   }
  // }



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
  selectedUnite: any;
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
        this.listUnitePushed.push({ label: this.DataUnite[i].designationAr, value: this.DataUnite[i].code })
      }
      this.listUniteRslt = this.listUnitePushed;
    })
  }
  // unite = this.listUniteRslt.map((name) => {
  //   return { label: name, value: name }
  // });

  DataColoris = new Array<Coloris>();
  listColorisPushed = new Array<any>();
  listColorisRslt = new Array<any>();
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
        this.listColorisPushed.push({ label: this.DataColoris[i].designationAr, value: this.DataColoris[i].code })
      }
      this.listColorisRslt = this.listColorisPushed;
    })
  }


  selectedVal(val: any) {
    console.log(val);
  }
  cities = {};


  colors = this.listColorisRslt.map((name) => {
    return { label: name, value: name }
  });

  // actionBlocs: any;
  // listeActionBlocs = new Array<any>();
  // getListActionBloc() {
  //   this.listeActionBlocs = [];
  //   this.param_achat_service.GetAllBanque().subscribe(data => {
  //     this.actionBlocs = data;
  //     for (let i = 0; i < this.actionBlocs.length; i++) {
  //       this.listeActionBlocs.push({ label: this.actionBlocs[i].designationAr, value: this.actionBlocs[i].code });
  //     }
  //   });
  // }

  // codeEtatSelec: string = '';




  // new table angular material 




  // articles!: Matiere[];
  // selectedarticle: any;
  // // compteur: number = 0;
  // listDesig2 = new Array<any>();
  // MouveToTableNew() {
  //   var exist = false;
  //   for (var y = 0; y < this.listDesig2.length; y++) {
  //     if (this.selectedarticle != this.listDesig2[y].code) {
  //       exist = false;
  //     } else {
  //       exist = true;

  //       alertifyjs.set('notifier', 'position', 'top-left');
  //       alertifyjs.error('Item Used');
  //       break;
  //     }
  //   }
  //   if ((this.selectedarticle != undefined) && (this.selectedarticle != "") && (!exist)) {
  //     this.param_achat_service.GetMatiereByCode(this.selectedarticle).subscribe((xxx: any) => {
  //       this.articles[this.compteur] = xxx;
  //       this.compteur = this.compteur + 1;
  //       this.listDesig2.push(xxx);
  //       console.log(" MouveToTableNew listDesig2", this.listDesig2);
  //       console.log(" MouveToTableNew articles", this.articles);

  //     })
  //   }
  // }






  AODetails = new Array<AODetails>();
  selectedMatiereToAdd: any;
  ListMatiere!: Matiere[];
  listDataAOWithDetails = new Array<any>();
  Newcompteur: number = 0;
  codeMatieres:any;
  PushTableData() {
    var exist = false;
    // console.log(" PushTableData selectedMatiereToAdd", this.selectedMatiereToAdd );
    // console.log(" PushTableData listDataAOWithDetails", this.listDataAOWithDetails );

    for (var y = 0; y < this.listDataAOWithDetails.length; y++) {
      if (this.selectedMatiereToAdd != this.listDataAOWithDetails[y].code) {
        exist = false;
      } else {
        exist = true;

        alertifyjs.set('notifier', 'position', 'top-left');
        alertifyjs.error('Item Used');
        break;
      }
    }
    if ((this.selectedMatiereToAdd != undefined) && (this.selectedMatiereToAdd != "") && (!exist)) {
      this.param_achat_service.GetMatiereByCode(this.selectedMatiereToAdd).subscribe((Newdata: any) => {
        // this.ListMatiere[this.Newcompteur] = Newdata;
        this.Newcompteur = this.Newcompteur + 1;
        
        this.listDataAOWithDetails.push(Newdata);
        console.log(" PushTableData listDataAOWithDetails", this.listDataAOWithDetails);

        // console.log(" PushTableData articles", this.ListMatiere);

      })
    }
  }

 
  GetAppelOffreByCode() {

    this.param_achat_service.GetAppelOffreByCode(this.selectedAppelOffre.code).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => { 
      this.listDataAOWithDetails = new Array<any>();
      this.listDataAOWithDetails=data; 
      console.log("listDataAOWithDetails is ", this.listDataAOWithDetails);

      
    })
  }

}



