
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { catchError, throwError, timeout, of } from 'rxjs';
import { Table } from 'primeng/table';
import { DomSanitizer } from '@angular/platform-browser';
import * as alertifyjs from 'alertifyjs'
import { Departement, User } from 'src/app/domaine/ParametrageCentral';
import { ParametrageCentralService } from 'src/app/parametrageCenral/ParametrageCentralService/parametrage-central.service';

declare const PDFObject: any;
@Component({
  selector: 'app-signature-user',
  templateUrl: './signature-user.component.html',
  styleUrl: './signature-user.component.css', providers: [ConfirmationService, MessageService]
})
export class SignatureUserComponent {


  openModal!: boolean;


  constructor(private _sanitizer: DomSanitizer, private confirmationService: ConfirmationService, private param_achat_service: ParametrageCentralService, private messageService: MessageService, private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {


  }
  pdfData!: Blob;
  isLoading = false;
  ngOnInit(): void {

    this.GelAllUser();
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
    this.userName = '';
    this.password = '';
    this.actif = false;
    this.nomCompletUser = '';
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
  userName: any;
  password!: string;
  actif!: boolean;
  nomCompletUser!: string;
  signature!: any;

  selectedUser: any;

  onRowSelect(event: any) {
    this.code = event.data.code;
    this.actif = event.data.actif;
    this.userName = event.data.userName;
    this.password = event.data.password;
    this.nomCompletUser = event.data.nomCompletUser;
    this.signature = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
      + event.data.signature);

    // this.signature = event.data.sig;
    console.log('vtData : ', event);
  }
  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
  }

  removeWhitespaceUsingReplaceMethod() {
    let inputString: string = this.userName;
    let outputString: string = inputString
        .split("")
        .filter((char) => char !== " ")
        .join("");  
    this.userName = outputString; 
  }

