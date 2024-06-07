  
import { NotificationModel } from '../models/notification-model';
import { GlobalService } from '../service/global.service';

export class RootComponent {
    constructor(public _globalService: GlobalService) { }

    alertMessage(data: NotificationModel = {
        type: 'default',
        title: 'Look here!',
        value: 'This alert needs your attention.'
    }) {
        //this._globalService._notification(data);
        this._globalService.dataBusChanged('notification', data);
    }
}
