

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { catchError, throwError, timeout, of } from 'rxjs';
import { Table } from 'primeng/table';

import * as alertifyjs from 'alertifyjs'
import { Banque, ModeReglement, TypeCaisse } from '../../domaine/ParametrageCentral';
import { ParametrageCentralService } from '../ParametrageCentralService/parametrage-central.service';

declare const PDFObject: any;

@Component({
  selector: 'app-mode-reglement',
  templateUrl: './mode-reglement.component.html',

  styleUrl: './mode-reglement.component.css', providers: [ConfirmationService, MessageService]
})
export class ModeReglementComponent implements OnInit {

  bioSection = new FormGroup({
    firstName: new FormControl<string>('', [
      Validators.minLength(3),
      Validators.required
    ]),
    lastName: new FormControl<string>('')
  });
  openModal!: boolean;


  constructor(private confirmationService: ConfirmationService, private param_achat_service: ParametrageCentralService, private messageService: MessageService, private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {


  }

  myDefaultValue = 'Soff';

  // sourceProducts!: Article[];

  // cities!: Article[];
  // qte!: number;
  // xx!: any[];
  // targetProducts!: Article[];
  // selectedValue!: string;
  // article2!: Article[];

  // viewValue!: string;
  // rows: any = [
  // ]

  // index!: number;
  // countries!: any[];
  // formGroup: FormGroup | undefined;

  // // products!: Article[];


  // selectedCity: any;
  // clonedProducts: { [s: string]: Article } = {};
  // colsAdd!: any[];

  pdfData!: Blob;
  isLoading = false;
  ngOnInit(): void {

    this.GelAllModeReglementActif();
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


  // desig: string = 'AR'
  // FormControl = new Array<FormControl>();
  // GetFormName(): void {
  //   this.param_achat_service.GetFormControlName(this.desig).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       let errorMessage = '';
  //       if (error.error instanceof ErrorEvent) {
  //       } else {
  //         alertifyjs.set('notifier', 'position', 'top-right');
  //         alertifyjs.error(` ${error.error.description}` );
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
    this.selectedBanque = '';
    this.selectedTypeCaisse = ''
    this.listTypeCaisseRslt = [];
    this.ListBQRslt = [];


  }
  check_actif = false;
  check_inactif = false;

  formHeader = ".....";
  // data: any = null;
  searchTerm = '';
  visibleModal: boolean = false;
  visibleModalPrint: boolean = false;
  visDelete: boolean = false;
  code!: number | null;
  codeSaisie: any;

  // @Input('myInput')
  // get myInput(): any {
  //   return this.codeSaisie;
  // }
  // set myInput(value: any) {
  //   this.codeSaisie = value || "NULL";
  // }


  designationAr: string = 'NULL';
  designationLt: string = "NULL";
  codeTypeCaisse: number = 0;
  codeBanque: string = "NULL";
  actif!: boolean;
  visible!: boolean;

  selectedModeReglement!: ModeReglement;
  // selectedddeAchat2!: DDE_ACHAT;
  selectedCar!: string;
  onRowSelect(event: any) {
    this.code = event.data.code;
    this.actif = event.data.actif;
    this.visible = event.data.visible;
    this.codeSaisie = event.data.codeSaisie;
    this.designationAr = event.data.designationAr;
    this.designationLt = event.data.designationLt;
    this.selectedTypeCaisse = event.data.codeTypeCaisse;
    this.selectedBanque = event.data.codeBanque;

    console.log('vtData : ', event);
  }
  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
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
  //     //       alertifyjs.error(` ${error.error.description}` );

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
  //             alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + `${error.error.description}` + " Parametrage Failed");
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
  //             alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + `${error.error.description}` + " Parametrage Failed");
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
  //             alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + `${error.error.description}` + " Parametrage Failed");
  //           }
  //           return throwError(errorMessage);
  //         })
  //     )
  //       .subscribe((data: any) => {
  //         this.RegionHonoraire = data;
  //       })
  //   }




  DeleteModeReglement(code: any) {
    this.param_achat_service.DeleteModeReglement(code).pipe(
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
      (res) => {
        alertifyjs.set('notifier', 'position', 'top-right');
        alertifyjs.success("Success Deleted");
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
    // this.codeFilialle = [];
  }
  // videtable ():void{
  //    document.getElementById('main-container').reset();

  // }
  public onOpenModal(mode: string) {
    // this.showForm = true;
    // 


    this.visibleModal = false;
    this.visDelete = false;
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#Modal');
      this.formHeader = "Nouveau Mode Reglemnt"
      // this.codeSaisie = this.compteurs;
      this.onRowUnselect(event);
      // this.code ==null;
      this.clearSelected();
      this.actif = false;
      this.visibleModal = true;
      this.code == undefined;
      // this.codeFilialle = [];
      this.GelAllBanque();
      this.GelTypeCaisse();

    }
    if (mode === 'edit') {


      if (this.code == undefined) {
        // alert("Choise A row Please");

        //  
        this.onRowUnselect(event);
        alertifyjs.set('notifier', 'position', 'top-right');
        alertifyjs.error("Choise A row Please");
        this.visDelete == false && this.visibleModal == false
      } else {

        button.setAttribute('data-target', '#Modal');
        this.formHeader = "Edit Mode Reglement"
        // this.GetDesignationFL();
        // this.GetDesignationFLSelected(this.codeFilialle);
        // this.GetDesignationAdress();
        this.visibleModal = true;
        this.onRowSelect;
        this.GelAllBanque();
        this.GelTypeCaisse();

      }

      // }
      // }

    }
    // if (mode === 'delete') {
    //   button.setAttribute('data-target', '#deletePL');
    // }
    // if (mode === 'Voir') {
    //   button.setAttribute('data-target', '#voirPL');
    //   this.formHeader = "عرض فرع "

    // }

    if (mode === 'Delete') {

      if (this.code == undefined) {
        // alert("Choise A row Please");

        // 
        this.onRowUnselect;
        alertifyjs.set('notifier', 'position', 'top-right');
        alertifyjs.error("Choise A row Please");
        this.visDelete == false && this.visibleModal == false
      } else {

        {
          button.setAttribute('data-target', '#ModalDelete');
          this.formHeader = "Delete Mode Reglement"
          this.visDelete = true;

        }
      }

    }

    if (mode === 'Print') {

    
      button.setAttribute('data-target', '#ModalPrint');
      this.formHeader = "Imprimer Liste Reglement"
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
  PostModeReglement() {
    // let form= this.formatDate.valeur;
    // this.datecreate = new Date();
    // let x=('0' + new Date().getDate()).slice(-2) + '/' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '/' + new Date().getFullYear()+'T'+this.ajusterHourAndMinutes();
    // let x=new Date().getFullYear()+'/' +('0' + (new Date().getMonth() + 1)).slice(-2) + '/' + ('0' + new Date().getDate()).slice(-2)  + 'T'+ ('0' + new Date().getHours()).slice(-2) +':'+ ('0' + new Date().getMinutes()).slice(-2) +':'+('0' + new Date().getSeconds()).slice(-2) +':'+ ('0' + new Date().getMilliseconds()).slice(-2)+':'+ ('0' + new Date().getTimezoneOffset()).slice(-2) ;
    // let y = formatDate(new Date(),format('YYYY-MM-DD h:mm:ss'))
    // let y = 

    // if (this.designationAr ==null) throw   new   


    // ;

    if (!this.designationAr || !this.designationLt) {
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Field Required");

    } else {


      let body = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        codeTypeCaisse: this.selectedTypeCaisse,
        codeBanque: this.selectedBanque,
        userCreate: this.userCreate,

        dateCreate: new Date().toISOString(), //
        code: this.code,
        actif: this.actif,
        visible: this.visible,

      }
      if (this.code != null) {
        body['code'] = this.code;

        this.param_achat_service.UpdateModeReglement(body).pipe(
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
        this.param_achat_service.PostModeReglement(body).pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) { } else {
              alertifyjs.set('notifier', 'position', 'top-right');
              alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

            }
            return throwError(errorMessage);
          })
        ).subscribe(
          (res) => {
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
  onRowEditInit(car: ModeReglement) {
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








  selectedBanque: any;
  selectedTypeCaisse: any;
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
  cars!: Array<ModeReglement>;
  brands!: SelectItem[];
  clonedCars: { [s: string]: ModeReglement } = {};
  // NewDate = new Date();
  codeModeReglementDde: {}[] = [];
  dataModeReglementDde = new Array<ModeReglement>();
  banque: any;
  // listModeReglementRslt = new Array<any>();
  // listModeReglementPushed = new Array<any>();
  GelAllModeReglementActif() {
    this.param_achat_service.GetAllModeReglement().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {



      this.dataModeReglementDde = data;
      this.onRowUnselect(event);
      // this.listModeReglementPushed = [];
      // for (let i = 0; i < this.dataModeReglementDde.length; i++) {
      //   this.listModeReglementPushed.push({ label: this.dataModeReglementDde[i].designationAr, value: this.dataModeReglementDde[i].code })
      // }
      // this.listModeReglementRslt = this.listModeReglementPushed;
    })
    // })
  }


  /////////////////////////////////////////////////////////// new dev


  dataTypeCaisseDde = new Array<TypeCaisse>();
  listTypeCaissePushed = new Array<any>();
  listTypeCaisseRslt = new Array<any>();
  GelTypeCaisse() {
    this.param_achat_service.GetAllTypeCaisse().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {
      this.dataTypeCaisseDde = data;
      this.listTypeCaissePushed = [];
      for (let i = 0; i < this.dataTypeCaisseDde.length; i++) {
        this.listTypeCaissePushed.push({ label: this.dataTypeCaisseDde[i].designationAr, value: this.dataTypeCaisseDde[i].code })
      }
      this.listTypeCaisseRslt = this.listTypeCaissePushed;
    })
    // })
  }

  ListBanqueData = new Array<any>();
  ListBQPushed = new Array;
  ListBQRslt = new Array<any>();
  GelAllBanque() {
    this.param_achat_service.GetAllBanque().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}` );

        }
        return throwError(errorMessage);
      })

    ).subscribe((datas: any) => {
      this.ListBanqueData = datas;
      this.ListBQPushed = [];
      for (let i = 0; i < this.ListBanqueData.length; i++) {
        this.ListBQPushed.push({ label: this.ListBanqueData[i].designationAr, value: this.ListBanqueData[i].code })
      }
      this.ListBQRslt = this.ListBQPushed;
    })

  }


  // printInvoice() {
  //   this.param_achat_service.findPendingInwardsPdf().subscribe((response) => {

  //     const file = new Blob([response], { type: 'application/pdf' });
  //     const fileURL = URL.createObjectURL(file);
  //     window.open(fileURL);
  //   });
  // }

  serviceUrl!: string;
  reportServerUrl!: string;
  reportPath!: string;
  serverServiceAuthorizationToken!: string;


}




