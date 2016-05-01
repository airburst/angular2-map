System.register(['angular2/core', 'angular2/common', 'angular2/router', './services/file.service', './services/scriptload.service', './services/storage.service', './google/elevation.service', './google/directions.service', './osmaps/gpx.service', './osmaps/osmap', './header.component', './infopanel.component', './search.results.component', './osmaps/gazetteer', './models/route', './config/config', '@ngrx/store', './reducers/track', './reducers/elevation', './reducers/details', './reducers/gazetteer'], function(exports_1, context_1) {
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
    var core_1, common_1, router_1, file_service_1, scriptload_service_1, storage_service_1, elevation_service_1, directions_service_1, gpx_service_1, osmap_1, header_component_1, infopanel_component_1, search_results_component_1, gazetteer_1, route_1, config_1, store_1, track_1, elevation_1, details_1, gazetteer_2;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (file_service_1_1) {
                file_service_1 = file_service_1_1;
            },
            function (scriptload_service_1_1) {
                scriptload_service_1 = scriptload_service_1_1;
            },
            function (storage_service_1_1) {
                storage_service_1 = storage_service_1_1;
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
            function (infopanel_component_1_1) {
                infopanel_component_1 = infopanel_component_1_1;
            },
            function (search_results_component_1_1) {
                search_results_component_1 = search_results_component_1_1;
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
            },
            function (gazetteer_2_1) {
                gazetteer_2 = gazetteer_2_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(params, router, gpxService, fileService, scriptLoadService, storageService, elevationService, directionsService, gazetteerService, store) {
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
                    this.errorMessage = '';
                    this.routeId = '';
                    this.route = new route_1.RouteObserver(store);
                    this.searchResults = [];
                    this.routeId = this.params.get('id'); // Get id parameter, if present
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
                        .subscribe(function (route) { return _this.savedRoute = route; }, function (error) { return _this.errorMessage = error; });
                };
                // updateRouteName(name) {
                //     this.store.dispatch({ type: UPDATE_DETAILS, payload: name });
                //     this.save();
                // }
                AppComponent.prototype.clearRoute = function (details) {
                    this.store.dispatch({ type: details_1.CLEAR_DETAILS });
                    if (details !== undefined) {
                        this.store.dispatch({ type: details_1.UPDATE_DETAILS, payload: details });
                    }
                    this.store.dispatch({ type: track_1.CLEAR_TRACK });
                    this.store.dispatch({ type: elevation_1.CLEAR_ELEVATION });
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
                    else {
                        this.searchResults = results;
                    }
                };
                AppComponent.prototype.selectSearchResult = function (selected) {
                    this.clearRoute({ easting: selected.location.lon, northing: selected.location.lat });
                    this.store.dispatch({ type: gazetteer_2.CLEAR_RESULTS }); // Empty the search results
                };
                AppComponent.prototype.loadRoute = function () {
                    var _this = this;
                    if (this.routeId !== null) {
                        var r = this.storageService.getRoute(this.routeId)
                            .subscribe(function (route) {
                            if (route.details.name !== 'false') {
                                _this.route.setRoute(route);
                                _this.osmap.centreAndSetMapEvents();
                                _this.osmap.removeMapEvents();
                            }
                        }, function (error) { return _this.errorMessage = error; });
                    }
                };
                AppComponent.prototype.debug = function () {
                    console.log(this.store.getState());
                };
                AppComponent = __decorate([
                    core_1.Component({
                        // selector: 'my-app',
                        template: "\n        <app-header [route]=\"route.details$ | async\"\n            (clear)=\"clearRoute()\"\n            (remove)=\"removeLast()\"\n            (save)=\"save()\"\n            (search)=\"search($event)\"\n            (import)=\"importFile($event)\"\n            (export)=\"exportFile($event)\"\n            (toggleRoads)=\"toggleRoads()\"\n            (debug)=\"debug()\"\n        >\n        </app-header>\n        <search-results [results]=\"searchResults\"\n            (selected)=\"selectSearchResult($event)\"\n        ></search-results>\n        <map></map>\n        <infopanel [route]=\"route.details$ | async\"\n            (recalc)=\"recalculateElevation()\"\n        >\n        </infopanel>\n        ",
                        directives: [common_1.FORM_DIRECTIVES, osmap_1.OsMap, header_component_1.AppHeader, infopanel_component_1.InfoPanel, search_results_component_1.SearchResults],
                        providers: [
                            gpx_service_1.GpxService,
                            file_service_1.FileService,
                            scriptload_service_1.ScriptLoadService,
                            storage_service_1.StorageService,
                            elevation_service_1.ElevationService,
                            gazetteer_1.GazetteerService,
                            directions_service_1.DirectionsService
                        ]
                    }), 
                    __metadata('design:paramtypes', [router_1.RouteParams, router_1.Router, gpx_service_1.GpxService, file_service_1.FileService, scriptload_service_1.ScriptLoadService, storage_service_1.StorageService, elevation_service_1.ElevationService, directions_service_1.DirectionsService, gazetteer_1.GazetteerService, store_1.Store])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.js.map