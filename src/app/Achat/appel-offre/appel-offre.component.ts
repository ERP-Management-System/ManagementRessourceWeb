import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ChangeDetectorRef, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
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



  v2!: any[];

  openModal!: boolean;
  highlighted: any;
  @ViewChild('draggable') private draggableElement!: ElementRef;

  constructor(private confirmationService: ConfirmationService,
    private param_achat_service: ParametrageCentralService, private messageService: MessageService, private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    // this.isRowSelectable = this.isRowSelectable.bind(this);

  }
  // isRowSelectable(event:any) {
  //   return !this.isOutOfStock(event.data);
  // }
  // isOutOfStock(data:any) {
  //   return data.quantity <= 10;
  // }
  selectedMatiere: any;

  // owner = [1, 2, 3];

  // selectedId: any;
  // brandss = [
  //   {
  //     Id: 1,
  //     name: "test"
  //   },
  //   {
  //     Id: 2,
  //     name: "test2"
  //   },
  //   {
  //     Id: 3,
  //     name: "test3"
  //   }
  // ];


  pdfData!: Blob;
  isLoading = false;
  ngOnInit(): void {

    this.ionViewDidLoad();

    this.GelAllAppelOffre();
    this.VoidsNew();

    this.v2 = [
      { field: 'codeSaisie', header: 'Code Saisie' },
      { field: 'designationAr', header: 'Designation', style: 'width: 100px !important;' },
      { field: 'unite', header: 'Unite' },
      { field: 'coloris', header: 'Coloris' },
      { field: 'quantite', header: 'Quantite' },
      // { field: 'delete', header: 'Delete' },
    ];


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
    this.selectedMatiereToAdd = '';
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
  code!: any | null;
  codeSaisie: any;
  designationAr: any;
  designationLt: string = "NULL";
  codeTypeCaisse: number = 0;
  codeBanque: string = "NULL";
  actif!: boolean;
  visible!: boolean;

  // selectedAppelOffre= new Array<AppelOffre>;


  selectedAppelOffre!: any;


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
    this.selectedAppelOffre == null;

  }

  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
    this.selectedModeReglement = null;
    this.selectedMatiereToAdd = null;
    this.observation = null;
    this.selectedAppelOffre = null;
  }



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

    } else
      if (mode === 'edit') {

        // this.visibleNewModal = false;
        // this.visDelete = false;
        if (this.code == undefined) {
          // alert("Choise A row Please");

          this.visDelete = false; this.visibleNewModal = false
          this.clearForm();
          this.onRowUnselect(event);
          alertifyjs.set('notifier', 'position', 'top-right');

          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Choise A row Please");

          // this.listDataAOWithDetails = new Array<any>();

        } else {

          button.setAttribute('data-target', '#NewModal');
          this.formHeader = "Edit Appel Offre"

          this.GelMatiereActifVisible();


          this.onRowSelect;
          this.GelAllModeReglement();

          this.GetColorisActifVisible();
          this.GelUniteActifVisible();
          this.GetAppelOffreByCode(this.selectedAppelOffre);
          this.visibleNewModal = true;
          this.visDelete = false;
        }

      } else

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

  }


  userCreate = "soufien";
  // currentDate = new Date();

  // ajusterHourAndMinutes() {
  //   let hour = new Date().getHours();
  //   let hours;
  //   if (hour < 10) {
  //     hours = '0' + hour;
  //   } else {
  //     hours = hour;
  //   }
  //   let min = new Date().getMinutes();
  //   let mins;
  //   if (min < 10) {
  //     mins = '0' + min;
  //   } else {
  //     mins = min;
  //   }
  //   return hours + ':' + mins
  // }
  // datform = new Date();

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
            this.visibleNewModal = false;
            this.visDelete = false;


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
            this.visibleNewModal = false;
            this.visDelete = false;
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



  public remove(index: number): void {
    this.listDataAOWithDetails.splice(index, 1);
    console.log("index", index);
  }



  types!: any[];






  // selectedMatiere: any;
  selectedCodeModeReglement: any;
  compteur: number = 0;
  listDesig = new Array<any>();
  matieres!: Matiere[];





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



  VoidsNew(): void {
    this.articles = [

    ].sort((car1, car2) => {
      return 0;
    });

  }

  brands!: SelectItem[];
  // clonedCars: { [s: string]: AppelOffre } = {};
  // codeModeReglementDde: {}[] = [];
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
      // this.onRowUnselect(event);

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







  AODetails = new Array<AODetails>();
  selectedMatiereToAdd: any;
  ListMatiere!: Matiere[];
  listDataAOWithDetails = new Array<any>();
  Newcompteur: number = 0;
  codeMatieres: any;
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


  GetAppelOffreByCode(code: number) {

    this.param_achat_service.GetAppelOffreByCode(this.code).pipe(
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
      this.listDataAOWithDetails = data;
      console.log("listDataAOWithDetails is ", this.listDataAOWithDetails);


    })
  }



  getPicNonReceptionner()
  {
    return "url('assets/assets/images/icons8-delivery-50.png')";
  }

  getPicReceptionnerPartiell()
  {
    return "url('assets/assets/images/icons8-enveloppe-réception-48.png')";
  }

  getPicReceptionnerFinal()
  {
    return "url('assets/assets/images/icons8-receive-64.png')";
  }


  ionViewDidLoad() {
    let comArr = document.getElementsByClassName("command"); // Fetches a nodelist with all command cells
    for (let i = 0; i < comArr.length; i++) {
      let elString = document.getElementsByClassName("command")[i].innerHTML; // Fetches string for this iteration of the loop
      document.getElementsByClassName("command")[i].innerHTML = ""; // Clears raw text from column
      for (let j = 0; j < elString.length; j++) {
        let newImg = document.createElement("img"); // creates new <img>
        newImg.setAttribute("class", "inputImg"); //  sets class for <img>
        let alphaNum = elString[j];

        switch (alphaNum) {

          //Diretions
          case "1": //Lower Left
            newImg.setAttribute("src", "assets/assets/imgs/input/1.png");
            break;

          case "2": //Bottom
            newImg.setAttribute("src", "assets/assets/imgs/input/2.png");
            break;

          case "3": //Lower Right
            newImg.setAttribute("src", "assets/assets/imgs/input/3.png");
            break;

          case "4": //Left
            newImg.setAttribute("src", "assets/imgs/input/4.png");
            break;

          case "6": //Right
            newImg.setAttribute("src", "assets/imgs/input/6.png");
            break;

          case "7": //Upper Left
            newImg.setAttribute("src", "assets/imgs/input/7.png");
            break;

          case "8": //Top
            newImg.setAttribute("src", "assets/imgs/input/8.png");
            break;

          case "9": //Upper Right
            newImg.setAttribute("src", "assets/imgs/input/9.png");
            break;

          //Standard Buttons
          case "A": //Horizontal
            newImg.setAttribute("src", "assets/imgs/input/A.png");
            break;

          case "B": //Vertical
            newImg.setAttribute("src", "assets/imgs/input/B.png");
            break;

          case "K": //Kick
            newImg.setAttribute("src", "assets/imgs/input/K.png");
            break;

          case "G": //Guard
            newImg.setAttribute("src", "assets/imgs/input/G.png");
            break;

          //Multi Button
          case "2": // A~B Horizontal ~ Vertical
            newImg.setAttribute("src", "assets/imgs/input/M.png");
            newImg.setAttribute("class", "inputImgWide");
            break;

          case "N": // B~A Vertical ~ Horizontal
            newImg.setAttribute("src", "assets/imgs/input/N.png");
            newImg.setAttribute("class", "inputImgWide");
            break;

          case "O": // K~A Kick ~ Horizontal
            newImg.setAttribute("src", "assets/imgs/input/O.png");
            newImg.setAttribute("class", "inputImgWide");
            break;

          case "P": // K~B Kick ~ Vertical
            newImg.setAttribute("src", "assets/imgs/input/P.png");
            newImg.setAttribute("class", "inputImgWide");
            break;

          // States (Not complete yet)
          case "C": // Full Crouch
            break;

          case "T": // Back Turn
            break;

          case "R": // Run
            break;

          case "W": // While Rising
            break;
        }
        document.getElementsByClassName("command")[i].appendChild(newImg) // appends <img> child to corresponding cell
      }
    }
  }
}





