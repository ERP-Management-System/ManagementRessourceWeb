import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, ChangeDetectorRef, OnInit, ViewChild, AfterViewInit, ElementRef, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService, PrimeNGConfig, SelectItem, SortEvent } from 'primeng/api';
import { catchError, findIndex, Subject, throwError } from 'rxjs';
import { Table, TableModule } from 'primeng/table';

import * as alertifyjs from 'alertifyjs'
import { AO, AODetails, AppelOffre, BonReception, Coloris, Compteur, DemandeAchat, Depot, DetailsAppelOffre, DetailsMatiere, Matiere, ModeReglement, OrdreAchat, Param, TypeCaisse, Unite } from 'src/app/domaine/ParametrageCentral';
import { ParametrageCentralService } from 'src/app/parametrageCenral/ParametrageCentralService/parametrage-central.service';
import { DatePipe } from '@angular/common';
import { EDITOR_VALUE_ACCESSOR } from 'primeng/editor';

declare const PDFObject: any;

@Component({
  selector: 'app-bon-reception',
  templateUrl: './bon-reception.component.html',
  styleUrl: './bon-reception.component.css', providers: [ConfirmationService, MessageService]
})

export class BonReceptionComponent {



  v2!: any[];

  openModal!: boolean;
  pdfURL!: Blob;

