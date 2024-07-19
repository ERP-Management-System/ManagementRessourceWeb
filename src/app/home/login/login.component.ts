import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName! :string;
  password !: string;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    sessionStorage.clear();
  }

  formValidation(){
    console.log(this.userName);
    console.log(this.password);
 
    sessionStorage.setItem("username","soufien")
    this.router.navigate(['home'], { relativeTo: this.route })

    
  }

}