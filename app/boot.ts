import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './app';
import {provideStore} from '@ngrx/store';
import {waypoints} from './reducers/waypoints';

bootstrap(AppComponent, [provideStore({ waypoints })]);
