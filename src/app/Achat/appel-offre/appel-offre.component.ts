import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ChangeDetectorRef, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { catchError, Subject, throwError, timeout } from 'rxjs';
import { Table } from 'primeng/table';

import * as alertifyjs from 'alertifyjs'
import { AO, AODetails, AppelOffre, Coloris, DetailsAppelOffre, Matiere, ModeReglement, TypeCaisse, Unite } from 'src/app/parametrageCenral/domaine/ParametrageCentral';
import { ParametrageCentralService } from 'src/app/parametrageCenral/ParametrageCentralService/parametrage-central.service';
import { DatePipe } from '@angular/common';
 

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
  }
  selectedColorisForPush(event: any) {
    console.log(event.target.value)

  }



  v2!: any[];

  openModal!: boolean;

  constructor(private confirmationService: ConfirmationService, private datePipe: DatePipe,
    private param_achat_service: ParametrageCentralService, private messageService: MessageService, private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
     
  }

  selectedMatiere: any;
  items!: MenuItem[];

  pdfData!: Blob;
  isLoading = false;
  ngOnInit(): void {
    this.items = [
      { label: 'View', icon: 'pi pi-fw pi-search', command: () => this.approveAO('ApproveModal') },
      // {label: 'Delete', icon: 'pi pi-fw pi-times', command: () => this.deleteProduct(this.selectedAppelOffre)}
    ];

    this.GelAllAppelOffre();
    this.VoidsNew();

    this.v2 = [
      { field: 'codeSaisie', header: 'Code Saisie' },
      { field: 'designationAr', header: 'Designation', style: 'width: 100px !important;' },
      { field: 'unite', header: 'Unite' },
      { field: 'coloris', header: 'Coloris' },
      { field: 'quantite', header: 'Quantite' },
    ];


  }
  selectedValue!: number;
  diss: boolean = false;
  approveAO(mode: string) {

    const container = document.getElementById('main-container');
    const contextMenu = document.createElement('button');
    contextMenu.type = 'button';
    contextMenu.style.display = 'none';
    contextMenu.setAttribute('data-toggle', 'modal');
    if (mode === 'ApproveModal') {
      contextMenu.setAttribute('data-target', '#ModalApprove');
      this.formHeader = "Valider Appel Offre";
      this.visibleModalApprove = true;
      this.visDelete = false;
      this.visibleNewModal = false;
      this.visibleModalPrint = false;
      this.GelMatiereActifVisible();
      this.onRowSelect;
      this.GelAllModeReglement();
      this.GetColorisActifVisible();
      this.GelUniteActifVisible();
      this.GetAppelOffreByCode(this.selectedAppelOffre);
      this.diss = true;

    }
  }
  codeAppelOffre!: number;
  RemplirePrint(codeAppelOffre: any): void {
    if (this.selectedAppelOffre == null) {
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + "Select any row please");
      this.visibleModalPrint = false;
    } else {
      this.param_achat_service.getAppelOffreEdition(codeAppelOffre).subscribe(blob => {
        const reader = new FileReader();
        const binaryString = reader.readAsDataURL(blob);
        reader.onload = (event: any) => {
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



  }

  handleRenderPdf(data: any) {
    var options = {
      title: "My embedded PDF",
      pdfOpenParams: { view: 'Fit', page: '2' }
    };
    const pdfObject = PDFObject.embed(data, '#pdfContainer', options);
  }


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
    this.onRowUnselect(event);
    this.listDataAOWithDetails = new Array<any>();
    this.final = new Array<any>();

  }

  closeModalPrint() {
    this.visibleModalPrint = false;
    this.onRowUnselect(event);
    this.clearSelected();
    this.selectedAppelOffre = null;
    this.pdfData = new Blob;

  }
  check_actif = false;
  check_inactif = false;

  formHeader = ".....";
  searchTerm = '';
  visibleNewModal: boolean = false;
  visibleModalApprove: boolean = false;
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

  dateLivraison: any;

  selectedAppelOffre!: any;

  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US'); // culture of your date
    return datePipe.transform(date, format);
  }
  selectedModeReglement: any;
  onRowSelect(event: any) {
    this.code = event.data.code;
    this.actif = event.data.actif;
    this.visible = event.data.visible;
    this.codeSaisie = event.data.codeSaisie;
    this.designationAr = event.data.designationAr;
    this.designationLt = event.data.designationLt;
    this.selectedModeReglement = event.data.codeModeReglement;
    this.observation = event.data.observation;
    // let x = event.data.dateCreate;
    this.dateLivraison = event.data.dateLivraison 


    console.log('vtData : ', event, 'selected AO code : ', this.selectedAppelOffre , "date",   ) ;


  }

  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
    this.selectedModeReglement = null;
    this.selectedMatiereToAdd = null;
    this.observation = null;
    this.selectedAppelOffre = '';
    console.log(" selectedAppelOffre", this.selectedAppelOffre)

  }




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
    this.visible = false;
    this.listDataAOWithDetails = new Array<any>();


  }



  public onOpenModal(mode: string) {

    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'Newadd') {
      button.setAttribute('data-target', '#NewModal');
      this.formHeader = "Nouveau Appel Offre";

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

          this.visDelete = false; this.visibleNewModal = false; this.visibleModalPrint = false;
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
          this.visibleModalPrint = false;
        }

      } else

        if (mode === 'Delete') {

          if (this.code == undefined) {
            this.visDelete = false; this.visibleNewModal = false; this.visibleModalPrint = false;
            this.onRowUnselect;
            alertifyjs.set('notifier', 'position', 'top-right');
            alertifyjs.error("Choise A row Please");
            // this.visDelete = false ; this.visibleNewModal = false
          } else {

            {
              button.setAttribute('data-target', '#ModalDelete');
              this.formHeader = "Delete Appel D'Offre"

              // this.GelMatiereActifVisible();
              // this.GelAllModeReglement();
              this.visDelete = true;
            }
          }

        }
    // (mode === 'Print') 
    if (mode === 'Print') {


      button.setAttribute('data-target', '#ModalPrint');
      this.formHeader = "Imprimer Appel Offre"
      this.visibleModalPrint = true;
      this.RemplirePrint(this.code);


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
  // codeColoriss:any;
  // codeUnites:any;

  // listDataAOWithDetails = new Array<any>();

  listDataAOWithDetailsTemp = new Array<any>();
  PostAppelOffre() {








    if (!this.designationAr || !this.designationLt || !this.selectedModeReglement || !this.codeSaisie || this.listDataAOWithDetails.length == 0) {
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Field Required");

    } else {

      for (let y = 0; y < this.listDataAOWithDetails.length; y++) {

        this.GetDataFromTableEditor = {


          codematiere: { code: this.listDataAOWithDetails[y].codeMatieres },
          codeUnite: { code: this.listDataAOWithDetails[y].codeUnites },
          codeColoris: { code: this.listDataAOWithDetails[y].codeColoriss },
          qteDemander: this.listDataAOWithDetails[y].qteDemander, userCreate: this.userCreate,
        }
        this.final.push(this.GetDataFromTableEditor);




      }
      // let dte = this.datePipe.transform(this.dateLivraison,'yyyy-MM-dd') ;
      // console.log("dte", dte)
      let body = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        codeModeReglement: this.selectedModeReglement,
        userCreate: this.userCreate,
        codeFournisseur: null,
        code: this.code,
        actif: this.actif,
        visible: this.visible,
        detailsAppelOffreDTOs: this.final,
        observation: this.observation,
        codeEtatReception: "2",
        
        dateLivraison : this.dateLivraison ,
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
            this.visibleModalApprove = false;
            this.visDelete = false;
            this.codeAppelOffre = this.selectedAppelOffre.code
            this.visibleModalPrint = false;


          }
        );


      }
      else {
        console.log("Body to Post", body)

        this.param_achat_service.PostAppelOffre(body).pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) { } else {
              this.final = new Array<any>();
              alertifyjs.set('notifier', 'position', 'top-right');
              alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");
            }
            return throwError(errorMessage);
          })
        ).subscribe(
          (res: any) => {
            alertifyjs.set('notifier', 'position', 'top-right');
            alertifyjs.success('<i class="success fa fa-chevron-down" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + "Success Saved");
            this.visibleNewModal = false;
            this.visDelete = false;
            this.visibleModalPrint = true;
            this.visibleModalApprove = false;
            this.clearForm();
            this.ngOnInit();
            this.code;
            this.final;
            this.check_actif = true;
            this.check_inactif = false;
            this.onRowUnselect(event);
            this.clearSelected();
            body: { };
            this.visibleModalPrint = true;
            console.log("res", res);
            this.codeAppelOffre = res.code;
            this.RemplirePrint(this.codeAppelOffre);


          }
        )



      }
    }





  }
  codeAo: any;
  NewCodeAO = new Array<AppelOffre>;

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
          alertifyjs.timer = 100;
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
  disp: boolean = false;
  PushTableData() {
    console.log("selectedValue", this.selectedValue)
    var exist = false;

    for (var y = 0; y < this.listDataAOWithDetails.length; y++) {
      if (this.selectedMatiereToAdd != this.listDataAOWithDetails[y].code) {
        exist = false;
      } else {
        exist = true;

        alertifyjs.set('notifier', 'position', 'top-left');
        alertifyjs.error('Item Used');
        break;
      }
      // if (this.listDataAOWithDetails[y].codeColoriss == null && this.listDataAOWithDetails[y].codeUnites ==null || this.listDataAOWithDetails[y].qteDemander ==null) {

      //   alertifyjs.set('notifier', 'position', 'top-left');
      //   alertifyjs.error('Remplire All Data For Row '); this.disp = true;
      //   break;


      // }  

    }
    // control remplire codeUnite + codeColoris + qte 


    if ((this.selectedMatiereToAdd != undefined) && (this.selectedMatiereToAdd != "") && (!exist)) {
      this.param_achat_service.GetMatiereByCode(this.selectedMatiereToAdd).subscribe((Newdata: any) => {
        // this.ListMatiere[this.Newcompteur] = Newdata;
        this.Newcompteur = this.Newcompteur + 1;

        this.listDataAOWithDetails.push(Newdata);
        console.log(" PushTableData listDataAOWithDetails", this.listDataAOWithDetails);

        // console.log(" PushTableData articles", this.ListMatiere);
        this.disp = true;
      })
    }

  }

  MakeEnabled() {
    this.disp = false;
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



  getPicNonReceptionner() {
    return "url('assets/assets/images/etat_NRCP.png')";
  }

  getPicReceptionnerPartiell() {
    return "url('assets/assets/images/etat_RCPPartiel.png')";
  }

  getPicReceptionnerFinal() {
    return "url('assets/assets/images/etat_RCTotal.png')";
  }


}





