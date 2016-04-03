/// <reference path="../typings/d3.d.ts"/>
import {Component, EventEmitter, Input, OnInit, ElementRef} from 'angular2/core';
import * as d3 from 'd3';
import {Store} from '@ngrx/store';
import {Route, AppStore} from './route';
import {flatten} from './utils/utils';

@Component({
    selector: 'elevation-chart',
    template: ``
})

export class ElevationChart {

    constructor(
        public elementRef: ElementRef,
        public store: Store<AppStore>
    ) {
        this.init([

        ]);
        this.route = new Route(store);
        this.route.elevation$.subscribe((v) => {
            this.updateData(this.addDistanceToData(flatten(v)));
        });
    }

    private route: Route;
    private x: any;
    private y: any;
    private xAxis: any;
    private yAxis: any;
    private area: any;
    private transitionTime: number = 250;

    addDistanceToData(elevation: any[]): any[] {
        let averageDistance = this.store.getState().details.distance / elevation.length,
            chartData: any[] = [];
        elevation.forEach((ele, i) => {
            chartData.push([averageDistance * i, ele]);
        });
        return chartData;
    }

    init(data) {
        let margin = { top: 10, right: 10, bottom: 20, left: 40 },
            width = 1920 - margin.left - margin.right,
            height = 234 - margin.top - margin.bottom;

        this.x = d3.scale.linear().range([0, width]);
        this.y = d3.scale.linear().range([height, 0]);
        this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");
        this.yAxis = d3.svg.axis().scale(this.y).orient("left");

        this.area = d3.svg.area()
            .x(function(d) { return this.x(d[0]); })
            .y0(height)
            .y1(function(d) { return this.y(d[1]); })
            .interpolate('basis');

        let el: any = this.elementRef.nativeElement;
        let graph: any = d3.select(el);

        let svg = graph.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.setAxes(data);

        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", this.area);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(this.xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(this.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Elevation (m)");
    }

    setAxes(data: any[]) {
        this.x.domain(d3.extent(data, function(d) { return d[0]; }));
        this.y.domain([0, d3.max(data, function(d) { return +d[1]; })]);
    }

    updateData(data: any[]) {
        let el:any    = this.elementRef.nativeElement;
        let graph:any = d3.select(el);
        
        this.setAxes(data);
        let svg = graph.transition();
        svg.select(".area").duration(this.transitionTime).attr("d", this.area(data));
        svg.select(".x.axis").duration(this.transitionTime).call(this.xAxis);
        svg.select(".y.axis").duration(this.transitionTime).call(this.yAxis);
    }

}