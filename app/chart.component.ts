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

    private route: Route;
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

        let x = d3.scale.linear().range([0, width]);
        let y = d3.scale.linear().range([height, 0]);
        let xAxis = d3.svg.axis().scale(x).orient("bottom");
        let yAxis = d3.svg.axis().scale(y).orient("left");

        let area = d3.svg.area()
            .x(function(d) { return x(d[0]); })
            .y0(height)
            .y1(function(d) { return y(d[1]); })
            .interpolate('basis');

        let el: any = this.elementRef.nativeElement;
        let graph: any = d3.select(el);

        let svg = graph.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, function(d) { return d[0]; }));
        y.domain([0, d3.max(data, function(d) { return +d[1]; })]);

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
    }

    // setAxes(data: any[]) {
    //     this.x.domain(d3.extent(data, function(d) { return d[0]; }));
    //     this.y.domain([0, d3.max(data, function(d) { return +d[1]; })]);
    // }

    // updateData(data: any[]) {
    //     let el:any    = this.elementRef.nativeElement;
    //     let graph:any = d3.select(el);
    //     this.setAxes(data);
    //     let svg = graph.transition();
    //     svg.select(".area").duration(this.transitionTime).attr("d", this.area(data));
    //     svg.select(".x.axis").duration(this.transitionTime).call(this.xAxis);
    //     svg.select(".y.axis").duration(this.transitionTime).call(this.yAxis);
    // }

}