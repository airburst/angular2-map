import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './app';
import {provideStore} from '@ngrx/store';
import {counter} from './store/counter';

bootstrap(AppComponent, [provideStore({ counter }, {counter: 0})]);
