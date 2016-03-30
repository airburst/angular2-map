import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {AppComponent} from './app';
import {provideStore} from '@ngrx/store';
import {track} from './reducers/track';
import {markers} from './reducers/markers';
import {elevation} from './reducers/elevation';
import {details} from './reducers/details';

bootstrap(AppComponent, [provideStore({ track, elevation, details, markers }), HTTP_PROVIDERS]);
