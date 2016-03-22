import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './app';
import {provideStore} from '@ngrx/store';
import {track} from './reducers/track';
import {elevation} from './reducers/elevation';

bootstrap(AppComponent, [provideStore({ track, elevation })]);
