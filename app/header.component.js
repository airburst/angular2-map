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
                    this.load = new core_1.EventEmitter();
                    this.recalc = new core_1.EventEmitter();
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
                ], AppHeader.prototype, "load", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AppHeader.prototype, "recalc", void 0);
                AppHeader = __decorate([
                    core_1.Component({
                        selector: 'app-header',
                        template: "\n        <div class=\"stats\">\n            <div class=\"text\">\n                {{route.name}} &nbsp;&nbsp;&nbsp; Distance: {{route.distance | number:'1.1-2'}} km&nbsp;&nbsp;&nbsp;\n                Ascent: {{route.ascent}} m&nbsp;\n                <a href=\"#\" title=\"recalculate elevation\" (click)=\"recalc.emit()\">Recalculate</a>\n            </div>\n            <div class=\"form\">\n                <button id=\"clear\" (click)=\"clear.emit()\">Clear Route</button>\n                <button id=\"delete\" (click)=\"remove.emit()\">Remove WayPoint</button>\n                <label for=\"file\">Load GPX or TCX File:</label>\n                <input id=\"file\" type=\"file\" (change)=\"load.emit($event)\">\n            </div>\n        </div>\n    ",
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