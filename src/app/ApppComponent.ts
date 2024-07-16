import { Injectable } from '@angular/core';
@Injectable()
export class ApppComponent {
    AdressIp = window.location.hostname;
    role: string = window.location.protocol +'//' + this.AdressIp + ':9005/sterilisation/';
}