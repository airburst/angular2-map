System.register(['angular2/core', 'angular2/common', './services/file.service', './services/scriptload.service', './osmaps/gpx.service', './osmaps/osmap'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, file_service_1, scriptload_service_1, gpx_service_1, osmap_1;
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
            function (gpx_service_1_1) {
                gpx_service_1 = gpx_service_1_1;
            },
            function (osmap_1_1) {
                osmap_1 = osmap_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(gpxService, fileService, scriptLoadService) {
                    this.gpxService = gpxService;
                    this.fileService = fileService;
                    this.scriptLoadService = scriptLoadService;
                    this.route = {};
                    this.totalAscent = 0;
                    this.totalDescent = 0;
                }
                // Load OS script and initialise map canvas
                AppComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.scriptLoadService.load('http://openspace.ordnancesurvey.co.uk/osmapapi/openspace.js?key=A73F02BD5E3B3B3AE0405F0AC8602805')
                        .then(function (value) {
                        _this.map = new osmap_1.OsMap;
                        _this.map.init();
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
                        // Test - change centre of map
                        _this.map.easting = 380000;
                        _this.map.centreMap();
                    });
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n        <div>\n            Load GPX File:\n            <input type=\"file\" (change)=\"fileChange($event)\">\n        </div>\n        <div>\n            <h2>Route</h2>\n            <p>Name: {{route.name}}\n                &nbsp;&nbsp;|&nbsp;&nbsp;\n                Total Ascent: {{route.ascent | number:'1.1-2'}} m\n                &nbsp;&nbsp;|&nbsp;&nbsp;\n                Total Descent: {{route.descent | number:'1.1-2'}} m</p>\n        </div>\n        <map></map>\n        ",
                        directives: [common_1.FORM_DIRECTIVES, osmap_1.OsMap],
                        providers: [gpx_service_1.GpxService, file_service_1.FileService, scriptload_service_1.ScriptLoadService]
                    }), 
                    __metadata('design:paramtypes', [gpx_service_1.GpxService, file_service_1.FileService, scriptload_service_1.ScriptLoadService])
                ], AppComponent);
                return AppComponent;
            })();
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.js.map