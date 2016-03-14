System.register(['angular2/platform/browser', './app', '@ngrx/store', './reducers/route'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var browser_1, app_1, store_1, route_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_1_1) {
                app_1 = app_1_1;
            },
            function (store_1_1) {
                store_1 = store_1_1;
            },
            function (route_1_1) {
                route_1 = route_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_1.AppComponent, [store_1.provideStore({ waypoints: route_1.waypoints })]);
        }
    }
});
//# sourceMappingURL=boot.js.map