  DeleteUser(code: any) {
    this.param_achat_service.DeleteUser(code).pipe(
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
    this.userName = '';
    this.password = '';
    this.nomCompletUser = '';
    this.signature = '';
    this.actif = false;
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
      this.formHeader = "Nouveau User"
      this.onRowUnselect(event);
      this.clearSelected();

      this.actif = false;
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
        this.formHeader = "Edit User"

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
          this.formHeader = "Delete User"
          this.visDelete = true;

        }
      }

    }

    if (mode === 'Print') {


      button.setAttribute('data-target', '#ModalPrint');
      this.formHeader = "Imprimer List Users"
      this.visibleModalPrint = true;
      this.RemplirePrint();


    }

  }


  userCreate = "soufien";
  fileReaderRst!: string;
  defaultSignature = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
  PostUser(event: any) {

    if (!this.userName || !this.password || !this.nomCompletUser) {
      alertifyjs.set('notifier', 'position', 'top-right');
      alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + " Field Required");

    } else {
      if(this.fileReaderRst == null){
        this.fileReaderRst = this.defaultSignature
      }else{

      }

      let body = {
        userName: this.userName,
        password: this.password,
        actif: this.actif,
        userCreate: this.userCreate,
        nomCompletUser: this.nomCompletUser,
        dateCreate: new Date().toISOString(), //
        code: this.code,
        
        sig: this.fileReaderRst,


      }
      // console.log("body to update", body);
      if (this.code != null) {
        body['code'] = this.code;

        this.param_achat_service.UpdateUser(body).pipe(
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
        // console.log("body to post", body);
        this.param_achat_service.PostUser(body).pipe(
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

  departements!: Array<Departement>;
  Voids(): void {
    this.departements = [

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

  dataUser = new Array<User>();
  banque: any;
  GelAllUser() {
    this.param_achat_service.GetUserWithPassword().pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { } else {
          alertifyjs.set('notifier', 'position', 'top-right');
          alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.message}` + " Parametrage Failed");

        }
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {



      this.dataUser = data;
      this.onRowUnselect(event);

    })
  }

  FileUploaded!: any;
  uploadedFiles: any[] = [];
  //   onUpload(event:any) {
  //     for(let file of event.files) {
  //         this.uploadedFiles.push(file);
  //         console.log("file base64", this.uploadedFiles)
  //     }
  //     console.log("file dddddddd", this.uploadedFiles)
  //     this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  // }
  fil64: any;
  click(event: any) {
    //  for(let file of event.files) {
    // this.uploadedFiles.push(this.getBase64(file));
    // console.log("file base6xxx4", this.uploadedFiles.name)

  }

  onUpload(event: any) {
    let fileReader = new FileReader();
    for (let file of event.files) {
      fileReader.readAsDataURL(file);
      fileReader.onload = function () {
        // Will print the base64 here.
        console.log(fileReader.result);
      };
    }
  }

  postmethodeSig(event: any) {
    let fileReader = new FileReader();
    for (let file of event.files) {
      fileReader.readAsDataURL(file);
      fileReader.onload = function () {
        // Will print the base64 here.
        console.log(fileReader.result);
      };
    }

  }
  // this.fil64 =  this.getBase64(this.FileUploaded );

  //   for(let file of event.files) {
  //     this.uploadedFiles.push(this.getBase64(file));
  //     console.log("file base6xxx4", this.uploadedFiles)
  // }
  // console.log("file basesssss64", this.uploadedFiles)
  // }


  getBase64(file: File) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject('file object is null');
      }

      var reader = new FileReader();

      reader.onloadend = function () {
        resolve({ res: reader.result, name: file.name });
      };
      reader.readAsDataURL(file);
    });
  }




  selectedFile2!: File;
  retrievedImage2: any;
  base64Data2: any;
  retrieveResonse2: any;
  message2!: string;
  imageName2: any;
  //Gets called when the user selects an image
  imagePreview!: string;
  public onFileChanged(event: any) {
    //Select File
    this.selectedFile2 = event.target.files[0];
    let file = event.target.files[0];
    let fileReader = new FileReader();

    fileReader.onloadend = () => {
      const base64String = fileReader.result as string;
      console.log("base64String", base64String);
      this.fileReaderRst = base64String;
      console.log("fileReaderRst", this.fileReaderRst);

    }
    if (file) {
      fileReader.readAsDataURL(file);

    }
    // 
    // for (let file of event.files) {
    //   fileReader.readAsDataURL(file);
    //   fileReader.onload = function () {
    //       // Will print the base64 here.
    //       // this.selectedFileToSig = fileReader.result as string;

    //     

    //   };
    // }


  }
  //Gets called when the user clicks on submit to upload the image
  // onUpload2() {

  //   this.getBase64(this.selectedFile2);
  //   console.log("v1", this.selectedFile2);
  //   //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
  //   const uploadImageData = new FormData();
  //   uploadImageData.append('imageFile', this.selectedFile2, this.selectedFile2.name);
  //   console.log("v2", this.selectedFile2);
  //   //Make a call to the Spring Boot Application to save the image
  //   // this.httpClient.post('http://localhost:8080/image/upload', uploadImageData, { observe: 'response' })
  //   //   .subscribe((response:any) => {
  //   //     if (response.status === 200) {
  //   //       this.message2 = 'Image uploaded successfully';
  //   //     } else {
  //   //       this.message2 = 'Image not uploaded successfully';
  //   //     }
  //   //   }
  //   //   );



  // }
  //Gets called when the user clicks on retieve image button to get the image from back end
  // getImage() {
  //   //Make a call to Sprinf Boot to get the Image Bytes.
  //   // this.httpClient.get('http://localhost:8080/image/get/' + this.imageName2)
  //   //   .subscribe(
  //   //     res => {
  //   //       this.retrieveResonse2 = res;
  //   //       this.base64Data2 = this.retrieveResonse2.picByte;
  //   //       this.retrievedImage2 = 'data:image/jpeg;base64,' + this.base64Data2;
  //   //     }
  //   //   );
  // }

}



