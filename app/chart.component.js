System.register(['angular2/core', 'd3', '@ngrx/store'], function(exports_1, context_1) {
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
    var core_1, d3, store_1;
    var ElevationChart;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (d3_1) {
                d3 = d3_1;
            },
            function (store_1_1) {
                store_1 = store_1_1;
            }],
        execute: function() {
            ElevationChart = (function () {
                function ElevationChart(elementRef, store) {
                    this.elementRef = elementRef;
                    this.store = store;
                    this.transitionTime = 250;
                    this.init([
                        [0, 95],
                        [0.2, 100],
                        [0.4, 102],
                        [0.6, 107],
                        [0.8, 110],
                        [1, 98]
                    ]);
                    // this.route = new Route(store);
                    // this.route.elevation$.subscribe((v) => {
                    //     this.updateData(this.addDistanceToData(flatten(v)));
                    // });
                }
                ElevationChart.prototype.addDistanceToData = function (elevation) {
                    var averageDistance = this.store.getState().details.distance / elevation.length, chartData = [];
                    elevation.forEach(function (ele, i) {
                        chartData.push([averageDistance * i, ele]);
                    });
                    return chartData;
                };
                ElevationChart.prototype.init = function (data) {
                    var margin = { top: 10, right: 10, bottom: 20, left: 40 }, width = 1920 - margin.left - margin.right, height = 234 - margin.top - margin.bottom;
                    var x = d3.scale.linear().range([0, width]);
                    var y = d3.scale.linear().range([height, 0]);
                    var xAxis = d3.svg.axis().scale(x).orient("bottom");
                    var yAxis = d3.svg.axis().scale(y).orient("left");
                    var area = d3.svg.area()
                        .x(function (d) { return x(d[0]); })
                        .y0(height)
                        .y1(function (d) { return y(d[1]); })
                        .interpolate('basis');
                    var el = this.elementRef.nativeElement;
                    var graph = d3.select(el);
                    var svg = graph.append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                    x.domain(d3.extent(data, function (d) { return d[0]; }));
                    y.domain([0, d3.max(data, function (d) { return +d[1]; })]);
                    svg.append("path")
                        .datum(data)
                        .attr("class", "area")
                        .attr("d", area);
                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);
                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("Elevation (m)");
                };
                ElevationChart = __decorate([
                    core_1.Component({
                        selector: 'elevation-chart',
                        template: ""
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