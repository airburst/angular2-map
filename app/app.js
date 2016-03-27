System.register(['angular2/core', 'angular2/common', './services/file.service', './services/scriptload.service', './services/elevation.service', './google/directions.service', './osmaps/gpx.service', './osmaps/osmap', './header.component', './osmaps/gazetteer', './route', './config/config', '@ngrx/store', './reducers/track', './reducers/elevation', './reducers/details'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, file_service_1, scriptload_service_1, elevation_service_1, directions_service_1, gpx_service_1, osmap_1, header_component_1, gazetteer_1, route_1, config_1, store_1, track_1, elevation_1, details_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (file_service_1_1) {
                file_service_1 = file_service_1_1;
            },
            function (scriptload_service_1_1) {
                scriptload_service_1 = scriptload_service_1_1;
            },
            function (elevation_service_1_1) {
                elevation_service_1 = elevation_service_1_1;
            },
            function (directions_service_1_1) {
                directions_service_1 = directions_service_1_1;
            },
            function (gpx_service_1_1) {
                gpx_service_1 = gpx_service_1_1;
            },
            function (osmap_1_1) {
                osmap_1 = osmap_1_1;
            },
            function (header_component_1_1) {
                header_component_1 = header_component_1_1;
            },
            function (gazetteer_1_1) {
                gazetteer_1 = gazetteer_1_1;
            },
            function (route_1_1) {
                route_1 = route_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (store_1_1) {
                store_1 = store_1_1;
            },
            function (track_1_1) {
                track_1 = track_1_1;
            },
            function (elevation_1_1) {
                elevation_1 = elevation_1_1;
            },
            function (details_1_1) {
                details_1 = details_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(gpxService, fileService, scriptLoadService, elevationService, directionsService, gazetteerService, store) {
                    this.gpxService = gpxService;
                    this.fileService = fileService;
                    this.scriptLoadService = scriptLoadService;
                    this.elevationService = elevationService;
                    this.directionsService = directionsService;
                    this.gazetteerService = gazetteerService;
                    this.store = store;
                    this.route = new route_1.Route(store);
                }
                // Lazy load OpenSpace and Google scripts and initialise map canvas
                AppComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.fileService.setAllowedExtensions(['tcx', 'gpx']);
                    var scripts = [config_1.settings.osMapUrl(), config_1.settings.gMapUrl], loadPromises = scripts.map(this.scriptLoadService.load);
                    Promise.all(loadPromises)
                        .then(function (value) {
                        _this.directionsService.init();
                        _this.elevationService.init();
                        _this.osmap = new osmap_1.OsMap(_this.directionsService, _this.store);
                        _this.osmap.init();
                    }, function (value) {
                        console.error('Script not found:', value);
                    });
                    // Set centre and zoom when route changes ===TODO: may want to move this into osmap
                    this.route.track$.subscribe(function (t) {
                        var b = route_1.boundingRectangle(t);
                        _this.store.dispatch({
                            type: details_1.UPDATE_DETAILS,
                            payload: { lat: b.lat, lon: b.lon, zoom: b.zoom }
                        });
                    });
                };
                AppComponent.prototype.fileChange = function ($event) {
                    var _this = this;
                    if (this.fileService.supports($event.target)) {
                        this.fileService.readTextFile($event.target, function () {
                            var data = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                data[_i - 0] = arguments[_i];
                            }
                            _this.gpxService.read(data);
                        });
                    }
                };
                AppComponent.prototype.clearRoute = function () {
                    this.store.dispatch({ type: track_1.CLEAR_TRACK });
                    this.store.dispatch({ type: elevation_1.CLEAR_ELEVATION });
                };
                AppComponent.prototype.removeLast = function () {
                    this.store.dispatch({ type: track_1.REMOVE_LAST_SEGMENT });
                    this.store.dispatch({ type: elevation_1.REMOVE_ELEVATION });
                };
                AppComponent.prototype.recalculateElevation = function () {
                    this.store.dispatch({ type: elevation_1.CLEAR_ELEVATION });
                    var segment = this.route.track$.destination.value.track[0];
                    segment.hasElevationData = false;
                    this.elevationService.getElevationData(segment);
                };
                AppComponent.prototype.search = function ($event) {
                    var place = $event.target.value;
                    if (place !== '') {
                        this.gazetteerService.searchPostcode(place, this.showSearchResults);
                    }
                };
                AppComponent.prototype.showSearchResults = function (results, type) {
                    console.log('Results in App:', type, results);
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n        <app-header [route]=\"route.details$ | async\"\n            (clear)=\"clearRoute()\"\n            (remove)=\"removeLast()\"\n            (load)=\"fileChange($event)\"\n            (recalc)=\"recalculateElevation()\"\n        >\n        </app-header>\n        <map></map>\n        ",
                        directives: [common_1.FORM_DIRECTIVES, osmap_1.OsMap, header_component_1.AppHeader],
                        providers: [
                            gpx_service_1.GpxService,
                            file_service_1.FileService,
                            scriptload_service_1.ScriptLoadService,
                            elevation_service_1.ElevationService,
                            gazetteer_1.GazetteerService,
                            directions_service_1.DirectionsService
                        ]
                    }), 
                    __metadata('design:paramtypes', [gpx_service_1.GpxService, file_service_1.FileService, scriptload_service_1.ScriptLoadService, elevation_service_1.ElevationService, directions_service_1.DirectionsService, gazetteer_1.GazetteerService, store_1.Store])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.js.map