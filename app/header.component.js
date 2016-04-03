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
                }
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
                AppHeader = __decorate([
                    core_1.Component({
                        selector: 'app-header',
                        template: "\n        <div class=\"stats\">\n            <div class=\"text\">OS Route Planner</div>\n            <div class=\"form\">\n                <button id=\"clear\" (click)=\"clear.emit()\">Clear Route</button>\n                <button id=\"delete\" (click)=\"remove.emit()\">Remove WayPoint</button>\n                <button id=\"save\" (click)=\"save.emit()\">Save</button>\n                <label for=\"file\">Load GPX or TCX File:</label>\n                <input id=\"file\" type=\"file\" (change)=\"import.emit($event)\">\n            </div>\n        </div>\n    ",
                        styles: ["\n        .stats {\n            background-color: #f1f1f1;\n            color: #222;\n            font-family: 'Open Sans', 'Arial', 'Helvetica';\n            line-height: 2em;\n            position: absolute;\n            top: 0;\n            z-index: 999;\n            width: 100%;\n            padding: 10px;\n            box-sizing: border-box;\n        }\n\n        .text {\n            width: 50%;\n            float: left;\n            font-size: 1.6em;\n        }\n\n        .form {\n            width: 50%;\n            float: right;\n            text-align: right;\n        }\n\n        .header-link {\n            color: white;\n            text-decoration-style: dashed;\n        }\n    "],
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