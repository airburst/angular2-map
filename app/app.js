System.register(['angular2/core', 'angular2/common', './services/file.service', './services/gpx.service'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, file_service_1, gpx_service_1;
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
            function (gpx_service_1_1) {
                gpx_service_1 = gpx_service_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(gpxService, fileService) {
                    this.gpxService = gpxService;
                    this.fileService = fileService;
                    this.route = '';
                    this.totalAscent = 0;
                    this.totalDescent = 0;
                }
                // File load handler
                AppComponent.prototype.fileChange = function ($event) {
                    var _this = this;
                    // Convert gpx file into json
                    this.fileService.ReadTextFile($event.target, function (data) {
                        _this.route = _this.gpxService.import(data);
                    });
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n        <div>\n            Load GPX File:\n            <input type=\"file\" (change)=\"fileChange($event)\">\n        </div>\n        <div>\n            <h2>Route</h2>\n            <p>Name: {{route.name}}</p>\n            <p>Total Ascent: {{route.ascent}}</p>\n            <p>Total Descent: {{route.descent}}</p>\n        </div>\n        ",
                        directives: [common_1.FORM_DIRECTIVES],
                        providers: [gpx_service_1.GpxService, file_service_1.FileService]
                    }), 
                    __metadata('design:paramtypes', [gpx_service_1.GpxService, file_service_1.FileService])
                ], AppComponent);
                return AppComponent;
            })();
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.js.map