import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { IdleService } from './home/idle.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.liveClock();
    this.getvaluesFromLocalStorage();
    
    
  }
  title = 'ManageRessourceWeb';

  liveDateTime = new Date();
  constructor(private idleService: IdleService) {
  }
  liveClock() {
    setInterval(() => {
      this.liveDateTime = new Date();
    }, 1000);
  }
  disabled: boolean = false;
  timer :any;
  
  currentTime = 0;

 

 
  getvaluesFromLocalStorage() {
    // this.stopTimer();
    var intervalId = setInterval(() =>{
      if (sessionStorage.getItem("username") === null) {
        this.disabled = false
      } else {
        this.disabled = true
      }
   }, 100);
console.log("intervalId" )
  

     
 
    
  }


}
