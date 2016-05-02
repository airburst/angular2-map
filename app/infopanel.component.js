System.register(['angular2/core', 'angular2/common', './chart.component', '@ngrx/store', './models/route'], function(exports_1, context_1) {
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
    var core_1, common_1, chart_component_1, store_1, route_1;
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
            },
            function (store_1_1) {
                store_1 = store_1_1;
            },
            function (route_1_1) {
                route_1 = route_1_1;
            }],
        execute: function() {
            InfoPanel = (function () {
                function InfoPanel(store) {
                    var _this = this;
                    this.store = store;
                    this.recalc = new core_1.EventEmitter();
                    this.show = false;
                    this.calculating = false;
                    this.doneCalculating = false;
                    this.setToggleText();
                    this.recalcDuration = 0;
                    this.remainingTime = 0;
                    this.period = 2000;
                    this.routeObserver = new route_1.RouteObserver(store);
                    this.routeObserver.details$.subscribe(function (v) {
                        _this.checkForRecalc(v);
                    });
                }
                InfoPanel.prototype.recalculateElevation = function () {
                    this.calculating = true;
                    this.recalc.emit({ value: 'true' });
                };
                InfoPanel.prototype.checkForRecalc = function (details) {
                    if ((details.recalculateTime !== this.recalcDuration) && (details.recalculateTime !== 0)) {
                        this.startCountdown(details.recalculateTime);
                    }
                };
                InfoPanel.prototype.startCountdown = function (startTime, period) {
                    if (period) {
                        this.period = period;
                    }
                    this.recalcDuration = startTime;
                    this.remainingTime = startTime - this.period / 1000;
                    this.cancelCountdown = setInterval(this.updateRemainingTime.bind(this), 1000);
                };
                InfoPanel.prototype.updateRemainingTime = function () {
                    this.remainingTime -= 1;
                    if (this.remainingTime <= 0) {
                        this.stopCountdown();
                    }
                };
                InfoPanel.prototype.stopCountdown = function () {
                    clearInterval(this.cancelCountdown);
                    this.calculating = false;
                    this.doneCalculating = true;
                    this.recalcDuration = 0;
                };
                InfoPanel.prototype.togglePanel = function () {
                    this.show = !this.show;
                    this.setToggleText();
                };
                InfoPanel.prototype.setToggleText = function () {
                    this.toggleText = (this.show) ? 'Elevation On' : 'Elevation Off';
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], InfoPanel.prototype, "route", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], InfoPanel.prototype, "recalc", void 0);
                InfoPanel = __decorate([
                    core_1.Component({
                        selector: 'infopanel',
                        template: "\n        <div class=\"infopanel\" [ngClass]=\"{show: show}\">\n            <div class=\"elevation-header\">\n                <div class=\"left\">\n                \n                    <div class=\"item\">\n                        <div class=\"value\">{{route.distance | number:'1.1-2'}} km</div>\n                        <div class=\"label\">Distance</div>\n                    </div>\n                    \n                    <div class=\"item\">\n                        <div class=\"value\">{{route.ascent}} m</div>\n                        <div class=\"label\">Height Gain</div>\n                    </div>\n                    \n                    <div *ngIf=\"!route.hasNewElevation && !calculating &&!doneCalculating\" class=\"item\">\n                        <div class=\"value\">\n                            <a  class=\"header-link\" href=\"#\" title=\"recalculate elevation\" \n                                (click)=\"recalculateElevation(); false;\">Recalculate\n                            </a>\n                        </div>\n                    </div>\n                    \n                    <div *ngIf=\"calculating\" class=\"item\">\n                        <div class=\"value\">{{remainingTime}} s</div>\n                    </div>\n                    \n                </div>\n                <div class=\"right\">\n                    <a class=\"toggle-link\" href=\"#\" (click)=\"togglePanel(); false;\">\n                        <div class=\"centre-container\">\n                            <div class=\"toggle-text\">{{toggleText}}</div>\n                        </div>\n                        <div class=\"centre-container\">\n                            <div class=\"icon\" [ngClass]=\"{'icon-down': show, 'icon-up': !show}\"></div>\n                        </div>\n                    </a>\n                </div>\n            </div>\n            <div class=\"chart\">\n                <elevation-chart></elevation-chart>\n            </div>\n        </div>\n    ",
                        directives: [common_1.NgClass, chart_component_1.ElevationChart],
                        styles: ["\n        .infopanel {\n            position: absolute;\n            display: flex;\n            flex-direction: column;\n            height: 300px;\n            width: 100%;\n            left: 0px;\n            bottom: -244px; /* 300px (chart-height) - 56px (header-height) */\n            background-color: #222;\n            opacity: 0.9;\n            color: #white;\n            z-index: 9999;\n            box-shadow: 2px 5px 5px 8px rgba(0,0,0,.10),\n                2px 5px 10px 1px rgba(0,0,0,.098),\n                2px 3px 14px 2px rgba(0,0,0,.084);\n            transition: all 0.25s ease-in-out;\n        }\n        \n        .elevation-header {\n            /*background-color: #00695C;*/\n            background-color: #222;\n            font-family: 'Roboto', 'Arial', 'Helvetica';\n            padding: 0 10px;\n            display: flex;\n        }\n        .elevation-header,\n        .toggle-link,\n        .header-link { color: white; }\n\n        .infopanel.show {\n            bottom: 0;\n        }\n        \n        .left, .right {\n            width: 50%;\n            display: flex;\n        }\n\n        .right {\n            -webkit-justify-content: flex-end;\n            justify-content: flex-end;\n        }\n        \n        .item {\n            width: 140px;\n            height: 56px;  /* 3.4em */\n        }\n        \n        .value {\n            font-size: 1.5em;\n            line-height: 1.6em;\n        }\n        \n        .label {\n            font-size: 0.8em;\n            line-height: 0.4em;\n        }\n        \n        .toggle-link {\n            font-size: 1.2em;\n            line-height: 3em;\n            text-decoration: none;\n            display: flex;\n            flex-direction: row;\n        }\n        .centre-container {\n            display: flex;\n            flex-direction: column;\n            justify-content: center;\n        }\n        .toggle-text {\n            display: inline-block;\n        }\n        .icon {\n            display: inline-block;\n            text-indent: -9999px;\n            width: 24px;\n            height: 24px;\n            background-size: 24px 24px;\n        }\n        .icon-clear { background: url(dist/assets/images/icons/ic_close_white_24px.svg); }\n        .icon-up { background: url(dist/assets/images/icons/ic_arrow_drop_up_white_24px.svg); }\n        .icon-down { background: url(dist/assets/images/icons/ic_arrow_drop_down_white_24px.svg); }\n    "]
                    }), 
                    __metadata('design:paramtypes', [store_1.Store])
                ], InfoPanel);
                return InfoPanel;
            }());
            exports_1("InfoPanel", InfoPanel);
        }
    }
});
//# sourceMappingURL=infopanel.component.js.map