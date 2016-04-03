System.register(['angular2/core', 'ng2-charts', '@ngrx/store', './route', './utils/utils'], function(exports_1, context_1) {
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
    var core_1, ng2_charts_1, store_1, route_1, utils_1;
    var ElevationChart;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (ng2_charts_1_1) {
                ng2_charts_1 = ng2_charts_1_1;
            },
            function (store_1_1) {
                store_1 = store_1_1;
            },
            function (route_1_1) {
                route_1 = route_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            ElevationChart = (function () {
                function ElevationChart(store) {
                    var _this = this;
                    this.store = store;
                    this.lineChartData = [[]];
                    this.lineChartLabels = [];
                    this.lineChartSeries = ['Test'];
                    this.lineChartOptions = {
                        maintainAspectRatio: false,
                        showTooltips: false,
                        animation: false,
                        responsive: true,
                        pointDot: false
                    };
                    this.lineChartColours = [{
                            fillColor: 'rgba(148,159,177,0.3)',
                            strokeColor: 'rgba(148,159,177,0.3)'
                        }];
                    this.lineChartLegend = false;
                    this.lineChartType = 'Line';
                    this.numberOfDistanceTicks = 10;
                    this.route = new route_1.Route(store);
                    this.route.elevation$.subscribe(function (v) {
                        _this.setData(utils_1.flatten(v));
                    });
                }
                ElevationChart.prototype.setData = function (elevations) {
                    var _this = this;
                    var averageDistance = this.store.getState().details.distance / elevations.length, chartData = [], labels = [];
                    elevations.forEach(function (ele, i) {
                        chartData.push(ele);
                        labels.push(((i % _this.numberOfDistanceTicks) === 0) ? averageDistance * i : '');
                    });
                    this.lineChartData = chartData;
                    this.lineChartLabels = labels;
                };
                ElevationChart.prototype.chartClicked = function (ev) {
                    console.log('click: ', ev);
                };
                ElevationChart.prototype.chartHovered = function (ev) {
                    //console.log('hover: ', ev);
                };
                ElevationChart = __decorate([
                    core_1.Component({
                        selector: 'elevation-chart',
                        template: "\n        <base-chart class=\"chart\"\n            [data]=\"lineChartData\"\n            [labels]=\"lineChartLabels\"\n            [options]=\"lineChartOptions\"\n            [series]=\"lineChartSeries\"\n            [colours]=\"lineChartColours\"\n            [legend]=\"lineChartLegend\"\n            [chartType]=\"lineChartType\"\n            (chartHover)=\"chartHovered($event)\"\n            (chartClick)=\"chartClicked($event)\"\n            ></base-chart>\n    ",
                        styles: ["\n        .chart {\n            display: flex;\n            height: 234px;\n            padding: 5px 10px;\n        }\n    "],
                        directives: [ng2_charts_1.CHART_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [store_1.Store])
                ], ElevationChart);
                return ElevationChart;
            }());
            exports_1("ElevationChart", ElevationChart);
        }
    }
});
//# sourceMappingURL=chart.component.js.map