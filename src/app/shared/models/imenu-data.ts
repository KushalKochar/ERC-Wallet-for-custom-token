import { Data } from '@angular/router';

export interface IMenuData extends Data {
    /**
     * Text for link
     */
    pageTitle: string;

    /**
     * Show to anonymous users (default: false)
     */
    allowAnonymous?: boolean;
    /**
     * Show to authenticated users (default: true)
     */
    allowAuthenticated?: boolean;
}