  constructor(private primengConfig: PrimeNGConfig, private confirmationService: ConfirmationService, private datePipe: DatePipe,
    private param_achat_service: ParametrageCentralService, private messageService: MessageService, private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {

  }




  DataCodeSaisie = new Array<Compteur>();
  GetCodeSaisie() {
    this.param_achat_service.GetcompteurCodeSaisie("codeSaisieBR").pipe(
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

  pdfData!: Blob;
  isLoading = false;
  ngOnInit(): void {





    localStorage.setItem("langue", "ar")
    this.GelParamVisibleWithPrice();
    this.GelAllBonReception();
    this.VoidsNew();
    this.getValued();
    this.v2 = [
      { field: 'codeSaisie', header: 'Code Saisie' },
      { field: 'designationAr', header: 'Designation', style: 'width: 100px !important;' },
      { field: 'unite', header: 'Unite' },
      { field: 'coloris', header: 'Coloris' },
      { field: 'quantite', header: 'Quantite' },
    ];


  }

  visDetailsPrice: boolean = false;
  GelParamVisibleWithPrice() {
    // this.headers.append('foo', 'bar');
    this.param_achat_service.GetVisibleWithPriceBR().pipe(
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

  codeDemandeAchat!: number;
  RemplirePrint(codeDemandeAchat: any): void {
    if (this.selectedBonReception == null) {
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + "Select any row please");
      this.visibleModalPrint = false;
    } else {
      this.param_achat_service.getOrdreAchatEdition(codeDemandeAchat).subscribe(blob => {
        const reader = new FileReader();
        const binaryString = reader.readAsDataURL(blob);
        reader.onload = (event: any) => {
          this.pdfData = event.target.result;

          // if (this.pdfData) {
          //   this.handleRenderPdf(this.pdfData);
          // }

          this.pdfURL = this.pdfData;
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
    this.onRowUnselect(event);
    this.code == undefined;
    this.codeSaisie = '';
    this.selectedModeReglement = '';
    this.selectedMatiereToAdd = '';
    this.listDataBRWithDetails = new Array<any>();
    this.final = new Array<any>();
    this.prixTotalTTC = 0;
    this.TotalHTValue = 0;
    this.remiseEnPourcent = 0;
    this.mntNet = 0
    this.tott19 = 0;
    this.tott7 = 0;
    this.TotalTaxeTmb = 0;
    this.mntTimbre = 0;
    this.selectedOA = null;
    this.totaltaxeMnt = 0;
    this.TotalTaxeTimbre = 0;
    this.selectedFournisseur = null;
    this.selectedDepot = null;
    this.codeFactureFournisseur = '';
    this.dateFactureFournisseur = null;
    this.MntFactureFournisseur = '';

  }

  closeModalPrint() {
    this.visibleModalPrint = false;
    this.onRowUnselect(event);
    this.clearSelected();
    this.selectedBonReception = null;
    this.pdfData = new Blob;
  }

  closeModalDetailsMatiere() {
    this.visibleModalPrint = false;
    this.visibleModalDetails = false;
    this.visibleNewModal = true;
    this.details = new Array<any>();

  }

  check_actif = false;
  check_inactif = false;

  formHeader = ".....";
  formHeaderDetails = ".....";
  searchTerm = '';
  visibleNewModal: boolean = false;
  visibleModalDetails: boolean = false;
  visibleModalPrint: boolean = false;
  visibleModalDdeDirect: boolean = false;
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


  disColQte: boolean = false;
  mntTotalTTC: any;

  selectedAppelOffre!: any;
  selectedOA!: any;
  selectedBonReception!: any;
  selectedDemandeAchat!: any;
  selectedDepot: any;
  selectedFournisseur: any;
  codeFactureFournisseur: any;

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
    this.qteReceptionner = event.data.qteReceptionner;
    this.prixTotalTTC = event.data.mntTotalTTC;
    this.TotalHTValue = event.data.mntTotalHT;
    this.remiseEnPourcent = event.data.mntRemise;
    this.mntTimbre = event.data.mntTimbre;
    this.TotalTaxeTimbre = event.data.mntTotalTaxe;
    this.totaltaxeMnt = event.data.mntTotalTaxe - -event.data.mntTimbre;
    this.mntNet = event.data.mntNet;
    this.dateLivraison = event.data.dateLivraison;
    this.codeFactureFournisseur = event.data.codeFactureFournisseur;
    this.selectedOA = event.data.codeFactureFournisseur

    console.log('vtData : ', event, 'selected AO code : ', this.selectedBonReception);
    // 

  }

  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
    this.selectedModeReglement = '';
    this.selectedMatiereToAdd = '';

    this.listDataBRWithDetails = new Array<any>();
    this.final = new Array<any>();
    this.prixTotalTTC = 0;
    this.TotalHTValue = 0;
    this.remiseEnPourcent = 0;
    this.mntNet = 0
    this.tott19 = 0;
    this.tott7 = 0;
    this.TotalTaxeTmb = 0;
    this.mntTimbre = 0;
    this.selectedOA = null;
    this.totaltaxeMnt = 0;
    this.TotalTaxeTimbre = 0;

  }




  DeleteBonReception(code: any) {
    this.param_achat_service.DeleteBonReception(code).pipe(
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
    this.designationAr = '';
    this.designationLt = '';
    this.actif = false;
    this.visible = false;
    this.selectedModeReglement = '';
    this.selectedMatiereToAdd = '';

    this.listDataBRWithDetails = new Array<any>();
    this.final = new Array<any>();
    this.prixTotalTTC = 0;
    this.TotalHTValue = 0;
    this.remiseEnPourcent = 0;
    this.mntNet = 0
    this.tott19 = 0;
    this.tott7 = 0;
    this.TotalTaxeTmb = 0;
    this.mntTimbre = 0;
    this.selectedOA = null;
    this.totaltaxeMnt = 0;
    this.TotalTaxeTimbre = 0;

  }



  public onOpenModal(mode: string) {

    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'Newadd') {
      button.setAttribute('data-target', '#NewModal');
      this.formHeader = "Nouvelle Reception";

      this.listDataBRWithDetails = new Array<any>();
      this.onRowUnselect(event);
      this.clearSelected();
      this.actif = false;
      this.visibleNewModal = true;
      this.visDelete = false;
      this.code == undefined;
      this.GelMatiereActifVisible();
      this.GelAllDepotPrincipal();
      this.GelUniteActifVisible();
      this.GetColorisActifVisible();
      // this.GetFournisseur();
      this.GelParamVisibleWithPrice();
      this.GetCodeSaisie();
      this.GetOrdreAchat();

    } else
      if (mode === 'edit') {

        if (this.code == undefined) {

          this.visDelete = false; this.visibleNewModal = false; this.visibleModalPrint = false;
          this.clearForm();
          this.onRowUnselect(event);
          alertifyjs.set('notifier', 'position', 'top-right');

          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Choise A row Please");


        } else {

          button.setAttribute('data-target', '#NewModal');
          this.formHeader = "Edit Reception"

          this.GelMatiereActifVisible();


          this.GelAllDepotPrincipal();
          // this.GetFournisseur();

          this.onRowSelect;
          this.GelAllAppelOffre();
          this.GetColorisActifVisible();
          this.GelUniteActifVisible();
          // this.GetOrdreAchatByCode(this.selectedBonReception);
          this.visibleNewModal = true;
          this.visDelete = false;
          this.visibleModalPrint = false;
          // this.CalculeTaxeTimbre();
          // this.calculateTaxe();
          this.GetOrdreAchat();
          this.GelAllDA();
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
              this.formHeader = "Delete Reception"

              this.visDelete = true;
            }
          }

        }
    if (mode === 'Print') {


      button.setAttribute('data-target', '#ModalPrint');
      this.formHeader = "Imprimer Reception"
      this.visibleModalPrint = true;
      this.RemplirePrint(this.code);


    }

  }





  userCreate = "soufien";

  GetDataFromTableEditor: any;
  NewGetDataFromTableEditor: any;
  final = new Array<any>();
  final2 = new Array<any>();
  codeColoris: any;
  qteReceptionner: any = 1;
  qteDemander: any;
  codeSaisieMaitere: any;
  codeUnite: any;
  observation: any;
  MntFactureFournisseur: any;
  dateFactureFournisseur: any;


  ControlDetailsReceptionner() {
    for (let y = 0; y < this.listDataBRWithDetails.length; y++) {

      if (this.listDataBRWithDetails[y].qteReceptionner == null) {
        alertifyjs.set('notifier', 'position', 'top-right');
        alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px; font-size:13px""></i>' + " Remplire Touts les Details ");
        break;
      } else {

      }
    }
  }
  totalQteReceptionner: any
  calculateTotalQteReceptionner() {
    this.totalQteReceptionner = this.listDataBRWithDetails.reduce((sum, product) => sum + product.qteReceptionner, 0);
  }
  getPicReqNumPiece() {
    return "url('assets/assets/images/required_true.png')";
  }
  getPicInReqNumPiece() {
    return "url('assets/assets/images/required_false.png')";
  }
  ValeurOkDetails: any;
  PostBonReception() {



    this.calculateTotalQteReceptionner();
    if (this.totalQteReceptionner == 0) {
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Remplier any Qte");


    } else {

      if (!this.codeSaisie || this.listDataBRWithDetails.length == 0 || !this.dateFactureFournisseur || !this.codeFactureFournisseur) {
        alertifyjs.set('notifier', 'position', 'top-right');
        alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Field Required");

      } else {


        this.ControlDetRemplirePiece();


        this.ValeurOkDetails = localStorage.getItem("OKDETAILS");


        if (this.ValeurOkDetails != "OKDETAILS") {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Items Need Num Piece");
          localStorage.removeItem("OKDETAILS");

        } else {

          this.ControlDetailsReceptionner();

          for (let y = 0; y < this.listDataBRWithDetails.length; y++) {
            this.GetDataFromTableEditor = {
              laize: this.listDataBRWithDetails[y].laize,
              codeFournisseur: this.selectedFournisseur,
              codeDepot: this.selectedDepot,
              codeMatieres: this.listDataBRWithDetails[y].codeMatieres,
              matiereDTO: { code: this.listDataBRWithDetails[y].codeMatieres },
              codeUnites: this.listDataBRWithDetails[y].codeUnites,
              codeColoriss: this.listDataBRWithDetails[y].codeColoriss,
              valeurTaxe: this.listDataBRWithDetails[y].valeurTaxe,
              qteReceptionner: this.listDataBRWithDetails[y].qteReceptionner,
              qteDemander: this.listDataBRWithDetails[y].qteDemander,
              userCreate: this.userCreate,
              prixAchat: this.listDataBRWithDetails[y].prixAchat,
              mntTotalTTC: this.listDataBRWithDetails[y].mntTotalTTC,
              mntTotalHT: this.listDataBRWithDetails[y].mntTotalHT,
  
              codeOrdreAchat: this.selectedOA,
              mntTotalTaxe: this.listDataBRWithDetails[y].prixAchat * this.listDataBRWithDetails[y].qteDemander * (this.listDataBRWithDetails[y].valeurTaxe / 100),
              // }
            }
  
            this.final.push(this.GetDataFromTableEditor);
          }
  
  
  
          let body = {
            codeSaisie: this.codeSaisie,
            designationAr: this.designationAr,
            designationLt: this.designationLt,
            codeModeReglement: this.selectedModeReglement,
            userCreate: this.userCreate,
            // detailsOrdreAchatDTOs: this.final2,
            code: this.code,
            actif: this.actif,
            visible: this.visible,
            detailsBonReceptionDTOs: this.final,
            observation: "test obserrtvation from code",
            codeEtatReception: "2",
            codeDemandeAchat: this.selectedDemandeAchat,
            codeAppelOffre: this.selectedAppelOffre,
            codeOrdreAchat: this.selectedOA,
            mntTotalTTC: this.prixTotalTTC,
            mntTotalHT: this.TotalHTValue,
            mntTotalTaxe: this.TotalTaxeTimbre - -this.mntTimbre,
            mntRemise: this.remiseEnPourcent,
            mntTimbre: this.mntTimbre,
            dateFactureFournisseur: this.dateFactureFournisseur,
            mntFactureFournisseur: this.MntFactureFournisseur,
            codeFactureFournisseur: this.codeFactureFournisseur,
            codeFournisseur: this.selectedFournisseur,
            codeDepot: this.selectedDepot,
            codeTypeCircuitAchat: 2,
            mntNet: this.mntNet,
          }
  
  
  
          if (this.code != null) {
            body['code'] = this.code;
            console.log("Body to Update", body)
            this.param_achat_service.UpdateBonReception(body).pipe(
              catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) {
                } else {
                  alertifyjs.set('notifier', 'position', 'top-right');
                  alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);
                  localStorage.removeItem("OKDETAILS");
                }
                return throwError(errorMessage);
              })
  
            ).subscribe(
  
              (res: any) => {
                alertifyjs.set('notifier', 'position', 'top-right');
                alertifyjs.success('<i class="success fa fa-chevron-down" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + "Success Updated");
                localStorage.removeItem("OKDETAILS");
                this.clearForm();
                this.ngOnInit();
                this.check_actif = true;
                this.check_inactif = false;
                this.onRowUnselect(event);
                this.clearSelected();
                this.visibleNewModal = false;
                this.visDelete = false;
                this.codeDemandeAchat = this.selectedBonReception.code
                this.visibleModalPrint = false;
              }
            );
          }
          else {
            console.log("Body to Post", body)
            this.param_achat_service.PostBonReceptionWithDetails(body).pipe(
              catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) { } else {
                  this.final = new Array<any>();
                  this.mntNet = 0;
                  alertifyjs.set('notifier', 'position', 'top-right');
                  alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);
                  localStorage.removeItem("OKDETAILS");
                }
                return throwError(errorMessage);
              })
            ).subscribe(
              (res: any) => {
                alertifyjs.set('notifier', 'position', 'top-right');
                alertifyjs.success('<i class="success fa fa-chevron-down" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + "Success Saved");
                localStorage.removeItem("OKDETAILS");
                this.visibleNewModal = false;
                this.visDelete = false;
                this.visibleModalPrint = false;
                this.clearForm();
                this.ngOnInit();
                this.code;
                this.final;
                this.check_actif = true;
                this.check_inactif = false;
                this.onRowUnselect(event);
                this.clearSelected();
                // this.visibleModalPrint = true;
                // console.log("res", res);
                // this.codeDemandeAchat = res.code;
                // this.RemplirePrint(this.codeDemandeAchat);
  
  
              }
            )
  
  
  
          }

        }


      }


    }








