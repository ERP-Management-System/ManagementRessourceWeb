import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  ngOnInit(): void {
    

    this.MethodeVisbileNavBars();

  }

  VisibleNavBar : boolean = false;
  // usernameSsesion  :  any ='';
  MethodeVisbileNavBars(){   
    var count=0;
    console.log(sessionStorage.getItem("username"));
    var intervalId = setInterval(() =>{if(sessionStorage.getItem("username") == '' ||  sessionStorage.getItem("username") === null ){ 
      this.VisibleNavBar = false;
    }else{
      this.VisibleNavBar = true; 
    } 
    count=count+1;
    if (count==1000) clearInterval(intervalId);
    }, 10);

   

 

    
  }

  step:any;
  
  name = 'Angular 6';
  tab : any = "tab1";
  tab1 : any
  tab2 : any
  tab3 : any
  tab4 : any
  tab5 : any
  tab6 : any
  tab7 : any
  tab8 : any
  tab9 : any
  tab10 : any
  tab11 : any
  tab12 : any
  tab13 : any
  tab14 : any
  tab15 : any
  tab16 : any
  tab17 : any
  tab18 : any
  tab19 : any
  tab20 : any
  tab21 : any
  tab22 : any
  tab23 : any
  tab24 : any
  tab25 : any
  Clicked! : boolean

  onClick(check:any){
    //    console.log(check);
        if(check==1){
          this.tab = 'tab1';
        }else if(check==2){
          this.tab2 = 'tab2';
        }else if(check==3){
          this.tab3 = 'tab3';
        }else if(check==4){
          this.tab4 = 'tab4'; 
        }else if(check==5){
          this.tab5 = 'tab5';
        }else if(check==6){
          this.tab6 = 'tab6';
        }else if(check==7){
          this.tab7 = 'tab7';
        }else if(check==8){
          this.tab8 = 'tab8';
        }else if(check==9){
          this.tab9 = 'tab9';
        }else if(check==10){
          this.tab10 = 'tab10';
        }else if(check==11){
          this.tab11 = 'tab11';
        }else if(check==12){
          this.tab12 = 'tab12';
        }else if(check==13){
          this.tab13 = 'tab13';
        }else if(check==14){
          this.tab14 = 'tab14';
        }else if(check==15){
          this.tab15 = 'tab15';
        }else if(check==16){
          this.tab16 = 'tab16';
        }else if(check==17){
          this.tab17 = 'tab17';
        }else if(check==18){
          this.tab18 = 'tab18';
        }else if(check==19){
          this.tab19 = 'tab19';
        }else if(check==20){
          this.tab20 = 'tab20';
        }else if(check==21){
          this.tab21 = 'tab21';
        }else if(check==22){
          this.tab22 = 'tab22';
        }else if(check==23){
          this.tab23 = 'tab23';
        }else if(check==24){
          this.tab24 = 'tab24';
        }else if(check==25){
          this.tab25 = 'tab25';
        }  
      
    }

}
