import {Component, EventEmitter, Input} from 'angular2/core';
import {CHART_DIRECTIVES} from 'ng2-charts';

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

    constructor() { }

    private lineChartData: Array<any> = [
        [65, 59, 80, 81, 56, 55, 40]
    ];
    private lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
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