System.register(['angular2/core', 'angular2/common', 'ng2-charts/ng2-charts'], function(exports_1, context_1) {
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
    var core_1, common_1, ng2_charts_1;
    var ElevationChart;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (ng2_charts_1_1) {
                ng2_charts_1 = ng2_charts_1_1;
            }],
        execute: function() {
            ElevationChart = (function () {
                //@Input() elevation: number[];
                function ElevationChart() {
                    this.lineChartData = [
                        [65, 59, 80, 81, 56, 55, 40],
                        [28, 48, 40, 19, 86, 27, 90],
                        [18, 48, 77, 9, 100, 27, 40]
                    ];
                    this.lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
                    this.lineChartSeries = ['Series A', 'Series B', 'Series C'];
                    this.lineChartOptions = {
                        animation: false,
                        responsive: true,
                        multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>'
                    };
                    this.lineChartColours = [
                        {
                            fillColor: 'rgba(148,159,177,0.2)',
                            strokeColor: 'rgba(148,159,177,1)',
                            pointColor: 'rgba(148,159,177,1)',
                            pointStrokeColor: '#fff',
                            pointHighlightFill: '#fff',
                            pointHighlightStroke: 'rgba(148,159,177,0.8)'
                        },
                        {
                            fillColor: 'rgba(77,83,96,0.2)',
                            strokeColor: 'rgba(77,83,96,1)',
                            pointColor: 'rgba(77,83,96,1)',
                            pointStrokeColor: '#fff',
                            pointHighlightFill: '#fff',
                            pointHighlightStroke: 'rgba(77,83,96,1)'
                        },
                        {
                            fillColor: 'rgba(148,159,177,0.2)',
                            strokeColor: 'rgba(148,159,177,1)',
                            pointColor: 'rgba(148,159,177,1)',
                            pointStrokeColor: '#fff',
                            pointHighlightFill: '#fff',
                            pointHighlightStroke: 'rgba(148,159,177,0.8)'
                        }
                    ];
                    this.lineChartLegend = true;
                    this.lineChartType = 'Line';
                    console.log('bar demo');
                }
                // events
                ElevationChart.prototype.chartClicked = function (ev) {
                    console.log(ev);
                };
                ElevationChart.prototype.chartHovered = function (ev) {
                    console.log(ev);
                };
                ElevationChart = __decorate([
                    core_1.Component({
                        selector: 'elevation-chart',
                        template: "\n        <base-chart class=\"chart\"\n                [data]=\"lineChartData\"\n                [labels]=\"lineChartLabels\"\n                [options]=\"lineChartOptions\"\n                [series]=\"lineChartSeries\"\n                [colours]=\"lineChartColours\"\n                [legend]=\"lineChartLegend\"\n                [chartType]=\"lineChartType\"\n                (chartHover)=\"chartHovered($event)\"\n                (chartClick)=\"chartClicked($event)\"></base-chart>\n    ",
                        styles: ["\n        .chart {\n            display: flex;\n            height: 244px;\n        }\n    "],
                        directives: [ng2_charts_1.CHART_DIRECTIVES, common_1.NgClass, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [])
                ], ElevationChart);
                return ElevationChart;
            }());
            exports_1("ElevationChart", ElevationChart);
        }
    }
});
//# sourceMappingURL=chart.component.js.map