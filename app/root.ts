import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';
import { AppComponent } from './app';
import { AppHeader } from './header.component';
@Component({
    selector: 'my-app',
    template: `
        <router-outlet></router-outlet>
    `,
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    { path: '/map/',   name: 'Map',    component: AppHeader },
    { path: '/:id',    name: 'Route',  component: AppComponent }
])
export class RootComponent { }