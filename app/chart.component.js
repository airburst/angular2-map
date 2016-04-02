System.register(['angular2/core', 'angular2/common'], function(exports_1, context_1) {
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
    var core_1, common_1;
    var Chart;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            Chart = (function () {
                function Chart() {
                    this.show = true;
                    this.toggleText = (this.show) ? 'Elevation On' : 'Elevation Off';
                }
                Chart.prototype.togglePanel = function () {
                    this.show = !this.show;
                    this.toggleText = (this.show) ? 'Elevation On' : 'Elevation Off';
                };
                Chart = __decorate([
                    core_1.Component({
                        selector: 'chart',
                        template: "\n        <div class=\"elevation-chart\" [ngClass]=\"{show: show}\">\n            <div class=\"elevation-header\">\n                <a class=\"toggle\" href=\"#\" (click)=\"togglePanel()\">{{toggleText}}</a>\n            </div>\n            <div class=\"elevation-graph\"></div>\n        </div>\n    ",
                        directives: [common_1.NgClass],
                        styles: ["\n        .elevation-chart {\n            position: absolute;\n            display: inline-block;\n            height: 300px;\n            width: 100%;\n            left: 0px;\n            bottom: -250px;\n            background-color: #fff;\n            color: #222;\n            z-index: 9999;\n            transition: all 0.25s ease-in-out;\n        }\n        \n        .elevation-header {\n            height: 40px;\n            background-color: #f1f1f1;\n            padding: 5px;\n            text-align: right;\n            vertical-align: middle;\n        }\n\n        .elevation-chart.show {\n            bottom: 0;\n        }\n    "],
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    }), 
                    __metadata('design:paramtypes', [])
                ], Chart);
                return Chart;
            }());
            exports_1("Chart", Chart);
        }
    }
});
//# sourceMappingURL=chart.component.js.map