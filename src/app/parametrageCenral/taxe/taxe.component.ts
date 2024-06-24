

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { catchError, throwError, timeout, of } from 'rxjs';
import { Table } from 'primeng/table';

import * as alertifyjs from 'alertifyjs'
import { Banque, ModeReglement, Taxe, TypeCaisse, TypeTaxe } from '../domaine/ParametrageCentral';
import { ParametrageCentralService } from '../ParametrageCentralService/parametrage-central.service';

declare const PDFObject: any;

@Component({
  selector: 'app-taxe',
  templateUrl: './taxe.component.html',
  styleUrl: './taxe.component.css', providers: [ConfirmationService, MessageService]
})
export class TaxeComponent {

  openModal!: boolean;


  constructor(private confirmationService: ConfirmationService, private param_achat_service: ParametrageCentralService, private messageService: MessageService, private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {


  }
  pdfData!: Blob;
  isLoading = false;
  ngOnInit(): void {

    this.GelAllTaxe();
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
    this.visible = false;
    this.codeSaisie = '';
    this.onRowUnselect(event);
    this.selectedTypeTaxe = '';

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
  visible!: boolean;
  ValeurTaxe! : number ;
  selectedTaxe!: Taxe;


  onRowSelect(event: any) {
    this.code = event.data.code;
    this.actif = event.data.actif;
    this.visible = event.data.visible;
    this.codeSaisie = event.data.codeSaisie;
    this.designationAr = event.data.designationAr;
    this.designationLt = event.data.designationLt;

    console.log('vtData : ', event);
  }
  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
  }



  DeleteColoris(code: any) {
    this.param_achat_service.DeleteColoris(code).pipe(
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
    this.selectedTypeTaxe = '';
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
      this.formHeader = "Nouveau Taxe"
      this.onRowUnselect(event);
      this.clearSelected();
      this.GelAllTypeTaxe();

      this.actif = false;
      this.visible = false;
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
        this.formHeader = "Edit Taxe"

        this.dis = true;
        this.visibleModal = true;
        this.onRowSelect;
        this.GelAllTypeTaxe();

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
          this.formHeader = "Delete Taxe"
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
  
  PostTaxe() {
    
    if (!this.designationAr || !this.designationLt || !this.codeSaisie || !this.selectedTypeTaxe || !this.ValeurTaxe) {
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Field Required");

    } else {


      let body = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        userCreate: this.userCreate,
        codeTypeTaxe: this.selectedTypeTaxe,
        dateCreate: new Date().toISOString(), //
        code: this.code,
        actif: this.actif,
        visible: this.visible,
        valeurTaxe: this.ValeurTaxe

      }
      if (this.code != null) {
        body['code'] = this.code;

        this.param_achat_service.UpdateTaxe(body).pipe(
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
        this.param_achat_service.PostTaxe(body).pipe(
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

  taxes!: Array<Taxe>;
  Voids(): void {
    this.taxes = [

    ].sort((car1, car2) => {
      return 0;
    });

  }
  // onRowEditInit(car: Matiere) {
  //   this.clonedCars[car.code_saisie] = { ...car };
  // }


  public remove(index: number): void {
    this.listDesig.splice(index, 1);
    console.log(index);
  }
  // onRowEditSave(car: ModeReglement) {
  //   delete this.clonedCars[car.code_saisie];
  // }

  // onRowEditCancel(car: ModeReglement, index: number) {
  //   this.cars[index] = this.clonedCars[car.code_saisie];
  //   delete this.clonedCars[car.code_saisie];
  // }








  // selectedBanque: any;
  // selectedTypeMatiere: any;
  compteur: number = 0;
  listDesig = new Array<any>();

  // cars!: Array<Matiere>;
  // brands!: SelectItem[];
  // clonedCars: { [s: string]: Matiere } = {};
  // NewDate = new Date();
  // codeModeReglementDde: {}[] = [];
  dataTaxe = new Array<Taxe>();
  banque: any;
  GelAllTaxe() {
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



      this.dataTaxe = data;
      this.onRowUnselect(event);

    })
  }

  DataTypeTaxe = new Array<TypeTaxe>();
  ListTypeTaxePushed = new Array;
  RsltTypeTaxe = new Array<any>();
  selectedTypeTaxe: any
  GelAllTypeTaxe() {
    this.param_achat_service.GetTypeTaxe().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

        }
        return throwError(errorMessage);
      })

    ).subscribe((datas: any) => {
      this.DataTypeTaxe = datas;
      this.ListTypeTaxePushed = [];
      for (let i = 0; i < this.DataTypeTaxe.length; i++) {
        this.ListTypeTaxePushed.push({ label: this.DataTypeTaxe[i].designation, value: this.DataTypeTaxe[i].code })
      }
      this.RsltTypeTaxe = this.ListTypeTaxePushed;
    })

  }


}


