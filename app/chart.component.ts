/// <reference path="../typings/d3.d.ts"/>
import {Component, EventEmitter, ElementRef, NgZone} from 'angular2/core';
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
        ngZone: NgZone,
        public store: Store<AppStore>
    ) {
        this.data = [];
        this.init(this.data);

        // Subscribe to changes in elevation observable        
        this.route = new Route(store);
        this.route.elevation$.subscribe((v) => {
            this.data = this.addDistanceToData(flatten(v));
            this.updateData(this.data);
        });
    }

    private route: Route;
    private data: any[];
    private x: any;
    private y: any;
    private xAxis: any;
    private yAxis: any;
    private area: any;
    private width: number = parseInt(d3.select('.chart').style('width'));
    private margin: any = { top: 10, right: 10, bottom: 20, left: 40 };
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
        let width = this.width - this.margin.left - this.margin.right,
            height = 244 - this.margin.top - this.margin.bottom;

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

        let svg = graph.append('svg')
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
    }

    setAxes(data: any[]) {
        this.x.domain(d3.extent(data, function(d) { return d[0]; }));
        this.y.domain([0, d3.max(data, function(d) { return +d[1]; })]);
    }

    updateData(data: any[]) {
        let el: any = this.elementRef.nativeElement;
        let graph: any = d3.select(el);

        this.setAxes(data);
        let svg = graph.transition();
        svg.select(".area").duration(this.transitionTime).attr("d", this.area(data));
        svg.select(".x.axis").duration(this.transitionTime).call(this.xAxis);
        svg.select(".y.axis").duration(this.transitionTime).call(this.yAxis);
    }

}