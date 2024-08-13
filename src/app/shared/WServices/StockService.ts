import { DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { ParametrageCentralService } from "src/app/parametrageCenral/ParametrageCentralService/parametrage-central.service";

import * as alertifyjs from 'alertifyjs'
import { DemandeAchat } from "src/app/domaine/ParametrageCentral";

export class WserviceAchat {

    constructor(private datePipe: DatePipe,
        private param_achat_service: ParametrageCentralService) {

    }

    dataDemandeAchat = new Array<DemandeAchat>();
    GelAllDemandeTransfert() {
        this.param_achat_service.GetDemandeAchat().pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) { } else {
                    alertifyjs.set('notifier', 'position', 'top-right');
                    alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;"></i>' + ` ${error.error.description}`);

                }
                return throwError(errorMessage);
            })

        ).subscribe((data: any) => {



            this.dataDemandeAchat = data;

        })
    }
}