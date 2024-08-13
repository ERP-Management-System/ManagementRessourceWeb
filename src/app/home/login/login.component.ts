import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, throwError } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import * as alertifyjs from 'alertifyjs'
import { FormBuilder, Validators } from '@angular/forms';
import { state, style, trigger } from '@angular/animations';
import { ParametrageCentralService } from 'src/app/parametrageCenral/ParametrageCentralService/parametrage-central.service';
import { EncryptionService } from 'src/app/shared/EcrypteService/EncryptionService';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('errorState', [
      state('hide', style({
        opacity: 0
      })),

      state('show', style({
        opacity: 1
      }))
    ])
  ],
})
export class LoginComponent implements OnInit {

  userName: string = '';
  password: string = '';

  constructor(private encryptionService: EncryptionService,private route: ActivatedRoute, private param_achat_service: ParametrageCentralService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    sessionStorage.clear();
    // this.reloadPage();
  }
  // space: RegExp = /^[A-Za-z]+$/;
  userForm = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],

  });
  reloadPage() {
    setTimeout(() => {
      window.location.reload();
    }, 10);
  }
  tokenFromUI: string = '0123456789123456';
  encrypted: any = '';
  decrypted!: string;

  request!: string;
  responce!: string;
  // Encryption method (using crypto-js)
  // encryptUsingAES256() {
  //   this.param_achat_service.GetPasswordChangeApprouveAchat().pipe().subscribe((res: any) => {
  //     let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
  //     let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
  //     let encrypted = CryptoJS.AES.encrypt(JSON.stringify(res.valeur), _key, {
  //       keySize: 16,
  //       iv: _iv,
  //       mode: CryptoJS.mode.ECB,
  //       padding: CryptoJS.pad.Pkcs7,
  //     });
  //     this.encrypted = encrypted.toString();
  //     sessionStorage.setItem("PassAnnuleAppourve", encrypted.toString())
  //   })

  // }
  
  formValidation() {
    sessionStorage.setItem("username", this.userName)
    this.param_achat_service.GetPasswordChangeApprouveAchat().pipe().subscribe((res: any) => {

      const valueToStore = res.valeur; // The value you want to store
      const encryptedValue = this.encryptionService.encrypt(valueToStore);
      sessionStorage.setItem('PasswordAnnuleApprouve', encryptedValue);

    }); 
    this.reloadCurrentRoute();

  }

  reloadCurrentRoute() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['home']);
    });
  }

}