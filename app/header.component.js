System.register(['angular2/core'], function(exports_1, context_1) {
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
    var core_1;
    var AppHeader;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            AppHeader = (function () {
                function AppHeader() {
                    this.clear = new core_1.EventEmitter();
                    this.remove = new core_1.EventEmitter();
                    this.import = new core_1.EventEmitter();
                    this.save = new core_1.EventEmitter();
                    this.search = new core_1.EventEmitter();
                    this.export = new core_1.EventEmitter();
                    this.toggleRoads = new core_1.EventEmitter();
                }
                AppHeader.prototype.searchTrigger = function (ev) {
                    this.search.emit(ev.target.value);
                    ev.target.value = null;
                };
                AppHeader.prototype.fileTrigger = function () {
                    // Warning: NOT the Angular2 way to access the DOM!
                    var f = window.document.getElementById('file');
                    f.click();
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], AppHeader.prototype, "details", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], AppHeader.prototype, "route", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AppHeader.prototype, "clear", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AppHeader.prototype, "remove", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AppHeader.prototype, "import", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AppHeader.prototype, "save", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AppHeader.prototype, "search", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AppHeader.prototype, "export", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AppHeader.prototype, "toggleRoads", void 0);
                AppHeader = __decorate([
                    core_1.Component({
                        selector: 'app-header',
                        inputs: ['details', 'route'],
                        template: "\n        <div class=\"stats\">\n        \n            <div class=\"left\">\n                <!--<div class=\"centre-container\">OS Route Planner</div>-->\n                <div class=\"centre-container\">\n                    <div class=\"search-input\">\n                        <span class=\"icon-search input-prepend\"></span>\n                        <input class=\"search\" id=\"search\" placeholder=\"Search for postcode or place\" \n                        (change)=\"searchTrigger($event)\"/>\n                    </div>\n                </div>\n            </div>\n            \n            <div class=\"right\">\n                <a *ngIf=\"details.isEditable\" class=\"item\" href=\"#\" (click)=\"toggleRoads.emit(); false;\">\n                    <div *ngIf=\"details.followsRoads\" class=\"icon icon-bike\"></div>\n                    <span *ngIf=\"details.followsRoads\">Ride</span>\n                    <div *ngIf=\"!details.followsRoads\" class=\"icon icon-walk\"></div>\n                    <span *ngIf=\"!details.followsRoads\">Walk</span>\n                </a>\n\n                <a *ngIf=\"details.isEditable\" class=\"item\" href=\"#\" (click)=\"remove.emit(); false;\">\n                    <div class=\"icon icon-undo\"></div>\n                    <span>Undo</span>\n                </a>\n\n                <a class=\"item\" href=\"#\" (click)=\"clear.emit(); false;\">\n                    <div class=\"icon icon-clear\"></div>\n                    <span>Clear</span>\n                </a>\n                \n                <button class=\"item\" (click)=\"fileTrigger()\">\n                    <div class=\"icon icon-import\"></div>\n                    <span>Import</span>\n                    <label for=\"file\" class=\"hidden\">Load GPX or TCX File:</label>\n                    <input class=\"hidden\" id=\"file\" type=\"file\" (change)=\"import.emit($event)\">\n                </button>\n\n                <a *ngIf=\"route.length\" class=\"item\" href=\"#\" (click)=\"save.emit(); false;\">\n                    <div class=\"icon icon-save\"></div>\n                    <span>Save</span>\n                </a>\n                <a *ngIf=\"route.length && details.isEditable\" class=\"item\" href=\"#\" (click)=\"export.emit(); false;\">\n                    <div class=\"icon icon-export\"></div>\n                    <span>Export</span>\n                </a>\n            </div>\n        </div>\n    ",
                        styles: ["\n        .stats {\n            background-color: #00897B;\n            font-family: 'Roboto', 'Arial', 'Helvetica';\n            position: absolute;\n            top: 0;\n            z-index: 999;\n            width: 100%;\n            padding: 8px 0;\n            display: flex;\n            box-shadow: 0 5px 5px -3px rgba(0,0,0,.14),\n                0 8px 10px 1px rgba(0,0,0,.098),\n                0 3px 14px 2px rgba(0,0,0,.084);\n        }\n        .stats, .item { color: white; }\n\n        .left {\n            padding-left: 8px;\n            font-size: 1.6em;\n            display: flex;\n            -webkit-flex-grow:  2;\n            flex-grow: 2;\n        }\n\n        .right {\n            padding-right: 8px;\n            display: flex;\n            -webkit-justify-content: flex-end;\n            justify-content: flex-end;\n            -webkit-flex-grow:  1;\n            flex-grow: 1;\n        }\n        \n        .centre-container {\n            display: flex;\n            flex-direction: column;\n            justify-content: center;\n        }\n        \n        .search {\n            margin-left: 2em;\n            padding-left: 0.5em;\n            height: 2.6em;\n            width: 100%;\n            font-family: 'Roboto', 'Arial', 'Helvetica';\n            font-size: 0.6em;\n            color: white;\n            border: 0px;\n            border-radius: 2px;\n            background-color: transparent;\n        }\n\n        ::-webkit-input-placeholder { color: white; }\n        :-moz-placeholder { color: white; }\n        ::-moz-placeholder { color: white; }\n        :-ms-input-placeholder { color: white; }\n\n        .search-input {\n            position: relative;\n            border: 0px;\n            border-radius: 2px;\n            background-color: #009688;\n            width: 500px;\n            /*margin-left: 1em;*/\n        }\n        .input-prepend {\n            position: absolute;\n            width: 24px;\n            height: 24px;\n            background-size: 24px 24px;\n            top: 8px;\n            left: 8px;\n        }\n        \n        .item { \n            width: 50px;\n            text-align: center;\n            text-decoration: none;\n            font-size: 0.8em;\n            line-height: 1.2em;\n            padding: 0;\n            background: transparent;\n            border: 0;\n        }\n        .item>div {\n            margin-left: 13px;\n            border: 0;\n        }\n        .item>span {\n            font-family: 'Roboto', 'Arial', 'Helvetica';\n        }\n        \n        .icon {\n            display: block;\n            text-indent: -9999px;\n            width: 24px;\n            height: 24px;\n            background-size: 24px 24px;\n        }\n        .icon-clear { background: url(dist/assets/images/icons/ic_close_white_24px.svg); }\n        .icon-undo { background: url(dist/assets/images/icons/ic_undo_white_24px.svg); }\n        .icon-save { background: url(dist/assets/images/icons/ic_save_white_24px.svg); }\n        .icon-import { background: url(dist/assets/images/icons/ic_file_upload_white_24px.svg); }\n        .icon-export { background: url(dist/assets/images/icons/ic_file_download_white_24px.svg); }\n        .icon-bike { background: url(dist/assets/images/icons/ic_directions_bike_white_24px.svg); }\n        .icon-walk { background: url(dist/assets/images/icons/ic_directions_walk_white_24px.svg); }\n        .icon-search { background: url(dist/assets/images/icons/ic_search_white_24px.svg); }\n        .icon-debug { background: url(dist/assets/images/icons/ic_bug_report_white_24px.svg); }\n\n        .hidden { display: none; }\n    "],
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppHeader);
                return AppHeader;
            }());
            exports_1("AppHeader", AppHeader);
        }
    }
});
//# sourceMappingURL=header.component.js.map