import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, throwError } from 'rxjs';

import * as alertifyjs from 'alertifyjs'
import { FormBuilder, Validators } from '@angular/forms';
import { state, style, trigger } from '@angular/animations';
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

  userName:string = '';
  password : string = '';

  constructor(private route: ActivatedRoute, private router: Router,private fb: FormBuilder) { }

  ngOnInit() {
    sessionStorage.clear();
    // this.reloadPage();
  }
  space: RegExp = /^[A-Za-z]+$/; 
  userForm = this.fb.group({
    userName: ['', Validators.required], 
    password: ['', Validators.required],
    
  });

  formValidation(){  
      sessionStorage.setItem("username",this.userName)
      this.router.navigate(['home'], { relativeTo: this.route }) 
      
  }

}