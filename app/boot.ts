import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';
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
