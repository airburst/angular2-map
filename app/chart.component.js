System.register(['angular2/core', 'angular2/common', 'd3', '@ngrx/store', './route', './utils/utils'], function(exports_1, context_1) {
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
    var core_1, common_1, d3, store_1, route_1, utils_1;
    var ElevationChart;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (d3_1) {
                d3 = d3_1;
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
                function ElevationChart(elementRef, store) {
                    var _this = this;
                    this.elementRef = elementRef;
                    this.store = store;
                    this.height = 244;
                    this.margin = { top: 10, right: 10, bottom: 20, left: 40 };
                    this.transitionTime = 250;
                    this.width = parseInt(d3.select('.chart').style('width'));
                    this.chartWidth = this.width - this.margin.left - this.margin.right;
                    this.chartHeight = 244 - this.margin.top - this.margin.bottom;
                    // Subscribe to changes in elevation observable        
                    this.route = new route_1.Route(store);
                    this.route.elevation$.subscribe(function (v) {
                        _this.data = _this.addDistanceToData(utils_1.flatten(v));
                        _this.factor = _this.data.length / _this.chartWidth;
                        _this.update();
                    });
                }
                ElevationChart.prototype.addDistanceToData = function (elevation) {
                    var averageDistance = this.store.getState().details.distance / elevation.length, chartData = [];
                    elevation.forEach(function (ele, i) {
                        chartData.push([averageDistance * i, ele]);
                    });
                    return chartData;
                };
                ElevationChart.prototype.update = function () {
                    this.hideSVG = (this.data.length === 0) ? true : false;
                    var el = this.elementRef.nativeElement;
                    var graph = d3.select(el);
                    this.x = d3.scale.linear().range([0, this.chartWidth]);
                    this.y = d3.scale.linear().range([this.chartHeight, 0]);
                    this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");
                    this.yAxis = d3.svg.axis().scale(this.y).orient("left");
                    this.x.domain(d3.extent(this.data, function (d) { return d[0]; }));
                    this.y.domain([0, d3.max(this.data, function (d) { return +d[1]; })]);
                    this.area = d3.svg.area()
                        .x(function (d) { return this.x(d[0]); })
                        .y0(this.chartHeight)
                        .y1(function (d) { return this.y(d[1]); })
                        .interpolate('basis');
                    d3.select('.x.axis')
                        .attr('transform', 'translate(0,' + this.chartHeight + ')')
                        .call(this.xAxis);
                    d3.select('.x.label')
                        .attr('x', this.chartWidth)
                        .attr('y', -10);
                    d3.select('.y.axis').call(this.yAxis);
                    d3.select('.y.label')
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em");
                    var svg = graph.transition();
                    if (this.data.length > 0) {
                        svg.select(".area").duration(this.transitionTime).attr("d", this.area(this.data));
                        svg.select(".x.axis").duration(this.transitionTime).call(this.xAxis);
                        svg.select(".y.axis").duration(this.transitionTime).call(this.yAxis);
                    }
                };
                ElevationChart.prototype.hover = function (ev) {
                    var x = ev.clientX - this.margin.left, index = Math.floor(x * this.factor), point = this.data[index];
                    d3.select('#focusLineX')
                        .attr('x1', x).attr('y1', 0)
                        .attr('x2', x).attr('y2', this.chartHeight);
                    console.log(point[1]); //
                };
                ElevationChart = __decorate([
                    core_1.Component({
                        selector: 'elevation-chart',
                        template: "\n        <svg [ngClass]=\"{hidden: hideSVG}\" attr.width=\"{{width}}\" attr.height=\"{{height}}\">\n            <g attr.transform=\"translate({{margin.left}},{{margin.top}})\">\n                <path class=\"area\"></path>\n                <rect class=\"event-layer\" x=\"0\" y=\"0\" attr.width=\"{{chartWidth}}\" attr.height=\"{{chartHeight}}\"\n                    (mousemove)=\"hover($event)\"></rect>\n                <line class=\"focusLine\" id=\"focusLineX\"></line>\n                <g class=\"x axis\">\n                    <path class=\"domain\"></path>\n                    <text class=\"x label\" style=\"text-anchor: end;\">Distance (km)</text>\n                </g>\n                <g class=\"y axis\">\n                    <path class=\"domain\"></path>\n                    <text class=\"y label\" style=\"text-anchor: end;\">Elevation (m)</text>\n                </g>\n            </g>\n        </svg>\n    ",
                        directives: [common_1.NgClass],
                        styles: ["\n        .hidden {\n            display: none;\n        }\n        \n        .focusLine {\n            fill: none;\n            stroke: steelblue;\n            stroke-width: 0.5px;\n        }\n    "]
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, store_1.Store])
                ], ElevationChart);
                return ElevationChart;
            }());
            exports_1("ElevationChart", ElevationChart);
        }
    }
});
//# sourceMappingURL=chart.component.js.map