    // }




  }
  codeAo: any;
  NewCodeAO = new Array<AppelOffre>;

  public remove(index: number): void {
    this.listDataBRWithDetails.splice(index, 1);
    this.calculateTaxe();
    this.ValueQteChanged();
    console.log("index", index);
  }

  public removeLigneDetails(index: number): void {
    this.details.splice(index, 1);
  }
  VerifQteDde(index: number) {

    for (let y = 0; y < this.listDataBRWithDetails.length; y++) {
      if (this.listDataBRWithDetails[y].qteLivrer.index > this.listDataBRWithDetails[y].qteDemander.index) {
        index.toPrecision()
        this.disColQte = true;
      } else {
        this.disColQte = false;
      }

    }

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
  DataBonReception = new Array<BonReception>();
  banque: any;
  GelAllBonReception() {
    this.isLoading = true;
    // this.headers.append('foo', 'bar');
    this.param_achat_service.GetBonReception().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          this.isLoading = false;
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.DataBonReception = data;
      this.isLoading = false;
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
  listDataBRWithDetails = new Array<any>();
  DetailsMatiere = new Array<any>();
  Newcompteur: number = 0;
  codeMatieres: any;
  disp: boolean = false;

  transformDateFormat() {
    this.dateFactureFournisseur = this.datePipe.transform(this.dateFactureFournisseur, "yyyy-MM-dd")

    console.log("  transformDateFormat  this.dateLivraison", this.dateFactureFournisseur)
  };

  dateLivraison: any;
  PushTableData() {
    var exist = false;

    for (var y = 0; y < this.listDataBRWithDetails.length; y++) {
      if (this.selectedMatiereToAdd != this.listDataBRWithDetails[y].codeMatieres) {
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

        this.listDataBRWithDetails.push(Newdata);
        console.log(" PushTableData listDataDAWithDetails", this.listDataBRWithDetails);

        // console.log(" PushTableData articles", this.ListMatiere);
        this.disp = true;
      })
    }

  }

  MakeEnabled() {
    this.disp = false;
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

  }

  totaltaxeMnt: number = 0.00000;
  TotalTaxeTimbre: any = 0.00000;
  totalTax: any = 0.00000;
  calculateTaxe() {
    let total = 0.000000;
    let mntTotalTaxe = 0.000000;
    this.totaltaxeMnt = 0.0000;
    for (let det of this.listDataBRWithDetails) {





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
  mntNet: any = 0.000000;
  prixTotalTTC: any = 0.000000;
  TotalHTValue: any = 0.000000;
  totalTax19: any = 0.000000;
  totalTax7: any = 0.000000;
  mntTimbre: any = 0.000000;
  TotalTaxeTmb: any;
  tott19!: number;
  tott7!: number;

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
      // this.TotalHTValue=0
      // this.totaltaxeMnt=0


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

    for (let y = 0; y < this.listDataBRWithDetails.length; y++) {



      if (this.listDataBRWithDetails[y].qteReceptionner > 0) {
        this.GetDataFromTableEditor = {
          qteReceptionner: this.listDataBRWithDetails[y].qteReceptionner,
          prixAchat: this.listDataBRWithDetails[y].prixAchat,
          valeurTaxe: this.listDataBRWithDetails[y].valeurTaxe,
          qteDemander: this.listDataBRWithDetails[y].qteDemander

        }
        this.listDataBRWithDetails[y].qteDemander = this.GetDataFromTableEditor.qteDemander;
        this.listDataBRWithDetails[y].qteReceptionner = this.GetDataFromTableEditor.qteReceptionner;
        this.listDataBRWithDetails[y].prixAchat = this.GetDataFromTableEditor.prixAchat;
        this.listDataBRWithDetails[y].valeurTaxe = this.GetDataFromTableEditor.valeurTaxe;
        this.listDataBRWithDetails[y].mntTotalHT = this.GetDataFromTableEditor.mntTotalHT;

        let qteReceptionner = this.GetDataFromTableEditor.qteReceptionner;
        let prixUniAchat1 = this.GetDataFromTableEditor.prixAchat;
        let valeurtaxe = this.GetDataFromTableEditor.valeurTaxe / 100;

        let pxtotal = qteReceptionner * prixUniAchat1;
        let valeurTaxe1 = valeurtaxe * pxtotal;
        let valeurTotalTTC = pxtotal + +valeurTaxe1
        this.listDataBRWithDetails[y].mntTotalTTC = valeurTotalTTC;
        let value = this.listDataBRWithDetails[y].mntTotalTTC;
        this.listDataBRWithDetails[y].mntTotalTTC = value.toFixed(6);


        this.listDataBRWithDetails[y].mntTotalHT = pxtotal;
        let value2 = this.listDataBRWithDetails[y].mntTotalHT;
        this.listDataBRWithDetails[y].mntTotalHT = value2.toFixed(6);

      } else {

      }


    }
    // this.calculateThisYearTotal();
    this.calculateTaxe();
  }

  GetOrdreAchatByCode(code: number) {

    if (this.selectedOA == null) {
      this.listDataBRWithDetails = new Array<any>();
      this.prixTotalTTC = 0.000000;
      this.TotalHTValue = 0.000000;
      this.remiseEnPourcent = 0.000000;
      this.mntNet = 0.000000;
      this.totaltaxeMnt = 0.000000;
      this.TotalTaxeTmb = 0.000000;
      this.mntTimbre = 0.000000;

    } else {

      this.param_achat_service.GetOrdreAchatByCodeIn(this.selectedOA).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) { } else {
            alertifyjs.set('notifier', 'position', 'top-right');
            alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

          }
          return throwError(errorMessage);
        })
      ).subscribe((data: any) => {
        this.selectedDemandeAchat = data.codeDemandeAchat;
        this.selectedAppelOffre = data.codeAppelOffre;

        this.selectedFournisseur = data.codeFournisseur;
        this.param_achat_service.GetFournisseurByCode(data.codeFournisseur).pipe(
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
          this.listFRSPushed.push({ label: data.designationAr, value: data.code })
          this.listFRSRslt = this.listFRSPushed;
        })

      }
      )







      this.param_achat_service.GetDetailsOrdreAchatByCodeNotFullRevcived(this.selectedOA).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) { } else {
            alertifyjs.set('notifier', 'position', 'top-right');
            alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

          }
          return throwError(errorMessage);
        })
      ).subscribe((data: any) => {
        this.listDataBRWithDetails = new Array<any>();
        this.listDataBRWithDetails = data;
        //  get first row in data
        let x = this.listDataBRWithDetails;
        this.mntNet = 0;
        for (let y = 0; y < this.listDataBRWithDetails.length; y++) {

          if (this.listDataBRWithDetails[y].qteLivrer >= this.listDataBRWithDetails[y].qteDemander) {
            this.listDataBRWithDetails[y].qteReceptionner = this.listDataBRWithDetails[y].qteLivrer;
          } else {
            this.listDataBRWithDetails[y].qteReceptionner = 0;

          }
          if (this.listDataBRWithDetails[y].qteLivrer == 0) {
            this.listDataBRWithDetails[y].qteLivrer = 0;
          } else {
            this.listDataBRWithDetails[y].qteLivrer = this.listDataBRWithDetails[y].qteLivrer;

          }
        }



      })
    }




  }

  codeDemandeAchats: any;
  GetCodeEtatReception() {
    if (this.selectedEtatReception == undefined) {

    } else {
      this.param_achat_service.GetBonReceptionByEtatRecepetion(this.selectedEtatReception.code).pipe(
        catchError((error: HttpErrorResponse) => {

          let errorMessage = '';
          if (error.error instanceof ErrorEvent) { } else {
            alertifyjs.set('notifier', 'position', 'top-right');
            alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

          }
          return throwError(errorMessage);
        })

      ).subscribe((data: any) => {



        this.DataBonReception = data;

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

  dataOA = new Array<OrdreAchat>();
  listOAPushed = new Array<any>();
  listOARslt = new Array<any>();

  GetOrdreAchat() {
    this.param_achat_service.GetOrdreAchatNonReceptionnerTotalement().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.dataOA = data;
      this.listOAPushed = [];
      for (let i = 0; i < this.dataOA.length; i++) {
        this.listOAPushed.push({ label: this.dataOA[i].codeSaisie, value: this.dataOA[i].code })
      }
      this.listOARslt = this.listOAPushed;
    })
  }



  DataFournisseur = new Array<OrdreAchat>();
  listFRSPushed = new Array<any>();
  listFRSRslt = new Array<any>();

  GetFournisseur(codeFournisseur: number) {
    if (this.selectedOA == null) {

    } else {

      // console.log("selectedOA" , this.selectedOA.codeFournisseur)

    }
  }
  // GetCodeMatiere(index: number){
  //   // codeMatiere
  //   this.codeMatiere = this.listDataBRWithDetails.push(index, 1);
  // }
  CodeMatiereSelected: any;
  QteReceptionnerTotal: any;
  getCodemartiereAtIndex(index: number): string {
    const item = this.listDataBRWithDetails[index]; // Get the item at the given index
    if (item) {
      console.log("codematiere", item.codeMatieres);
      this.CodeMatiereSelected = item.codeMatieres;
      return item.codeMatieres;
    } else {
      return ''; // Handle cases where the index is invalid
    }
  }
  getQteReceptionnerAtIndex(index: number): string {
    const item = this.listDataBRWithDetails[index]; // Get the item at the given index
    if (item) {
      this.QteReceptionnerTotal = item.qteReceptionner;
      return item.qteReceptionner;
    } else {
      return ''; // Handle cases where the index is invalid
    }
  }

  codeMatiere: any;
  OpenModalDetails(mode: string) {
    this.isLoading = false;
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'DetailsMatiere') {
      button.setAttribute('data-target', '#ModalDetails');
      this.formHeaderDetails = "Details Matiere";
      this.details = new Array<any>();

      this.visibleModalDetails = true;
      this.param_achat_service.GetDetailsREceptionTemp(this.selectedOA, this.CodeMatiereSelected).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) { } else {
            alertifyjs.set('notifier', 'position', 'top-right');
            alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

          }
          return throwError(errorMessage);
        })

      ).subscribe((data: any) => {
        this.details = data;
        console.log("LoadOK");
      })

    }

  }

  details: DetailsMatiere[] = [

  ]
  // details = new Array<DetailsMatiere>();
  // details : any;
  newDetails: DetailsMatiere = { codeMatiere: '', numPiece: '', laize: '', qteReceptionner: 0 };

  addRow() {
    // Add the newProduct to the products array
    this.details.push({ ...this.newDetails });

    // Clear the newProduct object
    this.newDetails = { codeMatiere: '', numPiece: '', laize: '', qteReceptionner: 0 };
  }

  DetailsReceptTemp = new Array<any>();
  totalQte: any;
  calculateTotalQte() {
    this.totalQte = this.details.reduce((sum, product) => sum + product.qteReceptionner, 0);
  }


  PostDetailsBonReception() {
    this.calculateTotalQte();
    if (this.details.length == 0) {
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` Remplire Details Matiere`);

    } else {

      if (this.totalQte > this.QteReceptionnerTotal) {

        alertifyjs.set('notifier', 'position', 'top-right');
        alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` Qte Receptionner non egales`);



      } else {

        this.param_achat_service.DeleteDetailsREceptionTemp(this.selectedOA, this.CodeMatiereSelected).pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) { } else {
              alertifyjs.set('notifier', 'position', 'top-right');
              alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

            }
            return throwError(errorMessage);
          })

        ).subscribe((data: any) => {
          console.log("DEleted Ok");
        })
        for (let i = 0; i < this.details.length; i++) {

          if (this.CodeMatiereSelected == '' || this.details[i].laize == '' || this.details[i].numPiece == '') {
            // this.removeLigneDetails(i)
            alertifyjs.set('notifier', 'position', 'top-right');
            alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` Delete Row Empty`);
            this.visibleModalDetails = true;
          } else {
            this.details[i].codeMatiere = this.CodeMatiereSelected;
            this.visibleModalDetails = false;

            this.GetDataFromTableEditor = {
              codeOrdreAchat: this.selectedOA,
              laize: this.details[i].laize,
              numPiece: this.details[i].numPiece,
              codematiere: this.details[i].codeMatiere,
              qteReceptionner: this.details[i].qteReceptionner,
            }
            this.DetailsReceptTemp.push(this.GetDataFromTableEditor);
            this.param_achat_service.PostDetailsREceptionTemp(this.GetDataFromTableEditor).pipe(
              catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) { } else {
                  alertifyjs.set('notifier', 'position', 'top-right');
                  alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

                }
                return throwError(errorMessage);
              })

            ).subscribe((data: any) => {
              console.log("PostDetailsOK");
            })
          }


        }
      }
      // console.log("this.details", this.details)
    }

  }
  ControlDetRemplirePiece() {
    for (let i = 0; i < this.listDataBRWithDetails.length; i++) {


      for (let x = 0; x < this.details.length; x++) {

        if (this.listDataBRWithDetails[i].requiredNumPiece = 1 && this.details[x].numPiece == '') {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + 'Matiere Need Num Piece');
          break;

        } else {
          console.log("ok details tous remplire");
          localStorage.setItem("OKDETAILS", "OKDETAILS");
        }
      }


    }
  }



}



