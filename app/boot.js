System.register(['angular2/platform/browser', './app', '@ngrx/store', './reducers/track', './reducers/elevation'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var browser_1, app_1, store_1, track_1, elevation_1;
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
            function (track_1_1) {
                track_1 = track_1_1;
            },
            function (elevation_1_1) {
                elevation_1 = elevation_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_1.AppComponent, [store_1.provideStore({ track: track_1.track, elevation: elevation_1.elevation })]);
        }
    }
});
//# sourceMappingURL=boot.js.map