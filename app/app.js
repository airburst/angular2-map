System.register(['angular2/core', 'angular2/common', 'rxjs/add/operator/map', 'rxjs/add/operator/debounceTime', 'rxjs/add/operator/distinctUntilChanged', 'rxjs/add/operator/switchMap', './services/file.service', './services/scriptload.service', './google/elevation.service', './osmaps/gpx.service', './osmaps/osmap', './osmaps/gazetteer', './route', './config/config'], function(exports_1, context_1) {
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
    var core_1, common_1, file_service_1, scriptload_service_1, elevation_service_1, gpx_service_1, osmap_1, gazetteer_1, route_1, config_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (_1) {},
            function (_2) {},
            function (_3) {},
            function (_4) {},
            function (file_service_1_1) {
                file_service_1 = file_service_1_1;
            },
            function (scriptload_service_1_1) {
                scriptload_service_1 = scriptload_service_1_1;
            },
            function (elevation_service_1_1) {
                elevation_service_1 = elevation_service_1_1;
            },
            function (gpx_service_1_1) {
                gpx_service_1 = gpx_service_1_1;
            },
            function (osmap_1_1) {
                osmap_1 = osmap_1_1;
            },
            function (gazetteer_1_1) {
                gazetteer_1 = gazetteer_1_1;
            },
            function (route_1_1) {
                route_1 = route_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(gpxService, fileService, scriptLoadService, elevationService, gazetteerService) {
                    this.gpxService = gpxService;
                    this.fileService = fileService;
                    this.scriptLoadService = scriptLoadService;
                    this.elevationService = elevationService;
                    this.gazetteerService = gazetteerService;
                    this.route = new route_1.Route();
                    this.path = [];
                    this.distance = 0;
                    this.map = new osmap_1.OsMap;
                }
                ;
                // Lazy load OpenSpace and Google scripts and initialise map canvas
                AppComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.fileService.setAllowedExtensions(['tcx', 'gpx']);
                    var scripts = [config_1.settings.osMapUrl(), config_1.settings.gMapUrl], loadPromises = scripts.map(this.scriptLoadService.load);
                    Promise.all(loadPromises)
                        .then(function (value) {
                        _this.map.init();
                        _this.elevationService.init();
                    }, function (value) {
                        console.error('Script not found:', value);
                    });
                };
                AppComponent.prototype.fileChange = function ($event) {
                    var _this = this;
                    if (this.fileService.supports($event.target)) {
                        // TODO: wrap in a try-catch and throw exception if we cannot read file
                        this.fileService.readTextFile($event.target, function () {
                            var data = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                data[_i - 0] = arguments[_i];
                            }
                            _this.route = _this.gpxService.read(data);
                            _this.distance = _this.map.getDistance(_this.route.points);
                            // Change centre of map
                            var centre = _this.map.convertToMapPoint(_this.route.centre());
                            _this.map.centreMap(centre.x, centre.y, _this.route.getZoomLevel());
                            // Plot path and markers
                            _this.map.drawPath(_this.route);
                        });
                    }
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
                        templateUrl: '/app/app.template.html',
                        directives: [common_1.FORM_DIRECTIVES, osmap_1.OsMap],
                        providers: [gpx_service_1.GpxService, file_service_1.FileService, scriptload_service_1.ScriptLoadService, elevation_service_1.ElevationService, gazetteer_1.GazetteerService]
                    }), 
                    __metadata('design:paramtypes', [gpx_service_1.GpxService, file_service_1.FileService, scriptload_service_1.ScriptLoadService, elevation_service_1.ElevationService, gazetteer_1.GazetteerService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.js.map