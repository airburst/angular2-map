import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {RootComponent} from './root';
import {ToastOptions} from 'ng2-toastr/ng2-toastr';
import {provideStore} from '@ngrx/store';
import {track} from './reducers/track';
import {markers} from './reducers/markers';
import {elevation} from './reducers/elevation';
import {details} from './reducers/details';
import {results} from './reducers/gazetteer';

let options = {
    positionClass: 'toast-bottom-right',
};
    
bootstrap(RootComponent, [
    provideStore({ track, elevation, details, markers, results }), 
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    provide(ToastOptions, { useValue: new ToastOptions(options)})
]);
