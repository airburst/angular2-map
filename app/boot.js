System.register(['angular2/platform/browser', 'angular2/http', './app', '@ngrx/store', './reducers/track', './reducers/markers', './reducers/elevation', './reducers/details', './reducers/gazetteer'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var browser_1, http_1, app_1, store_1, track_1, markers_1, elevation_1, details_1, gazetteer_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
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
            function (markers_1_1) {
                markers_1 = markers_1_1;
            },
            function (elevation_1_1) {
                elevation_1 = elevation_1_1;
            },
            function (details_1_1) {
                details_1 = details_1_1;
            },
            function (gazetteer_1_1) {
                gazetteer_1 = gazetteer_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_1.AppComponent, [store_1.provideStore({ track: track_1.track, elevation: elevation_1.elevation, details: details_1.details, markers: markers_1.markers, results: gazetteer_1.results }), http_1.HTTP_PROVIDERS]);
        }
    }
});
//# sourceMappingURL=boot.js.map