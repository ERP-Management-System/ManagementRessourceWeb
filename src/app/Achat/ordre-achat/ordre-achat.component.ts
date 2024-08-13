import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, ChangeDetectorRef, OnInit, ViewChild, AfterViewInit, ElementRef, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem, SortEvent } from 'primeng/api';
import { catchError, Subject, throwError } from 'rxjs';
import { Table, TableModule } from 'primeng/table';

import * as alertifyjs from 'alertifyjs'
import { AO, AODetails, AppelOffre, Coloris, Compteur, DemandeAchat, Depot, DetailsAppelOffre, Matiere, ModeReglement, OrdreAchat, Param, TypeCaisse, Unite } from 'src/app/domaine/ParametrageCentral';
import { ParametrageCentralService } from 'src/app/parametrageCenral/ParametrageCentralService/parametrage-central.service';
import { DatePipe } from '@angular/common';


declare const PDFObject: any;

@Component({
  selector: 'app-ordre-achat',
  templateUrl: './ordre-achat.component.html',
  styleUrl: './ordre-achat.component.css', providers: [ConfirmationService, MessageService]
})
export class OrdreAchatComponent {

  visDetailsPrice: boolean = false;
  GelParamVisibleWithPrice() {
    // this.headers.append('foo', 'bar');
    this.param_achat_service.GetVisibleWithPrice().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.visDetailsPrice = data.visible;

    })
  }

  v2!: any[];

  openModal!: boolean;

  constructor(private confirmationService: ConfirmationService, private datePipe: DatePipe,
    private param_achat_service: ParametrageCentralService, private messageService: MessageService, private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {

  }




  DataCodeSaisie = new Array<Compteur>();
  GetCodeSaisie() {
    this.param_achat_service.GetcompteurCodeSaisie("codeSaisieOA").pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.DataCodeSaisie = data;
      this.codeSaisie = data.prefixe + data.suffixe;


    })
  }

  selectedMatiere: any;

  // showTable: boolean = false;
  // showTableUnite : boolean = false;
  // selectedUniteFromTab : any
  // ShowTab(){
  //   this.showTable = true;
  // }
  // ShowTabUnite(){
  //   this.showTableUnite = true;
  // }

  // codeUnites:any;
  // HideTable(event: any){
  //   this.showTable = false;
  //   this.codeUnites = "sss";
  // }

  // HideTableUnite (event: any){
  //   this.showTableUnite = false;
  // }
  pdfData!: Blob;
  isLoading = false;
  ngOnInit(): void {

    // const headers = new HttpHeaders();
    // headers.set('Accept-Language', 'ar'); 

    localStorage.setItem("langue", "ar")
    this.GelParamVisibleWithPrice();
    this.GelAllOrdreAchat();
    this.VoidsNew();
    this.getValued();
    // this.v2 = [
    //   { field: 'codeSaisie', header: 'Code Saisie' },
    //   { field: 'designationAr', header: 'Designation', style: 'width: 100px !important;' },
    //   { field: 'unite', header: 'Unite' },
    //   { field: 'coloris', header: 'Coloris' },
    //   { field: 'quantite', header: 'Quantite' },
    // ];


  }
  codeDemandeAchat!: number;
  RemplirePrint(codeDemandeAchat: any): void {
    if (this.selectedOrdreAchat == null) {
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + "Select any row please");
      this.visibleModalPrint = false;
    } else {
      this.param_achat_service.getOrdreAchatEdition(codeDemandeAchat).subscribe(blob => {
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
    this.searchTermMatiere='';
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

    this.listDataOAWithDetails = new Array<any>();
    this.final = new Array<any>();
    this.prixTotalTTC = 0.000000;
    this.TotalHTValue = 0.000000;
    this.remiseEnPourcent = 0;
    this.mntNet = 0
    this.tott19 = 0;
    this.tott7 = 0;
    this.TotalTaxeTmb = 0;
    this.mntTimbre = 0;
    this.selectedOrdreAchat == null;
    this.onRowUnselect(event);


  }

  closeModalPrint() {
    this.visibleModalPrint = false;
    this.onRowUnselect(event);
    this.clearSelected();
    this.selectedOrdreAchat = null;
    this.pdfData = new Blob;

  }
  check_actif = false;
  check_inactif = false;

  formHeader = ".....";
  searchTerm = '';
  searchTermMatiere = '';
  visibleNewModal: boolean = false;
  visibleModalPrint: boolean = false;
  visibleModalDdeDirect: boolean = false;
  visibleModalSelect: boolean = false;
  visDelete: boolean = false;
  code!: any | null;
  codeSaisie: any;
  Instructions: any;
  lieuOA: any;
  designationAr: any;
  designationLt: string = "NULL";
  codeTypeCaisse: number = 0;
  codeBanque: string = "NULL";
  actif!: boolean;
  visible!: boolean;

  mntTotalTTC: any;

  selectedAppelOffre!: any;
  selectedOrdreAchat!: any;
  selectedMatieres!:any
  selectedDemandeAchat!: any;
  selectedDepot: any;

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
    this.selectedDemandeAchat = event.data.demandeAchatDTO.code;
    this.selectedAppelOffre = event.data.codeAppelOffre;
    this.qteDemander = event.data.qteDemander;
    this.prixTotalTTC = event.data.mntTotalTTC;
    this.TotalHTValue = event.data.mntTotalHT;
    this.remiseEnPourcent = event.data.mntRemise;
    this.mntTimbre = event.data.mntTimbre;
    this.TotalTaxeTimbre = event.data.mntTotalTaxe;
    this.totaltaxeMnt = event.data.mntTotalTaxe - -event.data.mntTimbre;
    this.mntNet = event.data.mntNet;
    this.dateLivraison = event.data.dateLivraison;
    this.selectedFournisseur = event.data.codeFournisseur;
    console.log('vtData : ', event, 'selected AO code : ', this.selectedOrdreAchat);
    // 

  }

  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
    this.selectedModeReglement = null;
    this.selectedMatiereToAdd = null;
    this.observation = null;
    this.selectedDemandeAchat = '';
    this.selectedAppelOffre = '';
    // console.log(" selectedDemandeAchat", this.selectedOrdreAchat)

  }




  DeleteOrdreAchat(code: any) {
    this.param_achat_service.DeleteOrdreAchat(code).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
        } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);
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
    this.listDataOAWithDetails = new Array<any>();


  }



  public onOpenModal(mode: string) {

    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'Newadd') {
      button.setAttribute('data-target', '#NewModal');
      this.formHeader = "Nouveau Ordre Achat";

      this.listDataOAWithDetails = new Array<any>();
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
      this.GelAllAppelOffre();
      // this.GetDemandeAchatWhereCodeIn();
      this.GetCodeSaisie();
      this.GetFournisseur();

    } else
      if (mode === 'edit') {
        if (this.code == undefined) {

          this.visDelete = false; this.visibleNewModal = false; this.visibleModalPrint = false;
          this.clearForm();
          this.onRowUnselect(event);
          alertifyjs.set('notifier', 'position', 'top-right');

          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Choise A row Please");


        } else {

          this.param_achat_service.GetOrdreAchatByCodeIn(this.selectedOrdreAchat.code).pipe(
            catchError((error: HttpErrorResponse) => {
              let errorMessage = '';
              if (error.error instanceof ErrorEvent) {
              } else {
                alertifyjs.set('notifier', 'position', 'top-right');
                alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);
              }
              return throwError(errorMessage);
            })

          ).subscribe(
            (res: any) => {
              if (res.codeEtatReception != 2) {
                alertifyjs.set('notifier', 'position', 'top-right');
                alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + 'Order Achat Receptionner');
                this.visDelete = false; this.visibleNewModal = false; this.visibleModalPrint = false;
                this.selectedOrdreAchat = '';
              } else {
                button.setAttribute('data-target', '#NewModal');
                this.formHeader = "Edit Ordre Achat"

                this.GelMatiereActifVisible();



                this.onRowSelect;
                // this.GetDemandeAchatWhereCodeIn();
                this.GelAllModeReglement();
                this.GelAllAppelOffre();
                this.GetColorisActifVisible();
                this.GelUniteActifVisible();
                this.GetOrdreAchatByCode(this.selectedOrdreAchat);
                this.visibleNewModal = true;
                this.visDelete = false;
                this.visibleModalPrint = false;
                this.GelAllDA();
                this.GetFournisseur();

              }
            }
          )


        }


      } else

        if (mode === 'Delete') {

          if (this.code == undefined) {
            this.visDelete = false; this.visibleNewModal = false; this.visibleModalPrint = false;
            this.onRowUnselect;
            alertifyjs.set('notifier', 'position', 'top-right');
            alertifyjs.error("Choise A row Please");
          } else {

            {
              button.setAttribute('data-target', '#ModalDelete');
              this.formHeader = "Delete Ordre Achat"

              this.visDelete = true;
            }
          }

        }
    if (mode === 'Print') {


      button.setAttribute('data-target', '#ModalPrint');
      this.formHeader = "Imprimer Ordre Achat"
      this.visibleModalPrint = true;
      this.RemplirePrint(this.code);


    }

  }



  public onOpenModalOrderDirect(mode: string) {

    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'NewaddOrdreDirect') {
      button.setAttribute('data-target', '#NewModalDdeDirect');
      this.formHeader = "Nouveau Ordre Achat Direct";

      this.listDataOAWithDetails = new Array<any>();
      this.onRowUnselect(event);
      this.clearSelected();
      this.actif = false;
      this.visibleModalDdeDirect = true;
      this.visDelete = false;
      this.visibleNewModal = false;
      this.visibleModalPrint = false;
      this.code == undefined;
      this.GelMatiereActifVisible();
      this.GelAllModeReglement();
      this.GelUniteActifVisible();
      this.GetColorisActifVisible();

    }

  }

  
  public onOpenModalOrderDirectSelect(mode: string) {

    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'NewaddOrdreDirectSelect') {
      button.setAttribute('data-target', '#NewModalDdeDirectSelect');
      this.formHeader = "Nouveau Ordre Achat Direct";

      this.listDataOAWithDetails = new Array<any>();
      this.onRowUnselect(event);
      this.clearSelected();
      this.actif = false;
      this.visibleModalDdeDirect = false;
      this.visibleModalSelect = true;
      
      this.visDelete = false;
      this.visibleNewModal = false;
      this.visibleModalPrint = false;
      this.code == undefined;
      this.GelMatiereActifVisible();
      this.GelAllModeReglement();
      this.GelUniteActifVisible();
      this.GetColorisActifVisible();

    }

  }


  userCreate = "soufien";

  GetDataFromTableEditor: any;
  final = new Array<any>();
  codeColoris: any;
  qteDemander: any = 1;
  codeSaisieMaitere: any;
  codeUnite: any;
  observation: any;
  PostOrdreAchat() {








    if (!this.codeSaisie || this.listDataOAWithDetails.length == 0) {
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Field Required");

    } else {

      for (let y = 0; y < this.listDataOAWithDetails.length; y++) {

        this.GetDataFromTableEditor = {


          matiereDTO: { code: this.listDataOAWithDetails[y].codeMatieres },
          codeMatieres: this.listDataOAWithDetails[y].codeMatieres,
          codeUnites: this.listDataOAWithDetails[y].codeUnites,
          codeColoriss: this.listDataOAWithDetails[y].codeColoriss,
          valeurTaxe: this.listDataOAWithDetails[y].valeurTaxe,
          qteDemander: this.listDataOAWithDetails[y].qteDemander,
          userCreate: this.userCreate,
          prixAchat: this.listDataOAWithDetails[y].prixAchat,
          mntTotalTTC: this.listDataOAWithDetails[y].mntTotalTTC,
          mntTotalHT: this.listDataOAWithDetails[y].mntTotalHT,
          mntTotalTaxe: this.listDataOAWithDetails[y].mntTotalTTC - -this.listDataOAWithDetails[y].mntTotalHT,
        }
        this.final.push(this.GetDataFromTableEditor);




      }
      let body = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        codeModeReglement: this.selectedModeReglement,
        userCreate: this.userCreate,
        codeFournisseur: this.selectedFournisseur,
        code: this.code,
        actif: this.actif,
        visible: this.visible,
        detailsOrdreAchatDTOs: this.final,
        observation: this.observation,
        codeEtatReception: "2",
        codeDemandeAchat: this.selectedDemandeAchat,
        codeAppelOffre: this.selectedAppelOffre,
        mntTotalTTC: this.prixTotalTTC,
        mntTotalHT: this.TotalHTValue,
        mntTotalTaxe: this.TotalTaxeTimbre - -this.mntTimbre,
        mntRemise: this.remiseEnPourcent,
        mntTimbre: this.mntTimbre,
        dateLivraison: this.dateLivraison,
        lieu: this.lieuOA,
        instruction: this.Instructions,
        codeTypeCircuitAchat: 2,
        mntNet: this.mntNet,
      }



      if (this.code != null) {
        body['code'] = this.code;
        console.log("Body to Update", body)
        this.param_achat_service.UpdateOrdreAchat(body).pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) {
            } else {
              alertifyjs.set('notifier', 'position', 'top-right');
              alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

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
            this.codeDemandeAchat = this.selectedOrdreAchat.code
            this.visibleModalPrint = false;
          }
        );
      }
      else {
        console.log("Body to Post", body)

        this.param_achat_service.PostOrdreAchatWithDetails(body).pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) { } else {
              this.final = new Array<any>();
              alertifyjs.set('notifier', 'position', 'top-right');
              alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);
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
            this.codeDemandeAchat = res.code;
            this.RemplirePrint(this.codeDemandeAchat);


          }
        )



      }
    }





  }
  codeAo: any;
  NewCodeAO = new Array<AppelOffre>;

  public remove(index: number): void {
    this.listDataOAWithDetails.splice(index, 1);
    this.calculateTaxe();
    this.ValueQteChanged();
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
  dataOrdreAchat = new Array<OrdreAchat>();
  banque: any;
  GelAllOrdreAchat() {
    // this.headers.append('foo', 'bar');
    this.param_achat_service.GetOrdreAchat().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {



      this.dataOrdreAchat = data;
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
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

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



  dataAppelOffre = new Array<AppelOffre>();
  listAppelOffrePushed = new Array<any>();
  listAppelOffreRslt = new Array<any>();
  GelAllAppelOffre() {
    this.param_achat_service.GetAppelOffre().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.dataAppelOffre = data;
      this.listAppelOffrePushed = [];
      for (let i = 0; i < this.dataAppelOffre.length; i++) {
        this.listAppelOffrePushed.push({ label: this.dataAppelOffre[i].codeSaisie, value: this.dataAppelOffre[i].code })
      }
      this.listAppelOffreRslt = this.listAppelOffrePushed;
    })
  }



  dataMatiere = new Array<Matiere>();
  listMatierePushed = new Array<any>();
  listMatiereRslt = new Array<any>();
  GelMatiereActifVisible() {
    this.param_achat_service.GetMatiereActive().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

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
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);
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
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);
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
  listDataOAWithDetails = new Array<any>();
  Newcompteur: number = 0;
  codeMatieres: any;
  disp: boolean = false;

  transformDateFormat() {
    this.dateLivraison = this.datePipe.transform(this.dateLivraison, "dd/MM/yyyy")
    console.log("  transformDateFormat  this.dateLivraison", this.dateLivraison)
  };
  dateLivraison: any;
  PushTableData() {
    var exist = false;

    for (var y = 0; y < this.listDataOAWithDetails.length; y++) {
      if (this.selectedMatiereToAdd != this.listDataOAWithDetails[y].codeMatieres) {
        exist = false;
      } else {
        exist = true;
        alertifyjs.set('notifier', 'position', 'top-right');
        alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Matiere Deja Existe");

        break;
      }


    }
    // control remplire codeUnite + codeColoris + qte 


    if ((this.selectedMatiereToAdd != undefined) && (this.selectedMatiereToAdd != "") && (!exist)) {
      this.param_achat_service.GetMatiereByCode(this.selectedMatiereToAdd).subscribe((Newdata: any) => {
        // this.ListMatiere[this.Newcompteur] = Newdata;
        this.Newcompteur = this.Newcompteur + 1;

        this.listDataOAWithDetails.push(Newdata);
        console.log(" PushTableData listDataDAWithDetails", this.listDataOAWithDetails);

        // console.log(" PushTableData articles", this.ListMatiere);
        this.disp = true;
      })
    }

  }

  MakeEnabled() {
    this.disp = false;
  }

  GetOrdreAchatByCode(code: number) {

    this.param_achat_service.GetDetailsOrdreAchatByCode(this.selectedOrdreAchat.code).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.listDataOAWithDetails = new Array<any>();
      this.listDataOAWithDetails = data;
      console.log("listDataDAWithDetails is ", this.listDataOAWithDetails);


    })
  }



  getIconCirDirect() {
    return "url('assets/assets/images/cir_direct.png')";
  }

  getIconCirInDirect() {
    return "url('assets/assets/images/cir_indirect.png')";
  }



  dataDepot = new Array<Depot>();
  listDepotPushed = new Array<any>();
  listDepotRslt = new Array<any>();
  GelAllDepotPrincipal() {
    this.param_achat_service.GetDepotPrincipal().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.dataDepot = data;
      this.listDepotPushed = [];
      for (let i = 0; i < this.dataDepot.length; i++) {
        this.listDepotPushed.push({ label: this.dataDepot[i].designationAr, value: this.dataDepot[i].code })
      }
      this.listDepotRslt = this.listDepotPushed;
    })
  }



  dataDemandeAchat = new Array<DemandeAchat>();
  listDemandeAchatPushed = new Array<any>();
  listDemandeAchatRslt = new Array<any>();
  GetDemandeAchat() {
    this.param_achat_service.GetDemandeAchat().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.dataDemandeAchat = data;
      this.listDemandeAchatPushed = [];
      for (let i = 0; i < this.dataDemandeAchat.length; i++) {
        this.listDemandeAchatPushed.push({ label: this.dataDemandeAchat[i].codeSaisie, value: this.dataDemandeAchat[i].code })
      }
      console.log("data listDemandeAchatRslt", this.listDemandeAchatRslt);
      this.listDemandeAchatRslt = this.listDemandeAchatPushed;
    }
    )
    // this.param_achat_service.GetDemandeAchatByCodeIn(this.selectedOrdreAchat.codeDemandeAchat).pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     let errorMessage = '';
    //     if (error.error instanceof ErrorEvent) { } else {
    //       alertifyjs.set('notifier', 'position', 'top-right');
    //       alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

    //     }
    //     return throwError(errorMessage);
    //   })

    // ).subscribe((data2: any) => {
    //   this.dataDemandeAchat = data2;
    //   // console.log("data length", data2);
    //   this.listDemandeAchatPushed = [];
    //   // for (let i = 0; i < this.dataDemandeAchat.length; i++) {
    //   this.listDemandeAchatPushed.push({ label: data2.codeSaisie, value: data2.code })
    //   // }
    //   console.log("data codeDemandeAchats", this.listDemandeAchatPushed);
    //   this.listDemandeAchatRslt = this.listDemandeAchatPushed;
    //   // this.prixTotalTTC = 0.000000;
    //   // this.TotalHTValue = 0.000000;
    //   // this.remiseEnPourcent = 0.000000;
    //   // this.mntNet = 0.000000;
    //   // this.tott19 = 0.000000;
    //   // this.tott7 = 0.000000;
    //   // this.TotalTaxeTmb = 0.000000;
    //   // this.mntTimbre = 0.000000;
    //   // this.dateLivraison = null
    //   // this.Instructions = '';
    //   // this.lieuOA = '';
    // }
    // )
  }



  // valeurTVA: any;
  // remiseEnPourcent: any;
  // prixTotalTTC: any;
  // mntNet: any;
  // TotalHTValue: any;
  // totalTax19: any;
  // TotalTax7: any;
  // mntTimbre: any;
  // TotalTaxeTmb: any;
  // TOTHT!: any;
  // TOTTTC!: any;
  // calculateThisYearTotal() {
  //   let totalHT = 0.000000;
  //   let totalTTC = 0.000000;
  //   let mnttotalHT19 = 0.000000;
  //   let mnttotalHT0 = 0.000000;
  //   let mnttotalHT7 = 0.000000;
  //   for (let sale of this.listDataOAWithDetails) {
  //     totalHT += +sale.prixTotalHT;
  //     totalTTC += +sale.prixTotTTC;
  //     let mnttaxe = sale.codeTaxe / 100;
  //     if (sale.codeTaxe == 19) {

  //       mnttotalHT19 += +sale.prixTotalHT * mnttaxe;
  //       this.totalTax19 = mnttotalHT19;
  //       let valuetx19 = this.totalTax19;
  //       this.totalTax19 = valuetx19.toFixed(6);

  //     }
  //     if (sale.codeTaxe == 7) {
  //       mnttotalHT7 += +sale.prixTotalHT * mnttaxe;
  //       this.TotalTax7 = mnttotalHT7;
  //       let valuetx7 = this.TotalTax7;
  //       this.TotalTax7 = valuetx7.toFixed(6);
  //     } if (sale.codeTaxe == 0) {
  //       this.TotalTax7 = this.TotalTax7;
  //       this.totalTax19 = this.totalTax19;
  //     }


  //   }
  //   console.log("total", totalHT)
  //   this.TOTHT = totalHT;
  //   let value2 = this.TOTHT;
  //   this.TOTHT = value2.toFixed(6); 
  //   this.TotalHTValue = this.TOTHT;


  //   this.TOTTTC = totalTTC;
  //   let value22 = this.TOTTTC;
  //   this.TOTTTC = value22.toFixed(6); 
  //   this.prixTotalTTC = this.TOTTTC;

  //   this.CalculeTaxeTimbre();

  // }

  totaltaxeMnt: number = 0.00000;
  TotalTaxeTimbre: any = 0.00000;
  totalTax: any = 0.00000;
  calculateTaxe() {
    let total = 0.000000;
    let mntTotalTaxe = 0.000000;
    for (let det of this.listDataOAWithDetails) {
      total += +det.mntTotalHT;
      let mnttaxe = det.valeurTaxe / 100;
      mntTotalTaxe += +det.mntTotalHT * mnttaxe;
      let valuetx = mntTotalTaxe;
      this.totalTax = valuetx.toFixed(6)
      this.totaltaxeMnt = this.totalTax;
    }
    this.thisYearTotal = total;
    let value2 = this.thisYearTotal;
    this.thisYearTotal = value2.toFixed(6);

    this.TotalHTValue = this.thisYearTotal;


    if (this.formHeader == "Edit Ordre Achat") {
      let totTaxTimb = +this.mntTimbre + +this.totaltaxeMnt;
      // this.TotalTaxeTmb = totTaxTimb.toFixed(6);
      this.TotalTaxeTimbre = totTaxTimb.toFixed(6);
      let pxTotTTc = +this.TotalHTValue + +this.TotalTaxeTimbre;

      this.prixTotalTTC = pxTotTTc.toFixed(6);
      this.valueRemiseChanged();
      this.mntTimbre = this.mntTimbre;
    } else {
      this.CalculeTaxeTimbre();
    }


  }
  thisYearTotal!: any;
  valeurTVA: any;
  remiseEnPourcent: any = 0.0000;
  mntNet: any;
  prixTotalTTC: any = 0.000000;
  TotalHTValue: any = 0.000000;
  totalTax19: any = 0.000000;
  totalTax7: any = 0.000000;
  mntTimbre: any = 0.000000;
  TotalTaxeTmb: any;
  tott19!: number;
  tott7!: number;
  // calculateThisYearTotal() {

  //   let total = 0.000000;
  //   let mnttotalHT19 = 0.000000;
  //   let mnttotalHT7 = 0.000000;
  //   let pxTotTTc = 0.00000;
  //   for (let sale of this.listDataOAWithDetails) {
  //     total += +sale.mntTotalHT;
  //     let mnttaxe = sale.valeurTaxe / 100;
  //     if (sale.valeurTaxe == 19) {

  //       mnttotalHT19 += +sale.mntTotalHT * mnttaxe;
  //       let valuetx19 = mnttotalHT19;
  //       this.totalTax19 = valuetx19.toFixed(6)
  //       this.tott19 = this.totalTax19;
  //       this.tott7 = this.totalTax7;
  //     }
  //     if (sale.valeurTaxe == 7) {
  //       mnttotalHT7 += +sale.mntTotalHT * mnttaxe;

  //       let valuetx7 = mnttotalHT7;
  //       this.totalTax7 = valuetx7.toFixed(6)
  //       this.tott7 = this.totalTax7;
  //       this.tott19 = this.totalTax19;
  //     }
  //     if (sale.valeurTaxe == 0) {
  //       this.tott7 = this.totalTax7;
  //       this.tott19 = this.totalTax19;
  //     } if (sale.valeurTaxe == 0 && sale.valeurTaxe == 7) {
  //       mnttotalHT7 += +sale.mntTotalHT * mnttaxe;

  //       let valuetx7 = mnttotalHT7;
  //       this.totalTax7 = valuetx7.toFixed(6)
  //       this.tott7 = this.totalTax7;
  //       this.tott19 = this.totalTax19;
  //     } if (sale.valeurTaxe == 0 && sale.valeurTaxe == 19) {
  //       mnttotalHT19 += +sale.mntTotalHT * mnttaxe;
  //       let valuetx19 = mnttotalHT19;
  //       this.totalTax19 = valuetx19.toFixed(6)
  //       this.tott7 = this.totalTax7;
  //       this.tott19 = this.totalTax19;
  //     } if (sale.valeurTaxe == 0 && sale.valeurTaxe == 19 && sale.valeurTaxe == 7) {
  //       mnttotalHT19 += +sale.mntTotalHT * mnttaxe;
  //       let valuetx19 = mnttotalHT19;
  //       this.totalTax19 = valuetx19.toFixed(6);
  //       mnttotalHT7 += +sale.mntTotalHT * mnttaxe;

  //       let valuetx7 = mnttotalHT7;
  //       this.totalTax7 = valuetx7.toFixed(6)

  //       this.tott7 = this.totalTax7;
  //       this.tott19 = this.totalTax19;
  //     }


  //   }



  //   this.thisYearTotal = total;
  //   let value2 = this.thisYearTotal;
  //   this.thisYearTotal = value2.toFixed(6);

  //   this.TotalHTValue = this.thisYearTotal;


  //   this.CalculeTaxeTimbre();

  //   //pxTotTTc.toFixed(6);

  // }

  codeTaxeA: any;
  DataTimbre = new Array<Param>;
  DataTimbrePushed = new Array<any>();
  DataTimbreReslt = new Array<any>();

  CalculeTaxeTimbre() {


    this.param_achat_service.GetMntTimbre().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.DataTimbre = data;
      this.mntTimbre = data.valeur;
      let totTaxTimb = +this.mntTimbre + +this.totaltaxeMnt;
      // this.TotalTaxeTmb = totTaxTimb.toFixed(6);
      this.TotalTaxeTimbre = totTaxTimb.toFixed(6);
      let pxTotTTc = +this.TotalHTValue + +this.TotalTaxeTimbre;

      this.prixTotalTTC = pxTotTTc.toFixed(6);
      this.valueRemiseChanged();
    })



  }

  valueRemiseChanged() {
    let poucentRemise = this.remiseEnPourcent / 100;
    let mntRemise = +poucentRemise * this.prixTotalTTC;
    let mntNetpayee = +this.prixTotalTTC - mntRemise;
    this.mntNet = mntNetpayee.toFixed(6);

  }


  ValueQteChanged() {
    for (let y = 0; y < this.listDataOAWithDetails.length; y++) {

      this.GetDataFromTableEditor = {
        qteDemander: this.listDataOAWithDetails[y].qteDemander,
        prixAchat: this.listDataOAWithDetails[y].prixAchat,
        valeurTaxe: this.listDataOAWithDetails[y].valeurTaxe

      }
      this.listDataOAWithDetails[y].qteDemander = this.GetDataFromTableEditor.qteDemander;
      this.listDataOAWithDetails[y].prixAchat = this.GetDataFromTableEditor.prixAchat;
      this.listDataOAWithDetails[y].valeurTaxe = this.GetDataFromTableEditor.valeurTaxe;
      this.listDataOAWithDetails[y].mntTotalHT = this.GetDataFromTableEditor.mntTotalHT;

      let qteDemander1 = this.GetDataFromTableEditor.qteDemander;
      let prixUniAchat1 = this.GetDataFromTableEditor.prixAchat;
      let valeurtaxe = this.GetDataFromTableEditor.valeurTaxe / 100;

      let pxtotal = qteDemander1 * prixUniAchat1;
      let valeurTaxe1 = valeurtaxe * pxtotal;
      let valeurTotalTTC = pxtotal + +valeurTaxe1
      this.listDataOAWithDetails[y].mntTotalTTC = valeurTotalTTC;
      let value = this.listDataOAWithDetails[y].mntTotalTTC;
      this.listDataOAWithDetails[y].mntTotalTTC = value.toFixed(6);


      this.listDataOAWithDetails[y].mntTotalHT = pxtotal;
      let value2 = this.listDataOAWithDetails[y].mntTotalHT;
      this.listDataOAWithDetails[y].mntTotalHT = value2.toFixed(6);

    }
    // this.calculateThisYearTotal();
    this.calculateTaxe();
  }

  GetDemandeAchatByCode(code: number) {




  }

  codeDemandeAchats: any;
  GetDemandeAchatWhereCodeIn() {
    this.listDemandeAchatRslt = []
    this.listDataOAWithDetails = new Array<any>();

    if (this.selectedAppelOffre == null) {

    } else {



      this.param_achat_service.GetAppelOffreByCode(this.selectedAppelOffre).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) { } else {
            alertifyjs.set('notifier', 'position', 'top-right');
            alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

          }
          return throwError(errorMessage);
        })

      ).subscribe((data1: any) => {
        this.dataAppelOffre = data1;
        this.codeDemandeAchats = data1.codeDemandeAchat
        this.selectedDemandeAchat = data1.codeDemandeAchat;
        this.param_achat_service.GetDemandeAchatByCodeIn(this.codeDemandeAchats).pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) { } else {
              alertifyjs.set('notifier', 'position', 'top-right');
              alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

            }
            return throwError(errorMessage);
          })

        ).subscribe((data2: any) => {
          this.dataDemandeAchat = data2;
          this.listDemandeAchatPushed = [];
          this.listDemandeAchatPushed.push({ label: data2.codeSaisie, value: data2.code })
          this.listDemandeAchatRslt = this.listDemandeAchatPushed;


          /// get details order achat 
          if (this.selectedDemandeAchat == null) {
            this.listDataOAWithDetails = new Array<any>();
            this.prixTotalTTC = 0.000000;
            this.TotalHTValue = 0.000000;
            this.remiseEnPourcent = 0.000000;
            this.mntNet = 0.000000;
            this.tott19 = 0.000000;
            this.tott7 = 0.000000;
            this.TotalTaxeTmb = 0.000000;
            this.mntTimbre = 0.000000;

            this.dateLivraison = null
            this.Instructions = '';
            this.lieuOA = '';
          } else {




            this.param_achat_service.GetDetailsDemandeAchatByCode(this.selectedDemandeAchat).pipe(
              catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) { } else {
                  alertifyjs.set('notifier', 'position', 'top-right');
                  alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

                }
                return throwError(errorMessage);
              })
            ).subscribe((data: any) => {
              this.listDataOAWithDetails = new Array<any>();
              this.listDataOAWithDetails = data;
              //  get first row in data
              let x = this.listDataOAWithDetails;
              this.dateLivraison = x[0].dateLivraison;
              // this.dateLivraison =  data.dateLivraison[0] ;
              console.log("this.dateLivraison", this.dateLivraison,)
              // this.dateLivraison = this.datePipe.transform(x[0].dateLivraison, "yy-mm-dd")
              console.log("GetDemandeAchatByCode listDataOAWithDetails is ", this.listDataOAWithDetails);
              for (let y = 0; y < this.listDataOAWithDetails.length; y++) {

                this.GetDataFromTableEditor = {
                  qteDemander: this.listDataOAWithDetails[y].qteDemander,
                  prixAchat: this.listDataOAWithDetails[y].prixAchat,
                  valeurTaxe: this.listDataOAWithDetails[y].valeurTaxe

                }
                this.listDataOAWithDetails[y].qteDemander = this.GetDataFromTableEditor.qteDemander;
                this.listDataOAWithDetails[y].prixAchat = this.GetDataFromTableEditor.prixAchat;
                this.listDataOAWithDetails[y].valeurTaxe = this.GetDataFromTableEditor.valeurTaxe;
                this.listDataOAWithDetails[y].mntTotalHT = this.GetDataFromTableEditor.mntTotalHT;

                let qteDemander1 = this.GetDataFromTableEditor.qteDemander;
                let prixUniAchat1 = this.GetDataFromTableEditor.prixAchat;

                this.listDataOAWithDetails[y].prixAchat = prixUniAchat1;
                let value3 = this.listDataOAWithDetails[y].prixAchat;
                this.listDataOAWithDetails[y].prixAchat = value3.toFixed(6);


                let valeurtaxe = this.GetDataFromTableEditor.valeurTaxe / 100;

                let pxtotal = qteDemander1 * prixUniAchat1;
                let valeurTaxe1 = valeurtaxe * pxtotal;
                let valeurTotalTTC = pxtotal + +valeurTaxe1;

                this.listDataOAWithDetails[y].mntTotalTTC = valeurTotalTTC;
                let value = this.listDataOAWithDetails[y].mntTotalTTC;
                this.listDataOAWithDetails[y].mntTotalTTC = value.toFixed(6);


                this.listDataOAWithDetails[y].mntTotalHT = pxtotal;
                let value2 = this.listDataOAWithDetails[y].mntTotalHT;
                this.listDataOAWithDetails[y].mntTotalHT = value2.toFixed(6);

                console.log("GetDemandeAchatByCode valeurTotalTTC is ", valeurTotalTTC);



              }

              // this.calculateThisYearTotal();
              this.calculateTaxe();
              console.log("GetDemandeAchatByCode listDataAOWithDetails is ", this.listDataOAWithDetails);


            })
          }
        }
        )


      })



    }



  }



  GetCodeEtatReception() {
    if (this.selectedEtatReception == undefined) {

    } else {
      this.param_achat_service.GetOrdreAchatByEtatRecepetion(this.selectedEtatReception.code).pipe(
        catchError((error: HttpErrorResponse) => {

          let errorMessage = '';
          if (error.error instanceof ErrorEvent) { } else {
            alertifyjs.set('notifier', 'position', 'top-right');
            alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

          }
          return throwError(errorMessage);
        })

      ).subscribe((data: any) => {



        this.dataOrdreAchat = data;

      })

    }
  }

  EtatReception!: any[];
  EtatDde!: any[];
  selectedEtatReception: any;
  getValued() {
    this.EtatReception = [
      { name: 'Non Receptionner', code: '2', url: 'assets/assets/images/encours.png' },
      { name: 'Recp. Partiel', code: '5', url: 'assets/assets/images/recived_partiel.png' },
      { name: 'Recp. Total', code: '7', url: 'assets/assets/images/recived.png' },
    ];
  }

  getPicReceptionPART() {
    return "url('assets/assets/images/recived_partiel.png')";
  }

  getPicReceptionTotal() {
    return "url('assets/assets/images/recived.png')";
  }

  getPicNonRCP() {
    return "url('assets/assets/images/encours.png')";
  }


  dataDA = new Array<DemandeAchat>();
  listDAPushed = new Array<any>();
  // listModeReglementRslt = new Array<any>();
  GelAllDA() {
    this.param_achat_service.GetDemandeAchat().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.dataDA = data;
      this.listDAPushed = [];
      for (let i = 0; i < this.dataDA.length; i++) {
        this.listDAPushed.push({ label: this.dataDA[i].codeSaisie, value: this.dataDA[i].code })
      }
      this.listDemandeAchatRslt = this.listDAPushed;
    })
  }



  selectedFournisseur: any;
  DataFournisseur = new Array<OrdreAchat>();
  listFRSPushed = new Array<any>();
  listFRSRslt = new Array<any>();

  GetFournisseur() {
    this.param_achat_service.GetAllFournisseur().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.DataFournisseur = data;
      this.listFRSPushed = [];
      for (let i = 0; i < this.DataFournisseur.length; i++) {
        this.listFRSPushed.push({ label: this.DataFournisseur[i].designationAr, value: this.DataFournisseur[i].code })
      }
      this.listFRSRslt = this.listFRSPushed;
    })
  }

  VisTableMatiere:boolean = false;
  VisTableMat(){
    this.VisTableMatiere = true;
    this.GelMatiereActifVisible();
  }
  DesignationMatiere:any;
  onRowSelectInOption(event: any) {
    this.code = event.data.code;
    this.DesignationMatiere = event.data.designationAr; 
    this.selectedMatieres = event.data.code;
    console.log('vtselectedMatieres : ', event, 'selected selectedMatieres : ', this.selectedMatieres);
    this.visibleModalSelect = false;
    this.VisTableMatiere = false;
    // 

  }
  
}



