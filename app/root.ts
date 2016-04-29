import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';
import { AppComponent } from './app';
@Component({
    selector: 'my-app',
    template: `
        <router-outlet></router-outlet>
    `,
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    { path: '/',    name: 'Map',    component: AppComponent, useAsDefault: true },
    { path: '/:id', name: 'Route',  component: AppComponent }
])
export class RootComponent { }