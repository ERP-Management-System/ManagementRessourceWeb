

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { catchError, throwError, timeout, of } from 'rxjs';
import { Table } from 'primeng/table';

import * as alertifyjs from 'alertifyjs'
import { CategorieDepot, Departement, Depot } from 'src/app/parametrageCenral/domaine/ParametrageCentral';
import { ParametrageCentralService } from 'src/app/parametrageCenral/ParametrageCentralService/parametrage-central.service';

declare const PDFObject: any;

@Component({
  selector: 'app-depot',
  templateUrl: './depot.component.html',
  styleUrl: './depot.component.css', providers: [ConfirmationService, MessageService]
})
export class DepotComponent {


  openModal!: boolean;


  constructor(private confirmationService: ConfirmationService, private param_achat_service: ParametrageCentralService, private messageService: MessageService, private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {


  }
  pdfData!: Blob;
  isLoading = false;
  ngOnInit(): void {

    this.GelAllDepot();
    this.Voids();





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


  clear(table: Table) {
    table.clear();
    this.searchTerm = '';
  }

  clearForm() {
    this.code == undefined;
    this.designationAr = '';
    this.designationLt = '';
    this.actif = false;
    this.codeSaisie = '';
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
  designationAr: string = 'NULL';
  designationLt: string = "NULL";
  actif!: boolean;
  isPrincipal!: boolean;
  selectedDepot!: Depot;


  onRowSelect(event: any) {
    this.code = event.data.code;
    this.actif = event.data.actif;
    this.isPrincipal = event.data.principal;
    this.codeSaisie = event.data.codeSaisie;
    this.designationAr = event.data.designationAr;
    this.designationLt = event.data.designationLt;
    this.selectedCategorieDepot = event.data.codeCategorieDepot;
    this.selectedDepartement = event.data.codeDepartement;
    console.log('vtData : ', event);
  }
  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
  }



  DeleteDepot(code: any) {
    this.param_achat_service.DeleteDepot(code).pipe(
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
    this.isPrincipal = false;
    this.selectedCategorieDepot='';
    this.selectedDepartement=''
  }

  dis: boolean = false;
  public onOpenModal(mode: string) {

    this.visibleModal = false;
    this.visDelete = false;
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#Modal');
      this.formHeader = "Nouveau Depot"
      this.onRowUnselect(event);
      this.clearSelected();
      this.GelAllCategorieDepot();
      this.GelAllDepartement();
      this.actif = false;
      this.isPrincipal = false;
      this.visibleModal = true;
      this.code == undefined;
      this.dis = false;

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
        this.formHeader = "Edit Depot"

        this.GelAllDepartement();
        this.GelAllCategorieDepot();
        this.dis = true;
        this.visibleModal = true;
        this.onRowSelect;

      }

    }

    if (mode === 'Delete') {

      if (this.code == undefined) {
        this.onRowUnselect;
        alertifyjs.set('notifier', 'position', 'top-right');
        alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Choise A row Please");

        this.visDelete == false && this.visibleModal == false
      } else {

        {
          button.setAttribute('data-target', '#ModalDelete');
          this.formHeader = "Delete Depot"
          this.visDelete = true;

        }
      }

    }

    if (mode === 'Print') {


      button.setAttribute('data-target', '#ModalPrint');
      this.formHeader = "Imprimer Liste Coloris"
      this.visibleModalPrint = true;
      this.RemplirePrint();


    }

  }


  userCreate = "soufien";

  PostDepot() {

    if (!this.designationAr || !this.designationLt || !this.codeSaisie || !this.selectedCategorieDepot) {
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Field Required");

    } else {


      let body = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        userCreate: this.userCreate,
        dateCreate: new Date().toISOString(), //
        code: this.code,
        actif: this.actif,
        principal: this.isPrincipal,
        codeCategorieDepot: this.selectedCategorieDepot,
        codeDepartement: this.selectedDepartement

      }
      if (this.code != null) {
        body['code'] = this.code;

        this.param_achat_service.UpdateDepot(body).pipe(
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
        this.param_achat_service.PostDepot(body).pipe(
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

  Depots!: Array<Depot>;
  Voids(): void {
    this.Depots = [

    ].sort((car1, car2) => {
      return 0;
    });

  }


  public remove(index: number): void {
    this.listDesig.splice(index, 1);
    console.log(index);
  }
  compteur: number = 0;
  listDesig = new Array<any>();

  dataDepot = new Array<Depot>();
  banque: any;
  GelAllDepot() {
    this.param_achat_service.GetDepot().pipe(
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
      this.onRowUnselect(event);

    })
  }



  DataCategorieDepot = new Array<CategorieDepot>();
  ListCategorieDepotPushed = new Array;
  RsltCategorieDepot = new Array<any>();
  selectedCategorieDepot: any
  GelAllCategorieDepot() {
    this.param_achat_service.GetCategorieDepot().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

        }
        return throwError(errorMessage);
      })

    ).subscribe((datas: any) => {
      this.DataCategorieDepot = datas;
      this.ListCategorieDepotPushed = [];
      for (let i = 0; i < this.DataCategorieDepot.length; i++) {
        this.ListCategorieDepotPushed.push({ label: this.DataCategorieDepot[i].designationAr, value: this.DataCategorieDepot[i].code })
      }
      this.RsltCategorieDepot = this.ListCategorieDepotPushed;
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
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

        }
        return throwError(errorMessage);
      })

    ).subscribe((datas: any) => {
      this.DataDepartement = datas;
      this.ListDepartementPushed = [];
      for (let i = 0; i < this.DataDepartement.length; i++) {
        this.ListDepartementPushed.push({ label: this.DataDepartement[i].designationAr, value: this.DataDepartement[i].code })
      }
      this.RsltDepartement = this.ListDepartementPushed;
    })

  }
}

