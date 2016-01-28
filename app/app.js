System.register(['angular2/core', 'angular2/common', './services/file.service', './services/scriptload.service', './google/elevation.service', './osmaps/gpx.service', './osmaps/osmap', './osmaps/gazetteer', './config/config'], function(exports_1) {
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
                    this.fileService.ReadTextFile($event.target, function (data) {
                        _this.route = _this.gpxService.read(data);
                        _this.distance = _this.map.getDistance(_this.route.points);
                        // Change centre of map
                        var centre = _this.map.convertToMapPoint(_this.route.centre);
                        _this.map.centreMap(centre.x, centre.y, _this.route.zoom);
                        // Plot path and markers
                        _this.map.drawPath(_this.route);
                        // Show elevation
                        _this.elevationService.getElevation(_this.route);
                    });
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
                        template: "\n        <div>\n            <label for=\"file\">Load GPX File:</label>\n            <input id=\"file\" type=\"file\" (change)=\"fileChange($event)\">\n            <label for=\"search\">Search for postcode or place:</label>\n            <input id=\"search\" type=\"text\" (change)=\"search($event)\">\n        </div>\n        <div class=\"stats\">\n            Name: {{route.name}}\n                &nbsp;&nbsp;|&nbsp;&nbsp;\n                Total Ascent: {{route.ascent | number:'1.1-2'}} m\n                &nbsp;&nbsp;|&nbsp;&nbsp;\n                Total Descent: {{route.descent | number:'1.1-2'}} m\n                &nbsp;&nbsp;|&nbsp;&nbsp;\n                Distance: {{distance | number:'1.1-2'}} km\n        </div>\n        <map></map>\n        ",
                        directives: [common_1.FORM_DIRECTIVES, osmap_1.OsMap],
                        providers: [gpx_service_1.GpxService, file_service_1.FileService, scriptload_service_1.ScriptLoadService, elevation_service_1.ElevationService, gazetteer_1.GazetteerService],
                        styles: ["\n        .stats {\n            background-color: #222;\n            color: #fff;\n            font-family: 'Open Sans', 'Arial', 'Helvetica';\n            line-height: 2em;\n            padding: 10px;\n        }\n    "]
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