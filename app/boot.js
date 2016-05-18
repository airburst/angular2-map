"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var router_deprecated_1 = require('@angular/router-deprecated');
var root_1 = require('./root');
var ng2_toastr_1 = require('ng2-toastr/ng2-toastr');
var store_1 = require('@ngrx/store');
var track_1 = require('./reducers/track');
var markers_1 = require('./reducers/markers');
var elevation_1 = require('./reducers/elevation');
var details_1 = require('./reducers/details');
var gazetteer_1 = require('./reducers/gazetteer');
var options = {
    positionClass: 'toast-bottom-right',
};
platform_browser_dynamic_1.bootstrap(root_1.RootComponent, [
    store_1.provideStore({ track: track_1.track, elevation: elevation_1.elevation, details: details_1.details, markers: markers_1.markers, results: gazetteer_1.results }),
    http_1.HTTP_PROVIDERS,
    router_deprecated_1.ROUTER_PROVIDERS,
    core_1.provide(ng2_toastr_1.ToastOptions, { useValue: new ng2_toastr_1.ToastOptions(options) })
]);
//# sourceMappingURL=boot.js.map