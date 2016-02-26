System.register(['angular2/core', 'angular2/common', 'rxjs/add/operator/map', 'rxjs/add/operator/debounceTime', 'rxjs/add/operator/distinctUntilChanged', 'rxjs/add/operator/switchMap', './services/file.service', './services/scriptload.service', './google/elevation.service', './osmaps/gpx.service', './osmaps/osmap', './osmaps/gazetteer', './config/config'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, file_service_1, scriptload_service_1, elevation_service_1, gpx_service_1, osmap_1, gazetteer_1, config_1;
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
                    this.route = {};
                    this.path = [];
                    this.distance = 0;
                    this.map = new osmap_1.OsMap;
                }
                // Load OS and Google scripts and initialise map canvas
                AppComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.fileService.setAllowedExtensions(['tcx', 'gpx']);
                    var scripts = [config_1.settings.osMapUrl(), config_1.settings.gMapUrl], loadPromises = scripts.map(this.scriptLoadService.load);
                    Promise.all(loadPromises)
                        .then(function (value) {
                        //TODO: Test for OpenSpace unavailable in Window object
                        _this.map.init();
                        _this.elevationService.init(); // Doesn't do much yet
                    }, function (value) {
                        console.error('Script not found:', value);
                    });
                };
                // File load handler
                AppComponent.prototype.fileChange = function ($event) {
                    var _this = this;
                    // Convert gpx file into json
                    if (this.fileService.supports($event.target)) {
                        this.fileService.readTextFile($event.target, function () {
                            var data = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                data[_i - 0] = arguments[_i];
                            }
                            _this.route = _this.gpxService.read(data);
                            _this.distance = _this.map.getDistance(_this.route.points);
                            // Change centre of map
                            var centre = _this.map.convertToMapPoint(_this.route.centre); //TODO: enbed this test inside centreMap()
                            _this.map.centreMap(centre.x, centre.y, _this.route.zoom);
                            // Plot path and markers
                            _this.map.drawPath(_this.route);
                            // Show elevation
                            //this.elevationService.getElevation(this.route);
                        });
                    }
                };
                // Search handler
                AppComponent.prototype.search = function ($event) {
                    if ($event.target.value !== '') {
                        this.gazetteerService.searchPostcode($event.target.value, function (results, type) {
                            console.log('Results in App:', type, results);
                        });
                    }
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        templateUrl: '/app/app.template.html',
                        directives: [common_1.FORM_DIRECTIVES, osmap_1.OsMap],
                        providers: [gpx_service_1.GpxService, file_service_1.FileService, scriptload_service_1.ScriptLoadService, elevation_service_1.ElevationService, gazetteer_1.GazetteerService],
                        styles: ["\n        .stats {\n            background-color: #222;\n            color: #fff;\n            font-family: 'Open Sans', 'Arial', 'Helvetica';\n            line-height: 2em;\n            padding: 10px;\n            position: absolute;\n            top: 0;\n            z-index: 999;\n            width: 100%;\n        }\n        \n        .text {\n            width: 50%;\n            float: left;\n        }\n        \n        .form {\n            width: 50%;\n            float: right;\n            text-align: right;\n        }\n    "]
                    }), 
                    __metadata('design:paramtypes', [gpx_service_1.GpxService, file_service_1.FileService, scriptload_service_1.ScriptLoadService, elevation_service_1.ElevationService, gazetteer_1.GazetteerService])
                ], AppComponent);
                return AppComponent;
            })();
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.js.map