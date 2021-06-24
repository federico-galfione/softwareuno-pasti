import { Observable } from 'rxjs';

export interface PopupButton{
    title: string;
    type: 'primary' | 'secondary' | 'tertiary';
    fill: boolean;
    /* Return an observable that emits true, when the operation is done and the popup
       can be closed. Otherwise (if you want the popup to stay open) return false. */
    clickFunc?: () => Observable<boolean>;
}