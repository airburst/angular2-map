import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './app';
import {provideStore} from '@ngrx/store';
import {waypoints, points} from './reducers/index';

bootstrap(AppComponent, [provideStore({ waypoints, points })]);
