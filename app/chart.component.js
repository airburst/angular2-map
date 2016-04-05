System.register(['angular2/core', 'd3', '@ngrx/store', './route', './utils/utils'], function(exports_1, context_1) {
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
    var core_1, d3, store_1, route_1, utils_1;
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
            },
            function (route_1_1) {
                route_1 = route_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            ElevationChart = (function () {
                function ElevationChart(elementRef, ngZone, store) {
                    var _this = this;
                    this.elementRef = elementRef;
                    this.store = store;
                    this.width = parseInt(d3.select('.chart').style('width'));
                    this.margin = { top: 10, right: 10, bottom: 20, left: 40 };
                    this.transitionTime = 250;
                    this.data = [];
                    this.init(this.data);
                    // Subscribe to changes in elevation observable        
                    this.route = new route_1.Route(store);
                    this.route.elevation$.subscribe(function (v) {
                        _this.data = _this.addDistanceToData(utils_1.flatten(v));
                        _this.updateData(_this.data);
                    });
                }
                ElevationChart.prototype.addDistanceToData = function (elevation) {
                    var averageDistance = this.store.getState().details.distance / elevation.length, chartData = [];
                    elevation.forEach(function (ele, i) {
                        chartData.push([averageDistance * i, ele]);
                    });
                    return chartData;
                };
                ElevationChart.prototype.init = function (data) {
                    var width = this.width - this.margin.left - this.margin.right, height = 244 - this.margin.top - this.margin.bottom;
                    this.x = d3.scale.linear().range([0, width]);
                    this.y = d3.scale.linear().range([height, 0]);
                    this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");
                    this.yAxis = d3.svg.axis().scale(this.y).orient("left");
                    this.area = d3.svg.area()
                        .x(function (d) { return this.x(d[0]); })
                        .y0(height)
                        .y1(function (d) { return this.y(d[1]); })
                        .interpolate('basis');
                    var el = this.elementRef.nativeElement;
                    var graph = d3.select(el);
                    var svg = graph.append('svg')
                        .attr('width', width + this.margin.left + this.margin.right)
                        .attr('height', height + this.margin.top + this.margin.bottom)
                        .append('g')
                        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
                    this.setAxes(data);
                    // Area plot
                    svg.append('path')
                        .datum(data)
                        .attr('class', 'area')
                        .attr('d', this.area);
                    // Crosshairs - event layer
                    svg.append('rect')
                        .attr('class', 'event-layer')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('width', width)
                        .attr('height', height)
                        .attr('mousemove', console.log(event));
                    // X axis
                    svg.append('g')
                        .attr('class', 'x axis')
                        .attr('transform', 'translate(0,' + height + ')')
                        .call(this.xAxis)
                        .append('text')
                        .attr('class', 'x label')
                        .attr('text-anchor', 'end')
                        .attr('x', width)
                        .attr('y', -10)
                        .text('Distance (km)');
                    // Y axis
                    svg.append("g")
                        .attr("class", "y axis")
                        .call(this.yAxis)
                        .append("text")
                        .attr("class", "y label")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("Elevation (m)");
                };
                ElevationChart.prototype.setAxes = function (data) {
                    this.x.domain(d3.extent(data, function (d) { return d[0]; }));
                    this.y.domain([0, d3.max(data, function (d) { return +d[1]; })]);
                };
                ElevationChart.prototype.updateData = function (data) {
                    var el = this.elementRef.nativeElement;
                    var graph = d3.select(el);
                    this.setAxes(data);
                    var svg = graph.transition();
                    svg.select(".area").duration(this.transitionTime).attr("d", this.area(data));
                    svg.select(".x.axis").duration(this.transitionTime).call(this.xAxis);
                    svg.select(".y.axis").duration(this.transitionTime).call(this.yAxis);
                };
                ElevationChart = __decorate([
                    core_1.Component({
                        selector: 'elevation-chart',
                        template: ""
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.NgZone, store_1.Store])
                ], ElevationChart);
                return ElevationChart;
            }());
            exports_1("ElevationChart", ElevationChart);
        }
    }
});
//# sourceMappingURL=chart.component.js.map