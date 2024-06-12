import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component,  ChangeDetectorRef } from '@angular/core';
import {   FormBuilder  } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { catchError, throwError  } from 'rxjs';
import { Table } from 'primeng/table';

import * as alertifyjs from 'alertifyjs'  
import { Coloris, Matiere, ModeReglement, TypeCaisse } from 'src/app/parametrageCenral/domaine/ParametrageCentral';
import { ParametrageCentralService } from 'src/app/parametrageCenral/ParametrageCentralService/parametrage-central.service';



declare const PDFObject: any;
@Component({
  selector: 'app-coloris',
  templateUrl: './coloris.component.html',
  styleUrl: './coloris.component.css', providers: [ConfirmationService, MessageService]
})
export class ColorisComponent {

  openModal!: boolean;


  constructor(private confirmationService: ConfirmationService, private param_achat_service: ParametrageCentralService, private messageService: MessageService, private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {


  }  
  pdfData!: Blob;
  isLoading = false;
  ngOnInit(): void {

    this.GelAllColoris();
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
  
  selectedColoris!: Coloris; 


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
    this.visible = false; 
  }
 
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
      this.formHeader = "Nouveau Coloris" 
      this.onRowUnselect(event); 
      this.clearSelected();
      this.actif = false;
      this.visible = false;
      this.visibleModal = true;
      this.code == undefined;  

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
        this.formHeader = "Edit Coloris"
        let el = <HTMLInputElement>document.getElementById('codeSaisie');
      if (el != null) {
        el.disabled = true;
      }
        this.visibleModal = true;
        this.onRowSelect;

      }

    }

    if (mode === 'Delete') {

      if (this.code == undefined) {
        this.onRowUnselect;
        alertifyjs.set('notifier', 'position', 'top-right'); 
        alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>'  + " Choise A row Please");

        this.visDelete == false && this.visibleModal == false
      } else {

        {
          button.setAttribute('data-target', '#ModalDelete');
          this.formHeader = "Delete Coloris"
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
  PostColoris() {
    // let form= this.formatDate.valeur;
    // this.datecreate = new Date();
    // let x=('0' + new Date().getDate()).slice(-2) + '/' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '/' + new Date().getFullYear()+'T'+this.ajusterHourAndMinutes();
    // let x=new Date().getFullYear()+'/' +('0' + (new Date().getMonth() + 1)).slice(-2) + '/' + ('0' + new Date().getDate()).slice(-2)  + 'T'+ ('0' + new Date().getHours()).slice(-2) +':'+ ('0' + new Date().getMinutes()).slice(-2) +':'+('0' + new Date().getSeconds()).slice(-2) +':'+ ('0' + new Date().getMilliseconds()).slice(-2)+':'+ ('0' + new Date().getTimezoneOffset()).slice(-2) ;
    // let y = formatDate(new Date(),format('YYYY-MM-DD h:mm:ss'))
    // let y = 

    // if (this.designationAr ==null) throw   new   


    // ;

    if (!this.designationAr || !this.designationLt || !this.codeSaisie) {
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
        visible: this.visible,

      }
      if (this.code != null) {
        body['code'] = this.code;

        this.param_achat_service.UpdateColoris(body).pipe(
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
        this.param_achat_service.PostColoris(body).pipe(
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
    this.cars = [

    ].sort((car1, car2) => {
      return 0;
    });

  }
  onRowEditInit(car: Matiere) {
    this.clonedCars[car.code_saisie] = { ...car };
  }


  public remove(index: number): void {
    this.listDesig.splice(index, 1);
    console.log(index);
  }
  onRowEditSave(car: ModeReglement) {
    delete this.clonedCars[car.code_saisie];
  }

  onRowEditCancel(car: ModeReglement, index: number) {
    this.cars[index] = this.clonedCars[car.code_saisie];
    delete this.clonedCars[car.code_saisie];
  }








  // selectedBanque: any;
  // selectedTypeMatiere: any;
  compteur: number = 0;
  listDesig = new Array<any>();
  // OnBlur() {
  //   var exist = false;
  //   for (var y = 0; y < this.cars.length; y++) {
  //     if (this.selectedBanque.code != this.cars[y].code) {
  //       exist = false;
  //     } else {
  //       exist = true;
  //       break;
  //     }
  //   }
  //   if ((this.selectedBanque != undefined) && (this.selectedBanque != "") && (!exist)) {
  //     this.param_achat_service.GetArticleBycode(this.selectedBanque).subscribe((data: any) => {
  //       this.cars[this.compteur] = data;
  //       this.compteur = this.compteur + 1;
  //       this.listDesig.push(data);
  //     })
  //   }
  // }
  // clickDropDownUp(dropDownModUp: any) {
  //   if ((dropDownModUp.documentClickListener !== undefined && dropDownModUp.selectedOption !== null && dropDownModUp.itemClick) || dropDownModUp.itemClick) {
  //     dropDownModUp.focus();
  //     if (!dropDownModUp.overlayVisible) {
  //       dropDownModUp.show();
  //       event!.preventDefault();
  //     } else {
  //       dropDownModUp.hide();
  //       event!.preventDefault();
  //     }
  //   }
  // }
  cars!: Array<Matiere>;
  brands!: SelectItem[];
  clonedCars: { [s: string]: Matiere } = {};
  // NewDate = new Date();
  // codeModeReglementDde: {}[] = [];
  dataColoris = new Array<Coloris>();
  banque: any;
  // listModeReglementRslt = new Array<any>();
  // listModeReglementPushed = new Array<any>();
  GelAllColoris() {
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



      this.dataColoris = data;
      this.onRowUnselect(event);
 
    }) 
  }


  /////////////////////////////////////////////////////////// new dev



  

}


