import {Component, EventEmitter, Input, OnInit, ChangeDetectionStrategy} from 'angular2/core';
import {CHART_DIRECTIVES} from 'ng2-charts';
import {flatten} from './utils/utils';

@Component({
    selector: 'elevation-chart',
    template: `
        <base-chart class="chart"
            [data]="elevation"
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
    directives: [CHART_DIRECTIVES],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ElevationChart {

    @Input() elevation;
    
    constructor() { }

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

    chartClicked(ev: any) {
        console.log('click: ', ev);
    }

    chartHovered(ev: any) {
        //console.log('hover: ', ev);
    }

}