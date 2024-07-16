import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { Observable, tap, map } from "rxjs";
import { environment } from "src/environments/environment.development";


@Injectable({providedIn: 'root'})
export class BlobService {
  public src!: Blob;
}

@Injectable({providedIn: 'root'})
export class PreloadGuard implements CanActivate {
  constructor(private http: HttpClient, private blobService: BlobService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.http
      .get(`${environment.API_BASE_URL_ACHAT}details_demande_achat/edition/11`, { responseType: 'blob' })
      .pipe(
        tap((blob) => (this.blobService.src = blob)),
        map(() => true)
      );
  }
}