import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ChangeDetectorRef, OnInit, ViewChild, AfterViewInit, ElementRef, Input, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { catchError, Subject, throwError } from 'rxjs';
import { Table } from 'primeng/table';
import * as alertifyjs from 'alertifyjs'
import { AO, AODetails, AppelOffre, Coloris, DemandeAchat, Depot, DetailsAppelOffre, Matiere, ModeReglement, Param, Taxe, TypeCaisse, TypeTaxe, Unite } from 'src/app/parametrageCenral/domaine/ParametrageCentral';
import { ParametrageCentralService } from 'src/app/parametrageCenral/ParametrageCentralService/parametrage-central.service';
import { Card } from 'primeng/card';



declare const PDFObject: any;

@Component({
  selector: 'app-demande-achat',
  templateUrl: './demande-achat.component.html',
  styleUrl: './demande-achat.component.css', providers: [ConfirmationService, MessageService]
})
export class DemandeAchatComponent {





  v2!: any[];

  openModal!: boolean;

  constructor(private confirmationService: ConfirmationService,
    private param_achat_service: ParametrageCentralService, private messageService: MessageService, private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {

  }

  selectedMatiere: any;


  pdfData!: Blob;
  isLoading = false;
  ngOnInit(): void {


    this.GelAllDemandeAchat();
    this.VoidsNew();

    this.v2 = [
      { field: 'codeSaisie', header: 'Code Saisie' },
      { field: 'designationAr', header: 'Designation', style: 'width: 100px !important;' },
      { field: 'unite', header: 'Unite' },
      { field: 'coloris', header: 'Coloris' },
      { field: 'quantite', header: 'Quantite' },
    ];


  }
  codeDemandeAchat!: number;
  RemplirePrint(codeDemandeAchat: any): void {
    if (this.selectedDemandeAchat == null) {
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + "Select any row please");
      this.visibleModalPrint = false;
    } else {
      this.param_achat_service.getDemandeAchatEdition(codeDemandeAchat).subscribe(blob => {
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
    this.listDataDAWithDetails = new Array<any>();
    this.final = new Array<any>();
    this.selectedDemandeAchat = '';
    this.selectedDepot = '';
  }

  closeModalPrint() {
    this.visibleModalPrint = false;
    this.onRowUnselect(event);
    this.clearSelected();
    this.selectedDemandeAchat = null;
    this.pdfData = new Blob;

  }
  check_actif = false;
  check_inactif = false;

  formHeader = ".....";
  searchTerm = '';
  visibleNewModal: boolean = false;
  visibleModalPrint: boolean = false;
  visibleModalDdeDirect: boolean = false;
  visDelete: boolean = false;
  code!: any | null;
  codeSaisie: any;
  designationAr: any;
  designationLt: string = "NULL";
  codeTypeCaisse: number = 0;
  codeBanque: string = "NULL";
  actif!: boolean;
  visible!: boolean;

  selectedDemandeAchat!: any;


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
    console.log('vtData : ', event, 'selected AO code : ', this.selectedDemandeAchat);
    this.selectedDemandeAchat == null;

  }

  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
    this.selectedModeReglement = null;
    this.selectedMatiereToAdd = null;
    this.observation = null;
    this.selectedDemandeAchat = '';
    console.log(" selectedDemandeAchat", this.selectedDemandeAchat)

  }




  DeleteDemandeAchat(code: any) {
    this.param_achat_service.DeleteDemandeAchat(code).pipe(
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
    this.listDataDAWithDetails = new Array<any>();


  }



  public onOpenModal(mode: string) {

    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'Newadd') {
      button.setAttribute('data-target', '#NewModal');
      this.formHeader = "Nouveau Demande Achat";

      this.listDataDAWithDetails = new Array<any>();
      this.onRowUnselect(event);
      this.clearSelected();
      this.actif = false;
      this.visibleNewModal = true;
      this.visDelete = false;
      this.code == undefined;
      try {
        this.GelMatiereActifVisible();
        this.GelAllModeReglement();
        this.GelUniteActifVisible();
        this.GetColorisActifVisible();
        this.GelAllAppelOffre();
        this.GelAllDepotPrincipal();
        this.RemplireDropTaxe();
        this.GetTypeTaxe();
      } catch {
        alertifyjs.set('notifier', 'position', 'top-right');
        alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + "Error Loading Data");

      }


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
          this.formHeader = "Edit Demande Achat"

          this.GelMatiereActifVisible();


          this.onRowSelect;
          this.GelAllModeReglement();

          this.GelAllDepotPrincipal();
          this.GetColorisActifVisible();
          this.GelUniteActifVisible();
          this.GetDemandeAchatByCode(this.selectedDemandeAchat);
          this.RemplireDropTaxe();

          this.GetTypeTaxe();
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
          } else {

            {
              button.setAttribute('data-target', '#ModalDelete');
              this.formHeader = "Delete Demande Achat"

              this.visDelete = true;
            }
          }

        }
    if (mode === 'Print') {


      button.setAttribute('data-target', '#ModalPrint');
      this.formHeader = "Imprimer Demander Achat"
      this.visibleModalPrint = true;
      this.RemplirePrint(this.code);


    }

  }




  userCreate = "soufien";

  GetDataFromTableEditor: any;
  final = new Array<any>();
  codeColoris: any;
  qteDemander: number = 0;
  codeSaisieMaitere: any;
  codeUnite: any;
  observation: any;
  PostDemandeAchat() {








    if (!this.selectedModeReglement || !this.codeSaisie || this.listDataDAWithDetails.length == 0) {
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Field Required");

    } else {

      for (let y = 0; y < this.listDataDAWithDetails.length; y++) {

        this.GetDataFromTableEditor = {


          codematiere: { code: this.listDataDAWithDetails[y].codeMatieres },
          codeUnite: { code: this.listDataDAWithDetails[y].codeUnites },
          codeColoris: { code: this.listDataDAWithDetails[y].codeColoriss },
          qteDemander: this.listDataDAWithDetails[y].qteDemander, userCreate: this.userCreate,
        }
        this.final.push(this.GetDataFromTableEditor);




      }
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
        detailsDemandeAchatDTOs: this.final,
        observation: this.observation,
        codeEtatReception: "2"
      }



      if (this.code != null) {
        body['code'] = this.code;
        console.log("Body to Update", body)
        this.param_achat_service.UpdateDemandeAchat(body).pipe(
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
            this.codeDemandeAchat = this.selectedDemandeAchat.code
            this.visibleModalPrint = false;
          }
        );
      }
      else {
        console.log("Body to Post", body)

        this.param_achat_service.PostDemandeAchatWithDetails(body).pipe(
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
  // codeAo: any;
  // NewCodeAO = new Array<AppelOffre>;

  public remove(index: number): void {
    this.listDataDAWithDetails.splice(index, 1);
    console.log("index", index);
  }



  types!: any[];


  selectedAppelOffre: any;
  selectedDepot: any;
  total: any;
  GetAppelOffreByCode(code: number) {

    // console.log("selectedAppelOffre: code ; ",this.selectedAppelOffre)

    if (this.selectedAppelOffre == null) {
      this.listDataDAWithDetails = new Array<any>();
    } else {


      this.param_achat_service.GetAppelOffreByCode(this.selectedAppelOffre).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) { } else {
            alertifyjs.set('notifier', 'position', 'top-right');
            alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

          }
          return throwError(errorMessage);
        })

      ).subscribe((data: any) => {
        this.listDataDAWithDetails = new Array<any>();
        this.listDataDAWithDetails = data;

        for (let y = 0; y < this.listDataDAWithDetails.length; y++) {

          this.GetDataFromTableEditor = {
            qteDemander: this.listDataDAWithDetails[y].qteDemander,
            prixAchat: this.listDataDAWithDetails[y].prixAchat,
            codeTaxe: this.listDataDAWithDetails[y].codeTaxe

          }
          this.listDataDAWithDetails[y].qteDemander = this.GetDataFromTableEditor.qteDemander;
          this.listDataDAWithDetails[y].prixAchat = this.GetDataFromTableEditor.prixAchat;
          this.listDataDAWithDetails[y].codeTaxe = this.GetDataFromTableEditor.codeTaxe;
          this.listDataDAWithDetails[y].prixTotalHT = this.GetDataFromTableEditor.prixTotalHT;

          let qteDemander1 = this.GetDataFromTableEditor.qteDemander;
          let prixUniAchat1 = this.GetDataFromTableEditor.prixAchat;

          this.listDataDAWithDetails[y].prixAchat = prixUniAchat1;
          let value3 = this.listDataDAWithDetails[y].prixAchat;
          this.listDataDAWithDetails[y].prixAchat = value3.toFixed(6);


          let valeurtaxe = this.GetDataFromTableEditor.codeTaxe / 100;

          let pxtotal = qteDemander1 * prixUniAchat1;
          let valeurTaxe1 = valeurtaxe * pxtotal;
          let valeurTotalTTC = pxtotal + +valeurTaxe1;

          this.listDataDAWithDetails[y].prixTotTTC = valeurTotalTTC;
          let value = this.listDataDAWithDetails[y].prixTotTTC;
          this.listDataDAWithDetails[y].prixTotTTC = value.toFixed(6);


          this.listDataDAWithDetails[y].prixTotalHT = pxtotal;
          let value2 = this.listDataDAWithDetails[y].prixTotalHT;
          this.listDataDAWithDetails[y].prixTotalHT = value2.toFixed(6);

          console.log("GetAppelOffreByCode valeurTotalTTC is ", valeurTotalTTC);
          // this.totalTax19 = "'(valeurTaxe12)'";
          // this.listDataDAWithDetails[y].totalTax19 = this.totalTax19;
          // let tx = this.GetDataFromTableEditor.codeTaxe;
          // if (tx == 18) {
          //   this.listDataDAWithDetails[y].qteDemander = this.GetDataFromTableEditor.qteDemander;
          //   this.listDataDAWithDetails[y].prixAchat = this.GetDataFromTableEditor.prixAchat;
          //   this.listDataDAWithDetails[y].codeTaxe = this.GetDataFromTableEditor.codeTaxe; 

          //   let qteDemander1 = this.GetDataFromTableEditor.qteDemander;
          //   let prixUniAchat1 = this.GetDataFromTableEditor.prixAchat;
          //   let pxtotal = qteDemander1 * prixUniAchat1;
          //   let valeurtaxe = this.GetDataFromTableEditor.codeTaxe / 100;
          //   let valeurTaxe12 = valeurtaxe * pxtotal;


          //   console.log("valeurTaxe12" , valeurTaxe12 ,"val 19 ",valeurtaxe , "pxtotal",pxtotal ,"prixUniAchat1" ,prixUniAchat1)
          // } else if (tx == 7) {
          //   console.log("val 7 " )
          // }else
          // {
          //   this.totalTax19 = 0.000000;
          //   this.TotalTax7 = 0.000000;

          // }


        }

        this.calculateThisYearTotal();
        console.log("GetAppelOffreByCode listDataAOWithDetails is ", this.listDataDAWithDetails);


      })
    }

  }



  valeurTVA: any;
  remiseEnPourcent: any;
  prixTotalTTC: any;
  TotalTTCValue: any;
  totalTax19: any;
  TotalTax7: any;
  mntTimbre: any;
  TotalTaxeTmb: any;
  calculateThisYearTotal() {
    let total = 0.000000;
    let mnttotalHT19 = 0.000000;
    let mnttotalHT0 = 0.000000;
    let mnttotalHT7 = 0.000000;
    for (let sale of this.listDataDAWithDetails) {
      total += +sale.prixTotTTC;
      let mnttaxe = sale.codeTaxe / 100;
      if (sale.codeTaxe == 19) {

        mnttotalHT19 += +sale.prixTotalHT * mnttaxe;
        this.totalTax19 = mnttotalHT19;
        let valuetx19 = this.totalTax19;
        this.totalTax19 = valuetx19.toFixed(6);

      }
      if (sale.codeTaxe == 7) {
        mnttotalHT7 += +sale.prixTotalHT * mnttaxe;
        this.TotalTax7 = mnttotalHT7;
        let valuetx7 = this.TotalTax7;
        this.TotalTax7 = valuetx7.toFixed(6);
      }


    }
    console.log("total", total)
    this.thisYearTotal = total;
    let value2 = this.thisYearTotal;
    this.thisYearTotal = value2.toFixed(6);

    this.TotalTTCValue = this.thisYearTotal;
  

    this.CalculeTaxeTimbre();
    
  }

  codeTaxeA: any;
  DataTimbre = new Array<Param>;
  DataTimbrePushed = new Array<any>;
  DataTimbreReslt = new Array<any>;
  CalculeTaxeTimbre() {


    this.param_achat_service.GetMntTimbre().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.DataTimbre = data;
      this.DataTimbrePushed = [];
      for (let i = 0; i < this.DataTimbre.length; i++) {

        this.mntTimbre = this.DataTimbre[i].valeur
        this.TotalTaxeTmb = +this.TotalTax7  + +this.totalTax19 + +this.DataTimbre[i].valeur
      }

    })
    

 
  }


  ValueQteChanged() {
    for (let y = 0; y < this.listDataDAWithDetails.length; y++) {

      this.GetDataFromTableEditor = {
        qteDemander: this.listDataDAWithDetails[y].qteDemander,
        prixAchat: this.listDataDAWithDetails[y].prixAchat,
        codeTaxe: this.listDataDAWithDetails[y].codeTaxe

      }
      this.listDataDAWithDetails[y].qteDemander = this.GetDataFromTableEditor.qteDemander;
      this.listDataDAWithDetails[y].prixAchat = this.GetDataFromTableEditor.prixAchat;
      this.listDataDAWithDetails[y].codeTaxe = this.GetDataFromTableEditor.codeTaxe;
      this.listDataDAWithDetails[y].prixTotalHT = this.GetDataFromTableEditor.prixTotalHT;

      let qteDemander1 = this.GetDataFromTableEditor.qteDemander;
      let prixUniAchat1 = this.GetDataFromTableEditor.prixAchat;
      let valeurtaxe = this.GetDataFromTableEditor.codeTaxe / 100;

      let pxtotal = qteDemander1 * prixUniAchat1;
      let valeurTaxe1 = valeurtaxe * pxtotal;
      let valeurTotalTTC = pxtotal + +valeurTaxe1
      this.listDataDAWithDetails[y].prixTotTTC = valeurTotalTTC;
      let value = this.listDataDAWithDetails[y].prixTotTTC;
      this.listDataDAWithDetails[y].prixTotTTC = value.toFixed(6);


      this.listDataDAWithDetails[y].prixTotalHT = pxtotal;
      let value2 = this.listDataDAWithDetails[y].prixTotalHT;
      this.listDataDAWithDetails[y].prixTotalHT = value2.toFixed(6);

    }
    this.calculateThisYearTotal();
  }




  // selectedMatiere: any;
  selectedCodeModeReglement: any;
  compteur: number = 0;
  // listDesig = new Array<any>();
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
  // listDesig2 = new Array<any>();



  VoidsNew(): void {
    this.articles = [

    ].sort((car1, car2) => {
      return 0;
    });

  }

  // brands!: SelectItem[];
  // clonedCars: { [s: string]: AppelOffre } = {};
  // codeModeReglementDde: {}[] = [];
  dataDemandeAchat = new Array<DemandeAchat>();
  banque: any;
  GelAllDemandeAchat() {
    this.param_achat_service.GetDemandeAchat().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {



      this.dataDemandeAchat = data;
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



  // @Input() showTable: boolean = false;
  // selectedTable: string = 'table1';
  dataAppelOffre = new Array<AppelOffre>();
  listAppelOffrePushed = new Array<any>();
  listAppelOffreRslt = new Array<any>();
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
      this.listAppelOffrePushed = [];
      for (let i = 0; i < this.dataAppelOffre.length; i++) {
        this.listAppelOffrePushed.push({ label: this.dataAppelOffre[i].designationAr, value: this.dataAppelOffre[i].code })
      }
      this.listAppelOffreRslt = this.listAppelOffrePushed;
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







  // AODetails = new Array<AODetails>();
  selectedMatiereToAdd: any;
  ListMatiere!: Matiere[];
  listDataDAWithDetails = new Array<any>();
  Newcompteur: number = 0;
  codeMatieres: any;
  disp: boolean = false;
  PushTableData() {
    var exist = false;

    for (var y = 0; y < this.listDataDAWithDetails.length; y++) {
      if (this.selectedMatiereToAdd != this.listDataDAWithDetails[y].codeMatieres) {
        exist = false;
      } else {
        exist = true;

        alertifyjs.set('notifier', 'position', 'top-right');
        alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Item Used");

        break;
      }


    }
    // control remplire codeUnite + codeColoris + qte 


    if ((this.selectedMatiereToAdd != undefined) && (this.selectedMatiereToAdd != "") && (!exist)) {
      this.param_achat_service.GetMatiereByCode(this.selectedMatiereToAdd).subscribe((Newdata: any) => {
        // this.ListMatiere[this.Newcompteur] = Newdata;
        this.Newcompteur = this.Newcompteur + 1;

        this.listDataDAWithDetails.push(Newdata);
        console.log(" PushTableData listDataDAWithDetails", this.listDataDAWithDetails);

        // console.log(" PushTableData articles", this.ListMatiere);
        this.disp = true;
      })
    }

  }


  // codeTaxe: any;
  CalculePrixTTC() {
    console.log("this.listDataDAWithDetails for TAxe: ", this.listDataDAWithDetails);
    for (let y = 0; y < this.listDataDAWithDetails.length; y++) {

      this.GetDataFromTableEditor = {
        qteDemander: this.listDataDAWithDetails[y].qteDemander,
        prixAchat: this.listDataDAWithDetails[y].prixAchat
      }
      // this.listDataDAWithDetails[y].qteDemander = this.GetDataFromTableEditor.qteDemander;
      // this.listDataDAWithDetails[y].prixAchat = this.GetDataFromTableEditor.prixAchat;
      // this.listDataDAWithDetails[y].codeTaxe = this.GetDataFromTableEditor.qteDemander;
      let qteDemander1 = this.GetDataFromTableEditor.qteDemander;
      let prixUniAchat1 = this.GetDataFromTableEditor.prixAchat;
      let pxtotal = qteDemander1 * prixUniAchat1;

      console.log("pxtotal : ", pxtotal, "prixUniAchat1",
        prixUniAchat1, "qteDemander1", qteDemander1)

      this.listDataDAWithDetails[y].prixTotTTC += pxtotal

    }

    // this.listTaxeRslt = new Array<any>();
  }



  // lastYearTotal!: number;


  thisYearTotal!: any;

  GetDemandeAchatByCode(code: number) {

    this.param_achat_service.GetDemandeAchatByCode(this.code).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.listDataDAWithDetails = new Array<any>();

      this.listDataDAWithDetails = data;

      console.log("GetDemandeAchatByCode listDataDAWithDetails is ", this.listDataDAWithDetails);



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
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

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



  DataTaxe = new Array<Taxe>();
  listTaxePushed = new Array<any>();
  listTaxeRslt = new Array<any>();
  selectedTaxe: any | "";



  RemplireDropTaxe() {

    this.param_achat_service.GetTaxe().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

        }

        return throwError(errorMessage);
      })
    ).subscribe((data: any) => {
      this.DataTaxe = data;
      this.listTaxePushed = [];
      for (let i = 0; i < this.DataTaxe.length; i++) {
        this.listTaxePushed.push({ label: this.DataTaxe[i].valeurTaxe, value: this.DataTaxe[i].code })
      }
      this.listTaxeRslt = this.listTaxePushed;
    }
    )



  }

  DataTypeTaxe = new Array<TypeTaxe>();
  listTypeTaxePushed = new Array<any>();
  listTypeTaxeRslt = new Array<any>();
  // selectedTypeTaxe: any | "";
  GetTypeTaxe() {
    this.param_achat_service.GetTypeTaxe().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");
        }
        return throwError(errorMessage);
      })
    ).subscribe((data: any) => {
      this.DataTypeTaxe = data;
      this.listTypeTaxePushed = [];
      for (let i = 0; i < this.DataTypeTaxe.length; i++) {
        this.listTypeTaxePushed.push({ label: this.DataTypeTaxe[i].designation, value: this.DataTypeTaxe[i].code })
      }
      this.listTypeTaxeRslt = this.listTypeTaxePushed;
    })
  }



}


