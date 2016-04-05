/// <reference path="../typings/d3.d.ts"/>
import {Component, EventEmitter, ElementRef} from 'angular2/core';
import {NgClass} from 'angular2/common';
import * as d3 from 'd3';
import {Store} from '@ngrx/store';
import {Route, AppStore} from './route';
import {flatten} from './utils/utils';

@Component({
    selector: 'elevation-chart',
    template: `
        <svg [ngClass]="{hidden: hideSVG}" attr.width="{{width}}" attr.height="{{height}}">
            <g attr.transform="translate({{margin.left}},{{margin.top}})">
                <path class="area"></path>
                <rect class="event-layer" x="0" y="0" attr.width="{{chartWidth}}" attr.height="{{chartHeight}}"
                    (mousemove)="hover($event)"></rect>
                <g class="x axis">
                    <path class="domain"></path>
                    <text class="x label" style="text-anchor: end;">Distance (km)</text>
                </g>
                <g class="y axis">
                    <path class="domain"></path>
                    <text class="y label" style="text-anchor: end;">Elevation (m)</text>
                </g>
            </g>
        </svg>
    `,
    directives: [NgClass],
    styles: [`
        .hidden {
            display: none;
        }
    `]
})

export class ElevationChart {

    constructor(
        public elementRef: ElementRef,
        public store: Store<AppStore>
    ) {
        this.width = parseInt(d3.select('.chart').style('width'));
        this.chartWidth = this.width - this.margin.left - this.margin.right;
        this.chartHeight = 244 - this.margin.top - this.margin.bottom;

        // Subscribe to changes in elevation observable        
        this.route = new Route(store);
        this.route.elevation$.subscribe((v) => {
            this.data = this.addDistanceToData(flatten(v));
            this.update();
        });
    }

    private route: Route;
    private data: any[];
    private hideSVG: boolean;
    private x: any;
    private y: any;
    private xAxis: any;
    private yAxis: any;
    private area: any;
    private width: number;
    private chartWidth: number;
    private height: number = 244;
    private chartHeight: number;
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

    update() {
        this.hideSVG = (this.data.length === 0) ? true : false;
        let el: any = this.elementRef.nativeElement;
        let graph: any = d3.select(el);

        this.x = d3.scale.linear().range([0, this.chartWidth]);
        this.y = d3.scale.linear().range([this.chartHeight, 0]);
        this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");
        this.yAxis = d3.svg.axis().scale(this.y).orient("left");
        this.x.domain(d3.extent(this.data, function(d) { return d[0]; }));
        this.y.domain([0, d3.max(this.data, function(d) { return +d[1]; })]);
        
        this.area = d3.svg.area()
            .x(function(d) { return this.x(d[0]); })
            .y0(this.chartHeight)
            .y1(function(d) { return this.y(d[1]); })
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
        
        let svg = graph.transition();
        
        if (this.data.length > 0) {
            svg.select(".area").duration(this.transitionTime).attr("d", this.area(this.data));
            svg.select(".x.axis").duration(this.transitionTime).call(this.xAxis);
            svg.select(".y.axis").duration(this.transitionTime).call(this.yAxis);
        }
    }
    
    hover(ev) {
        console.log(ev.clientX, ev.clientY);
    }

}