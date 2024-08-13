import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ChangeDetectorRef, OnInit, ViewChild, AfterViewInit, ElementRef, Input, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { catchError, Subject, throwError } from 'rxjs';
import { Table } from 'primeng/table';
import * as alertifyjs from 'alertifyjs'
import { AO, AODetails, AppelOffre, City, Coloris, Compteur, DemandeAchat, Departement, Depot, DetailsAppelOffre, Matiere, ModeReglement, Param, Taxe, TypeCaisse, TypeTaxe, Unite, User } from 'src/app/domaine/ParametrageCentral';
import { ParametrageCentralService } from 'src/app/parametrageCenral/ParametrageCentralService/parametrage-central.service';
import { Card } from 'primeng/card';
import { DatePipe } from '@angular/common';
import { EncryptionService } from 'src/app/shared/EcrypteService/EncryptionService';
 
import { WserviceAchat } from 'src/app/shared/WServices/StockService';
declare const PDFObject: any;
@Component({
  selector: 'app-dde-transfert-matiere',
  templateUrl: './dde-transfert-matiere.component.html',
  styleUrl: './dde-transfert-matiere.component.css'
})
export class DdeTransfertMatiereComponent {


 

  openModal!: boolean;
  items!: MenuItem[];
  constructor(private encryptionService: EncryptionService,private confirmationService: ConfirmationService, private datePipe: DatePipe,
    private param_achat_service: ParametrageCentralService, private messageService: MessageService, private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {

  }

  selectedMatiere: any;


  pdfData!: Blob;
  isLoading = false;
  ngOnInit(): void {
    this.items = [
      { label: 'Validation', icon: 'pi pi-fw pi-check-square', command: () => this.OpenPasswordModal('PasswordModal',this.selectedDemandeAchat) },
      { label: 'Annuler Validation', icon: 'pi pi-fw pi-history', command: () => this.OpenPasswordModal('PasswordModal',this.selectedDemandeAchat) },
    ];

    // WserviceAchat.;
    this.VoidsNew();
    this.getValued();
    this.valDate();
    


  }
  GelAllDemandeTransfert() {
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

    })
}

  getPicValider() {
    return "url('assets/assets/images/etat_RCTotal.png')";
  }

  getPicRefuser() {
    return "url('assets/assets/images/etat_NRCP.png')";
  }

  getPicNonEncore() {
    return "url('assets/assets/images/etat_RCPPartiel.png')";
  }

  DataCodeSaisie = new Array<Compteur>();
  GetCodeSaisie() {
    this.param_achat_service.GetcompteurCodeSaisie("codeSaisieDA").pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.DataCodeSaisie = data;
      this.codeSaisie = data.prefixe + data.suffixe;


    })
  }


  password: any;
  OpenPasswordModal(mode: string,event:any) {


    if(this.selectedValue == 1){
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + "Demande d'Achat Non Encore Approuver");
      
    }else{


      const container = document.getElementById('main-container');
      const contextMenu = document.createElement('button');
      contextMenu.type = 'button';
      contextMenu.style.display = 'none';
      contextMenu.setAttribute('data-toggle', 'modal');
      if (mode === 'PasswordModal') {
        contextMenu.setAttribute('data-target', '#ModalPassword');
        this.formHeader = "Password";
        this.visibleModalApprove = false;
        this.visDelete = false;
        this.visibleNewModal = false;
        this.visibleModalPrint = false;
        this.visbileModalPassword = true;
      }

    }


  }

  CloseModal() {
    this.visbileModalPassword = false;
    this.visibleModalApprove = false;
  }
  
  codeDemandeAchat!: number;
  RemplirePrint(codeDemandeAchat: any): void {
    if (this.selectedDemandeAchat == null) {
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + "Select any row please");
      this.visibleModalPrint = false;
    } else {
      this.param_achat_service.getDemandeAchatEdition(codeDemandeAchat).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
          } else {
            alertifyjs.set('notifier', 'position', 'top-right');
            alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );
          }
          return throwError(errorMessage);
        })
      ).subscribe(blob => {
        const reader = new FileReader();
        const binaryString = reader.readAsDataURL(blob);
        reader.onload = (event: any) => {
          this.pdfData = event.target.result;
          this.isLoading = false;
          if (this.pdfData) {
            this.handleRenderPdf(this.pdfData);
          } else {

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
    this.selectedAppelOffre = '';
    this.visibleModalApprove = false;
    this.password = ''
    this.selectedUsers='';
  }

  closeModalPrint() {
    this.visibleModalPrint = false;
    this.selectedDemandeAchat = null;
    this.onRowUnselect(event);
    this.clearSelected();
    this.pdfData = new Blob;
  }
  check_actif = false;
  check_inactif = false;

  formHeader = ".....";
  searchTerm = '';
  visibleNewModal: boolean = false;
  visibleModalPrint: boolean = false;
  visibleModalDdeDirect: boolean = false;
  visibleModalApprove: boolean = false;
  visbileModalPassword: boolean = false;
  selectedValue: any = 1;
  visDelete: boolean = false;
  code!: any | null;
  codeSaisie: any;
  departement: any;
  designationAr: any;
  designationLt: string = "NULL";
  codeTypeCaisse: number = 0;
  codeBanque: string = "NULL";
  actif!: boolean;
  visible!: boolean;
  selectedDemandeAchat!: any;
  selectedModeReglement: any;

  minDate!: Date;

  maxDate!: Date;
  es: any;

  invalidDates!: Array<Date>
  valDate() {
    this.es = {
      firstDayOfWeek: 1,
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      today: 'Hoy',
      clear: 'Borrar'
    }

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    let nextMonth = (month === 11) ? 0 : month + 1;
    let nextYear = (nextMonth === 0) ? year + 1 : year;
    this.minDate = new Date();
    this.minDate.setMonth(prevMonth);
    this.minDate.setFullYear(prevYear);
    this.maxDate = new Date();
    this.maxDate.setMonth(nextMonth);
    this.maxDate.setFullYear(nextYear);

    let invalidDate = new Date();
    invalidDate.setDate(today.getDate() - 1);
    this.invalidDates = [today, invalidDate];
  }



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
    this.selectedDepartement = event.data.codeDepartement;
    this.selectedDepot = event.data.codeDepot;
    this.selectedUsers = event.data.userDemander;
    this.selectedValue = event.data.codeEtatApprouver;
    this.dateLivraison = event.data.dateLivraison;
    if (event.data.codeEtatApprouver == 2) {
      this.disBtnModif = true;
      this.disBtnDelete = true;
      this.VisBtnPrintDA = true;
      this.VisBtnDeleteDA = false;
      this.disBtnValider = true;
    } else if (event.data.codeEtatApprouver == 3) {
      this.VisBtnDeleteDA = true;
      this.disBtnModif = true;
      this.disBtnDelete = true;
      this.VisBtnPrintDA = false;
      this.disBtnValider = true;
    } else {
      this.VisBtnDeleteDA = true;
      this.disBtnModif = false;
      this.disBtnDelete = false;
      this.VisBtnPrintDA = false;
      this.disBtnValider = false;
    }

  }

  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
    this.selectedModeReglement = null;
    this.selectedMatiereToAdd = null;
    this.observation = null;
    this.selectedDemandeAchat = '';
    this.selectedDepot = ''
    this.selectedDepartement = null
    console.log(" selectedDemandeAchat", this.selectedDemandeAchat)
    this.dateLivraison = ''
  }




  DeleteDemandeAchat(code: any) {
    this.param_achat_service.DeleteDemandeAchat(code).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
        } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );
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
  diss: boolean = false;
  decryptedValue: string = ''; 
  approveDemandeAchat(mode: string) {

    // this.param_achat_service.GetPasswordChangeApprouveAchat().pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     let errorMessage = '';
    //     if (error.error instanceof ErrorEvent) {
    //     } else {
    //       alertifyjs.set('notifier', 'position', 'top-right');
    //       alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );
    //     }
    //     return throwError(errorMessage);
    //   })

    // ).subscribe(
    //   (res: any) => {


          
    const encryptedValue = sessionStorage.getItem('PasswordAnnuleApprouve');
    if (encryptedValue) {
       
      this.decryptedValue = this.encryptionService.decrypt(encryptedValue);
       
    } else {
      this.decryptedValue = 'No value found in session storage';
    }
        if (this.password == this.decryptedValue) {


          this.visbileModalPassword = false;
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
            this.GelMatiereActive();


            this.Getusers();
            this.onRowSelect;
            // this.GelAllModeReglement();

            this.GelAllDepotPrincipal();
            this.GelAllDepartement();
            this.GetColorisActifVisible();
            this.GelUniteActifVisible();
            this.GetDemandeAchatByCode(this.selectedDemandeAchat);
            // this.RemplireDropTaxe();

            // this.GetTypeTaxe();

          } else if (mode === 'CancelApproveModal') {
            contextMenu.setAttribute('data-target', '#ModalApprove');
            this.formHeader = "Modification Validation Demande Achat";
            this.visibleModalApprove = true;
            this.visDelete = false;
            this.visibleNewModal = false;
            this.visibleModalPrint = false;
            this.GelMatiereActive();

            this.Getusers();

            this.onRowSelect;
            // this.GelAllModeReglement();

            this.GelAllDepotPrincipal();
            this.GelAllDepartement();
            this.GetColorisActifVisible();
            this.GelUniteActifVisible();
            this.GetDemandeAchatByCode(this.selectedDemandeAchat);

          }

        } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Password Error");

        }

      // }
    // )





  }

  approveDA(mode: string) {

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
      this.GelMatiereActive();


      this.onRowSelect;
      // this.GelAllModeReglement();

      this.GelAllDepotPrincipal();
      this.GelAllDepartement();
      this.GetColorisActifVisible();
      this.GelUniteActifVisible();
      this.GetDemandeAchatByCode(this.selectedDemandeAchat);
      this.Getusers();

    }
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

      this.visbileModalPassword = false;
      this.visDelete = false;
      this.code == undefined;
      try {
        this.GelMatiereActive();
        // this.GelAllModeReglement();
        this.GelUniteActifVisible();
        this.GetColorisActifVisible();
        // this.GelAllAppelOffreApproved();
        this.GelAllDepotPrincipal();
        // this.RemplireDropTaxe();
        // this.GetTypeTaxe();
        this.GetCodeSaisie();
        this.GelAllDepartement();
        this.Getusers();
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
          this.GelMatiereActive();
          this.Getusers();
          this.onRowSelect;
          this.GelAllDepotPrincipal();
          this.GetColorisActifVisible();
          this.GelUniteActifVisible();
          this.GetDemandeAchatByCode(this.selectedDemandeAchat);
          this.GelAllDepartement();
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
    if (!this.codeSaisie || this.listDataDAWithDetails.length == 0 || !this.observation) {
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Field Required");

    } else {

      for (let y = 0; y < this.listDataDAWithDetails.length; y++) {

        this.GetDataFromTableEditor = {


          codematiere: { code: this.listDataDAWithDetails[y].codeMatieres },
          codeUnite: { code: this.listDataDAWithDetails[y].codeUnites },
          codeColoris: { code: this.listDataDAWithDetails[y].codeColoriss },
          laize:   this.listDataDAWithDetails[y].laize ,
          qteDemander: this.listDataDAWithDetails[y].qteDemander, userCreate: this.userCreate,
        }
        this.final.push(this.GetDataFromTableEditor);




      }
      let body = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        // codeModeReglement: this.selectedModeReglement,
        userCreate: this.userCreate,
        codeFournisseur: null,
        code: this.code,
        actif: this.actif,
        visible: this.visible,
        detailsDemandeAchatDTOs: this.final,
        observation: this.observation,
        codeEtatReception: "2",
        // mntTotalTTC : this.prixTotalTTC,
        // mntTotalHT:this.TotalHTValue,
        // mntTotalTaxe:this.TotalTaxeTmb,
        // codeAppelOffre : this.selectedAppelOffre

        codeDepartement: this.selectedDepartement,
        dateLivraison: this.dateLivraison,
        codeEtatApprouver: this.selectedValue,
        userDemander: this.selectedUsers,
        codeDepot: this.selectedDepot
      }



      if (this.code != null) {
        body['code'] = this.code;
        console.log("Body to Update", body)
        this.param_achat_service.UpdateDemandeAchat(body).pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) {
            } else {
              this.final = new Array<any>();
              alertifyjs.set('notifier', 'position', 'top-right');
              alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

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
      
            this.clearSelected();
            this.visibleNewModal = false;
            this.visibleModalApprove = false;
            this.visbileModalPassword = false;
            this.visibleModalPrint = false;
            this.disBtnDelete = false;

            this.disBtnModif = false;
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
              alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );
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
            // this.visibleModalPrint = true;
            // console.log("res", res);
            // this.codeDemandeAchat = res.code;
            // this.RemplirePrint(this.codeDemandeAchat);
            this.visibleModalPrint = false;

          }
        )



      }
    }





  }



  //aprouve methode

  ApprouveDemandeAchat() {
    if (!this.codeSaisie || this.listDataDAWithDetails.length == 0 || !this.observation) {
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
      if (this.selectedValue == 1) {
        let body = {
          codeSaisie: this.codeSaisie,  
          codeFournisseur: null,
          code: this.code,  
          codeEtatReception: "2", 
          codeUserApprouver: null, 
          codeEtatApprouver: this.selectedValue, 
          dateApprouve: null
        }
  
  
  
        if (this.code != null) {
          body['code'] = this.code;
          console.log("Body to Update", body)
          this.param_achat_service.CancelApprouveDemandeAchat(body).pipe(
            catchError((error: HttpErrorResponse) => {
              let errorMessage = '';
              if (error.error instanceof ErrorEvent) {
              } else {
                this.final = new Array<any>();
                alertifyjs.set('notifier', 'position', 'top-right');
                alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );
  
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
              this.clearSelected();
              this.visibleNewModal = false;
              this.visibleModalApprove = false;
              this.visbileModalPassword = false;
              this.visibleModalPrint = false;
              this.disBtnDelete = false;
  
              this.disBtnModif = false;
            }
          );
        }
      } else {
        let body = {
          codeSaisie: this.codeSaisie,
          designationAr: this.designationAr,
          designationLt: this.designationLt, 
          userCreate: this.userCreate,
          codeFournisseur: null,
          code: this.code,
          actif: this.actif,
          visible: this.visible,
          detailsDemandeAchatDTOs: this.final,
          observation: this.observation,
          codeEtatReception: "2", 
          codeUserApprouver: "20",
          codeDepartement: this.selectedDepartement,
          dateLivraison: this.dateLivraison,
          codeEtatApprouver: this.selectedValue,
          userDemander: this.selectedUsers,
          codeDepot: this.selectedDepot
        }



        if (this.code != null) {
          body['code'] = this.code;
          console.log("Body to Update", body)
          this.param_achat_service.ApprouveDemandeAchat(body).pipe(
            catchError((error: HttpErrorResponse) => {
              let errorMessage = '';
              if (error.error instanceof ErrorEvent) {
              } else {
                this.final = new Array<any>();
                alertifyjs.set('notifier', 'position', 'top-right');
                alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

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
              this.clearSelected();
              this.visibleNewModal = false;
              this.visibleModalApprove = false;
              this.visbileModalPassword = false;
              this.visibleModalPrint = false;
              this.disBtnDelete = false;

              this.disBtnModif = false;
            }
          );
        }
      }


      // else {
      //   console.log("Body to Post", body)

      //   this.param_achat_service.PostDemandeAchatWithDetails(body).pipe(
      //     catchError((error: HttpErrorResponse) => {
      //       let errorMessage = '';
      //       if (error.error instanceof ErrorEvent) { } else {
      //         this.final = new Array<any>();
      //         alertifyjs.set('notifier', 'position', 'top-right');
      //         alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );
      //       }
      //       return throwError(errorMessage);
      //     })
      //   ).subscribe(
      //     (res: any) => {
      //       alertifyjs.set('notifier', 'position', 'top-right');
      //       alertifyjs.success('<i class="success fa fa-chevron-down" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + "Success Saved");
      //       this.visibleNewModal = false;
      //       this.visDelete = false;
      //       this.visibleModalPrint = true;
      //       this.clearForm();
      //       this.ngOnInit();
      //       this.code;
      //       this.final;
      //       this.check_actif = true;
      //       this.check_inactif = false;
      //       this.onRowUnselect(event);
      //       this.clearSelected();
      //       body: { };
      //       this.visibleModalPrint = true;
      //       console.log("res", res);
      //       this.codeDemandeAchat = res.code;
      //       this.RemplirePrint(this.codeDemandeAchat);


      //     }
      //   )



      // }
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


      this.param_achat_service.GetDetailsAppelOffreByCode(this.selectedAppelOffre).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) { } else {
            alertifyjs.set('notifier', 'position', 'top-right');
            alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

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
          this.selectedModeReglement = this.listDataDAWithDetails[y].codeModeReglement
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
          this.tott19 = 0;
          this.tott7 = 0;


        }

        this.calculateThisYearTotal();
        console.log("GetAppelOffreByCode listDataAOWithDetails is ", this.listDataDAWithDetails);

        // this.selectedModeReglement = data.codeModeReglement
      })
    }

  }



  valeurTVA: any;
  remiseEnPourcent: any = 0.0000;
  mntNet: any;
  prixTotalTTC: any = 0.000000;
  TotalHTValue: any = 0.000000;
  totalTax19: any = 0.000000;
  totalTax7: any = 0.000000;
  mntTimbre: any;
  TotalTaxeTmb: any;
  tott19!: number;
  tott7!: number;
  calculateThisYearTotal() {
    let total = 0.000000;
    let mnttotalHT19 = 0.000000;
    let mnttotalHT7 = 0.000000;
    let pxTotTTc = 0.00000;
    for (let sale of this.listDataDAWithDetails) {
      total += +sale.prixTotalHT;
      let mnttaxe = sale.codeTaxe / 100;
      if (sale.codeTaxe == 19) {

        mnttotalHT19 += +sale.prixTotalHT * mnttaxe;
        let valuetx19 = mnttotalHT19;
        this.totalTax19 = valuetx19.toFixed(6)
        this.tott19 = this.totalTax19;
        this.tott7 = this.totalTax7;
      }
      if (sale.codeTaxe == 7) {
        mnttotalHT7 += +sale.prixTotalHT * mnttaxe;

        let valuetx7 = mnttotalHT7;
        this.totalTax7 = valuetx7.toFixed(6)
        this.tott7 = this.totalTax7;
        this.tott19 = this.totalTax19;
      }
      if (sale.codeTaxe == 0) {
        this.tott19 = this.totalTax19;
        this.tott7 = this.totalTax7;
      }


    }



    this.thisYearTotal = total;
    let value2 = this.thisYearTotal;
    this.thisYearTotal = value2.toFixed(6);

    this.TotalHTValue = this.thisYearTotal;


    this.CalculeTaxeTimbre();

    //pxTotTTc.toFixed(6);

  }




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
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.DataTimbre = data;
      // let dttimbre = data.valeur.toFixed(6)
      this.mntTimbre = data.valeur;

      let totTaxTimb = +this.mntTimbre + +this.tott7 + +this.tott19;
      this.TotalTaxeTmb = totTaxTimb.toFixed(6);
      let pxTotTTc = +this.TotalHTValue + +this.TotalTaxeTmb;

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
    // for (let y = 0; y < this.listDataDAWithDetails.length; y++) {

    //   this.GetDataFromTableEditor = {
    //     qteDemander: this.listDataDAWithDetails[y].qteDemander,
    //     prixAchat: this.listDataDAWithDetails[y].prixAchat,
    //     codeTaxe: this.listDataDAWithDetails[y].codeTaxe

    //   }
    //   this.listDataDAWithDetails[y].qteDemander = this.GetDataFromTableEditor.qteDemander;
    //   this.listDataDAWithDetails[y].prixAchat = this.GetDataFromTableEditor.prixAchat;
    //   this.listDataDAWithDetails[y].codeTaxe = this.GetDataFromTableEditor.codeTaxe;
    //   this.listDataDAWithDetails[y].prixTotalHT = this.GetDataFromTableEditor.prixTotalHT;

    //   let qteDemander1 = this.GetDataFromTableEditor.qteDemander;
    //   let prixUniAchat1 = this.GetDataFromTableEditor.prixAchat;
    //   let valeurtaxe = this.GetDataFromTableEditor.codeTaxe / 100;

    //   let pxtotal = qteDemander1 * prixUniAchat1;
    //   let valeurTaxe1 = valeurtaxe * pxtotal;
    //   let valeurTotalTTC = pxtotal + +valeurTaxe1 
    //   this.listDataDAWithDetails[y].prixTotTTC = valeurTotalTTC.toFixed(6); 
    //   this.listDataDAWithDetails[y].prixTotalHT = pxtotal.toFixed(6);

    // }
    // this.calculateThisYearTotal();
  }




  compteur: number = 0;
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



  VoidsNew(): void {
    this.articles = [

    ].sort((car1, car2) => {
      return 0;
    });

  }

  banque: any;


  // dataModeReglement = new Array<ModeReglement>();
  // listModeReglementPushed = new Array<any>();
  // listModeReglementRslt = new Array<any>();
  // GelAllModeReglement() {
  //   this.param_achat_service.GetAllModeReglement().pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       let errorMessage = '';
  //       if (error.error instanceof ErrorEvent) { } else {
  //         alertifyjs.set('notifier', 'position', 'top-right');
  //         alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

  //       }
  //       return throwError(errorMessage);
  //     })

  //   ).subscribe((data: any) => {
  //     this.dataModeReglement = data;
  //     this.listModeReglementPushed = [];
  //     for (let i = 0; i < this.dataModeReglement.length; i++) {
  //       this.listModeReglementPushed.push({ label: this.dataModeReglement[i].designationAr, value: this.dataModeReglement[i].code })
  //     }
  //     this.listModeReglementRslt = this.listModeReglementPushed;
  //   })
  // }


  // dataAppelOffre = new Array<AppelOffre>();
  // listAppelOffrePushed = new Array<any>();
  // listAppelOffreRslt = new Array<any>();
  // GelAllAppelOffreApproved() {
  //   this.param_achat_service.GetAppelOffreByEtatApprouved(2).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       let errorMessage = '';
  //       if (error.error instanceof ErrorEvent) { } else {
  //         alertifyjs.set('notifier', 'position', 'top-right');
  //         alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

  //       }
  //       return throwError(errorMessage);
  //     })

  //   ).subscribe((data: any) => {
  //     this.dataAppelOffre = data;
  //     this.listAppelOffrePushed = [];
  //     for (let i = 0; i < this.dataAppelOffre.length; i++) {
  //       this.listAppelOffrePushed.push({ label: this.dataAppelOffre[i].designationAr, value: this.dataAppelOffre[i].code })
  //     }
  //     this.listAppelOffreRslt = this.listAppelOffrePushed;

  //   })
  // }



  dataMatiere = new Array<Matiere>();
  listMatierePushed = new Array<any>();
  listMatiereRslt = new Array<any>();
  GelMatiereActive() {
    this.param_achat_service.GetMatiereActive().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

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
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );
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
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );
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
    // console.log("this.listDataDAWithDetails for TAxe: ", this.listDataDAWithDetails);
    // for (let y = 0; y < this.listDataDAWithDetails.length; y++) {

    //   this.GetDataFromTableEditor = {
    //     qteDemander: this.listDataDAWithDetails[y].qteDemander,
    //     prixAchat: this.listDataDAWithDetails[y].prixAchat
    //   }

    //   let qteDemander1 = this.GetDataFromTableEditor.qteDemander;
    //   let prixUniAchat1 = this.GetDataFromTableEditor.prixAchat;
    //   let pxtotal = qteDemander1 * prixUniAchat1;

    //   console.log("pxtotal : ", pxtotal, "prixUniAchat1",
    //     prixUniAchat1, "qteDemander1", qteDemander1)

    //   this.listDataDAWithDetails[y].prixTotTTC += pxtotal

    // }

  }



  // lastYearTotal!: number;


  thisYearTotal!: any;
  // hethi 
  GetDemandeAchatByCode(code: number) {

    this.param_achat_service.GetDetailsDemandeAchatByCode(this.code).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.listDataDAWithDetails = new Array<any>();

      this.listDataDAWithDetails = data;
      // this.GelAllAppelOffreApproved();
      // this.GelAllModeReglement();
      console.log("GetDemandeAchatByCode listDataDAWithDetails is ", this.listDataDAWithDetails);

      let x = this.listDataDAWithDetails
      this.selectedAppelOffre = x[0].codeAppelOffre;
      this.selectedModeReglement = x[0].codeModeReglement;
      this.ValueQteChanged();

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
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

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
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

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
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );
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


  DataDepartement = new Array<Departement>();
  ListDepartementPushed = new Array;
  RsltDepartement = new Array<any>();
  selectedDepartement: any
  GelAllDepartement() {
    this.param_achat_service.GetDepartement().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.DataDepartement = data;
      this.ListDepartementPushed = [];
      for (let i = 0; i < this.DataDepartement.length; i++) {
        this.ListDepartementPushed.push({ label: this.DataDepartement[i].designationAr, value: this.DataDepartement[i].code })
      }
      this.RsltDepartement = this.ListDepartementPushed;
    })

  }

  EtatApprouve!: any[];
  EtatDde!: any[];
  selectedEtatApprouve: any;
  getValued() {
    this.EtatApprouve = [
      { name: 'EnCours', code: '1', url: 'assets/assets/images/etat_RCPPartiel.png' },
      { name: 'Refuser', code: '3', url: 'assets/assets/images/etat_NRCP.png' },
      { name: 'Valider', code: '2', url: 'assets/assets/images/etat_RCTotal.png' },
    ];
  }
  dataDemandeAchat = new Array<DemandeAchat>();
  GetCodeEtatApprouver() {
    if (this.selectedEtatApprouve == undefined) {

    } else {
      this.param_achat_service.GetDemandeAchatByEtatApprouved(this.selectedEtatApprouve.code).pipe(
        catchError((error: HttpErrorResponse) => {

          let errorMessage = '';
          if (error.error instanceof ErrorEvent) { } else {
            alertifyjs.set('notifier', 'position', 'top-right');
            alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

          }
          return throwError(errorMessage);
        })

      ).subscribe((data: any) => {



        this.dataDemandeAchat = data;

      })

    }
  }

  VisBtnPrintDA: boolean = false;
  VisBtnDeleteDA: boolean = true;
  disBtnModif: boolean = false;
  disBtnDelete: boolean = false;
  disBtnValider: boolean = false;
  dateLivraison: any;
  transformDateFormat() {
    this.dateLivraison = this.datePipe.transform(this.dateLivraison, "yyyy-MM-dd")

    console.log("  transformDateFormat  this.dateLivraison", this.dateLivraison)
  };

  // users =new Array<City>(); 
  // selectedUsers: any;

  users!: City[];

  var!: any;
  // selectedUsers: any;
  selectedUsers!: any;
  // arsenal: City = { code: '', name: '' };


  onchangedSelected() {

    console.log(this.var = JSON.stringify(this.selectedUsers)); // this.selectedUsers);


  }
  DataUser = new Array<User>();
  listUserPushed = new Array<any>();
  listUserRslt = new Array<any>();
  Getusers() {
    this.param_achat_service.GetUser().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );
        }
        return throwError(errorMessage);
      })
    ).subscribe((data: any) => {
      this.DataUser = data;
      this.listUserPushed = [];
      for (let i = 0; i < this.DataUser.length; i++) {
        this.listUserPushed.push({ label: this.DataUser[i].nomCompletUser, value: this.DataUser[i].userName })
      }
      this.listUserRslt = this.listUserPushed;
    })


  }
}


