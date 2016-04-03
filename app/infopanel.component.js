System.register(['angular2/core', 'angular2/common', './chart.component'], function(exports_1, context_1) {
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
    var core_1, common_1, chart_component_1;
    var InfoPanel;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (chart_component_1_1) {
                chart_component_1 = chart_component_1_1;
            }],
        execute: function() {
            InfoPanel = (function () {
                function InfoPanel() {
                    //@Input() elevation: number[];
                    this.recalc = new core_1.EventEmitter();
                    this.show = true;
                    this.toggleText = (this.show) ? 'Elevation On' : 'Elevation Off';
                }
                InfoPanel.prototype.togglePanel = function () {
                    this.show = !this.show;
                    this.toggleText = (this.show) ? 'Elevation On' : 'Elevation Off';
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], InfoPanel.prototype, "route", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], InfoPanel.prototype, "recalc", void 0);
                InfoPanel = __decorate([
                    core_1.Component({
                        selector: 'infopanel',
                        template: "\n        <div class=\"infopanel\" [ngClass]=\"{show: show}\">\n            <div class=\"elevation-header\">\n                <div class=\"left\">\n                    <div class=\"item\">\n                        <div class=\"value\">{{route.distance | number:'1.1-2'}} km</div>\n                        <div class=\"label\">Distance</div>\n                    </div>\n                    <div class=\"item\">\n                        <div class=\"value\">{{route.ascent}} m</div>\n                        <div class=\"label\">Height Gain <a *ngIf=\"!route.hasNewElevation\" class=\"header-link\" href=\"#\" title=\"recalculate elevation\" (click)=\"recalc.emit()\">Recalculate</a></div>\n                    </div>\n                </div>\n                <div class=\"right\">\n                    <a class=\"toggle-link\" href=\"#\" (click)=\"togglePanel()\">{{toggleText}}</a>\n                </div>\n            </div>\n            <elevation-chart></elevation-chart>\n        </div>\n    ",
                        directives: [common_1.NgClass, chart_component_1.ElevationChart],
                        styles: ["\n        .infopanel {\n            position: absolute;\n            display: flex;\n            flex-direction: column;\n            height: 300px;\n            width: 100%;\n            left: 0px;\n            bottom: -244px; /* 300px (chart-height) - 56px (header-height) */\n            background-color: #fff;\n            color: #222;\n            z-index: 9999;\n            transition: all 0.25s ease-in-out;\n        }\n        \n        .elevation-header {\n            background-color: #f1f1f1;\n            color: #222;\n            font-family: 'Open Sans', 'Arial', 'Helvetica';\n            padding: 0 10px;\n            display: flex;\n        }\n\n        .infopanel.show {\n            bottom: 0;\n        }\n        \n        .left, .right {\n            width: 50%;\n            display: flex;\n        }\n\n        .right {\n            -webkit-justify-content: flex-end;\n            justify-content: flex-end;\n        }\n        \n        .item {\n            width: 140px;\n            height: 56px;  /* 3.4em */\n        }\n        \n        .value {\n            font-size: 1.5em;\n            line-height: 1.6em;\n        }\n        \n        .label {\n            font-size: 0.8em;\n            line-height: 0.4em;\n        }\n        \n        .toggle-link {\n            font-size: 0.8em;\n            line-height: 4em;\n        }\n    "],
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    }), 
                    __metadata('design:paramtypes', [])
                ], InfoPanel);
                return InfoPanel;
            }());
            exports_1("InfoPanel", InfoPanel);
        }
    }
});
//# sourceMappingURL=infopanel.component.js.map