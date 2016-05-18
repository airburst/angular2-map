"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
//import {Router} from '@angular/router';
var router_deprecated_1 = require('@angular/router-deprecated');
var file_service_1 = require('./services/file.service');
var scriptload_service_1 = require('./services/scriptload.service');
var storage_service_1 = require('./services/storage.service');
var elevation_service_1 = require('./google/elevation.service');
var directions_service_1 = require('./google/directions.service');
var gpx_service_1 = require('./osmaps/gpx.service');
var osmap_1 = require('./osmaps/osmap');
var header_component_1 = require('./header.component');
var infopanel_component_1 = require('./infopanel.component');
var search_results_component_1 = require('./search.results.component');
var gazetteer_1 = require('./osmaps/gazetteer');
var route_1 = require('./models/route');
var config_1 = require('./config/config');
var store_1 = require('@ngrx/store');
var track_1 = require('./reducers/track');
var elevation_1 = require('./reducers/elevation');
var details_1 = require('./reducers/details');
var markers_1 = require('./reducers/markers');
var gazetteer_2 = require('./reducers/gazetteer');
var ng2_toastr_1 = require('ng2-toastr/ng2-toastr');
var AppComponent = (function () {
    function AppComponent(params, router, gpxService, fileService, scriptLoadService, storageService, elevationService, directionsService, gazetteerService, store, toastr) {
        this.params = params;
        this.router = router;
        this.gpxService = gpxService;
        this.fileService = fileService;
        this.scriptLoadService = scriptLoadService;
        this.storageService = storageService;
        this.elevationService = elevationService;
        this.directionsService = directionsService;
        this.gazetteerService = gazetteerService;
        this.store = store;
        this.toastr = toastr;
        this.errorMessage = '';
        this.routeId = '';
        this.route = new route_1.RouteObserver(store);
        this.routeId = this.params.get('id');
    }
    // Lazy load OpenSpace and Google scripts and initialise map canvas
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        if ((!window.OpenSpace) && (!window.google)) {
            this.fileService.setAllowedExtensions(['tcx', 'gpx']);
            var scripts = [config_1.settings.osMapUrl(), config_1.settings.gMapUrl], loadPromises = scripts.map(this.scriptLoadService.load);
            Promise.all(loadPromises)
                .then(function (value) {
                _this.elevationService.init();
                _this.startMap();
                _this.route.searchResults$.subscribe(function (results) {
                    _this.handleSearchResults(results);
                });
                _this.loadRoute();
            }, function (value) {
                console.error('Script not found:', value);
            });
        }
        else {
            this.startMap();
        }
    };
    AppComponent.prototype.startMap = function () {
        this.directionsService.init();
        this.osmap = new osmap_1.OsMap(this.directionsService, this.store);
        this.osmap.init();
    };
    AppComponent.prototype.importFile = function (ev) {
        var _this = this;
        if (this.fileService.supports(ev.target)) {
            this.fileService.readTextFile(ev.target, function () {
                var data = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    data[_i - 0] = arguments[_i];
                }
                _this.gpxService.read(data);
                _this.osmap.centreAndSetMapEvents();
                _this.osmap.removeMapEvents();
                ev.target.value = null; // Empty the file input so that it can detect changes
                _this.makeRouteNonEditable();
            });
        }
    };
    AppComponent.prototype.exportFile = function () {
        var name = this.store.getState().details.name + '.gpx', gpx = this.gpxService.write();
        this.fileService.save(gpx, name);
    };
    AppComponent.prototype.save = function () {
        var _this = this;
        var r = new route_1.Route(this.store.getState());
        this.storageService.saveRoute(r)
            .subscribe(function (route) {
            _this.savedRoute = route;
            _this.router.navigate(['Route', { id: _this.savedRoute.id }]);
            _this.showSuccess('You can share the link from the address bar.', 'Your form link');
        }, function (error) {
            _this.errorMessage = error;
            console.log(_this.errorMessage);
            //this.showError(this.errorMessage);
        });
    };
    // updateRouteName(name) {
    //     this.store.dispatch({ type: UPDATE_DETAILS, payload: name });
    //     this.save();
    // }
    AppComponent.prototype.clearRoute = function (details) {
        this.store.dispatch({ type: details_1.CLEAR_DETAILS });
        this.store.dispatch({ type: track_1.CLEAR_TRACK });
        this.store.dispatch({ type: elevation_1.CLEAR_ELEVATION });
        this.store.dispatch({ type: markers_1.CLEAR_MARKERS });
        this.store.dispatch({ type: gazetteer_2.CLEAR_RESULTS });
        if (details !== undefined) {
            this.store.dispatch({ type: details_1.UPDATE_DETAILS, payload: details });
        }
        this.router.navigate(['Map']);
        this.osmap.init();
    };
    AppComponent.prototype.removeLast = function () {
        this.store.dispatch({ type: track_1.REMOVE_LAST_SEGMENT });
        this.store.dispatch({ type: elevation_1.REMOVE_ELEVATION });
    };
    AppComponent.prototype.toggleRoads = function () {
        this.store.dispatch({ type: details_1.TOGGLE_ROADS });
    };
    AppComponent.prototype.recalculateElevation = function () {
        var segment = this.store.getState().track[0];
        segment.hasElevationData = false;
        this.elevationService.getElevationDataWithThrottle(segment);
    };
    AppComponent.prototype.search = function (place) {
        if (place !== '') {
            this.gazetteerService.searchPostcode(place);
        }
    };
    AppComponent.prototype.handleSearchResults = function (results) {
        if (results.length === 1) {
            this.selectSearchResult(results[0]);
        }
    };
    AppComponent.prototype.selectSearchResult = function (selected) {
        this.clearRoute({ easting: selected.location.lon, northing: selected.location.lat });
    };
    AppComponent.prototype.closeSearchResult = function () {
        this.store.dispatch({ type: gazetteer_2.CLEAR_RESULTS });
    };
    AppComponent.prototype.loadRoute = function () {
        var _this = this;
        if (this.routeId !== null) {
            var r = this.storageService.getRoute(this.routeId)
                .subscribe(function (route) {
                if (route.details.name !== 'false') {
                    _this.route.setRoute(route);
                    _this.osmap.centreAndSetMapEvents();
                    _this.osmap.removeMapEvents(); // TODO: only remove if imported?
                    _this.makeRouteNonEditable();
                }
            }, function (error) { return _this.errorMessage = error; });
        }
    };
    AppComponent.prototype.showError = function (message) {
        this.toastr.error(message, 'Oops!');
    };
    AppComponent.prototype.showSuccess = function (message, title) {
        this.toastr.success(message, title);
    };
    AppComponent.prototype.makeRouteNonEditable = function () {
        this.store.dispatch({ type: details_1.UPDATE_DETAILS, payload: { isEditable: false } });
    };
    AppComponent = __decorate([
        core_1.Component({
            // selector: 'my-app',
            template: "\n        <app-header [details]=\"route.details$ | async\"\n            [route]=\"route.track$ | async\"\n            (clear)=\"clearRoute()\"\n            (remove)=\"removeLast()\"\n            (save)=\"save()\"\n            (search)=\"search($event)\"\n            (import)=\"importFile($event)\"\n            (export)=\"exportFile($event)\"\n            (toggleRoads)=\"toggleRoads()\"\n        >\n        </app-header>\n        <search-results [results]=\"route.searchResults$ | async\"\n            (selected)=\"selectSearchResult($event)\"\n            (closed)=\"closeSearchResult()\"\n        ></search-results>\n        <map></map>\n        <infopanel [route]=\"route.details$ | async\"\n            (recalc)=\"recalculateElevation()\"\n        >\n        </infopanel>\n        ",
            directives: [common_1.FORM_DIRECTIVES, osmap_1.OsMap, header_component_1.AppHeader, infopanel_component_1.InfoPanel, search_results_component_1.SearchResults],
            providers: [
                gpx_service_1.GpxService,
                file_service_1.FileService,
                scriptload_service_1.ScriptLoadService,
                storage_service_1.StorageService,
                elevation_service_1.ElevationService,
                gazetteer_1.GazetteerService,
                directions_service_1.DirectionsService,
                ng2_toastr_1.ToastsManager
            ]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.RouteParams, router_deprecated_1.Router, gpx_service_1.GpxService, file_service_1.FileService, scriptload_service_1.ScriptLoadService, storage_service_1.StorageService, elevation_service_1.ElevationService, directions_service_1.DirectionsService, gazetteer_1.GazetteerService, store_1.Store, ng2_toastr_1.ToastsManager])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.js.map