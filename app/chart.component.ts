import {Component, EventEmitter, Input, OnInit} from 'angular2/core';
import {CHART_DIRECTIVES} from 'ng2-charts';
import {Store} from '@ngrx/store';
import {Route, AppStore} from './route';
import {flatten} from './utils/utils';

@Component({
    selector: 'elevation-chart',
    template: `
        <base-chart class="chart"
            [data]="lineChartData"
            [labels]="lineChartLabels"
            [options]="lineChartOptions"
            [series]="lineChartSeries"
            [colours]="lineChartColours"
            [legend]="lineChartLegend"
            [chartType]="lineChartType"
            (chartHover)="chartHovered($event)"
            (chartClick)="chartClicked($event)"
            ></base-chart>
    `,
    styles: [`
        .chart {
            display: flex;
            height: 234px;
            padding: 5px 10px;
        }
    `],
    directives: [CHART_DIRECTIVES]
})

export class ElevationChart {
    
    constructor(
        public store: Store<AppStore>
    ) {
        this.route = new Route(store);
        this.route.elevation$.subscribe((v) => {
            this.setData(flatten(v));
        });
    }

    private route;
    private lineChartData: Array<any> = [[]];
    private lineChartLabels: Array<any> = [];
    private lineChartSeries: Array<any> = ['Test'];
    private lineChartOptions: any = {
        maintainAspectRatio: false,
        showTooltips: false,
        animation: false,
        responsive: true,
        pointDot : false
    };
    private lineChartColours: Array<any> = [{
        fillColor: 'rgba(148,159,177,0.3)',
        strokeColor: 'rgba(148,159,177,0.3)'
    }];
    private lineChartLegend: boolean = false;
    private lineChartType: string = 'Line';
    private numberOfDistanceTicks = 10;
    
    setData(elevations) {
        let averageDistance = this.store.getState().details.distance / elevations.length,
            chartData: number[] = [],
            labels: any[] = [];
        elevations.forEach((ele, i) => {
            chartData.push(ele);
            labels.push(((i % this.numberOfDistanceTicks) === 0) ? averageDistance * i : '');
        });
        this.lineChartData = chartData;
        this.lineChartLabels = labels;
    }

    chartClicked(ev: any) {
        console.log('click: ', ev);
        
    }

    chartHovered(ev: any) {
        //console.log('hover: ', ev);
    }

}