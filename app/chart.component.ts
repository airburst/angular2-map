import {Component, EventEmitter, Input} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from 'angular2/common';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

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
                (chartClick)="chartClicked($event)"></base-chart>
    `,
    styles: [`
        .chart {
            display: flex;
            height: 244px;
        }
    `],
    directives: [CHART_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES]
})

export class ElevationChart {
    //@Input() elevation: number[];

    constructor() {
        console.log('bar demo');
    }

    private lineChartData: Array<any> = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90],
        [18, 48, 77, 9, 100, 27, 40]
    ];
    private lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    private lineChartSeries: Array<any> = ['Series A', 'Series B', 'Series C'];
    private lineChartOptions: any = {
        animation: false,
        responsive: true,
        multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>'
    };
    private lineChartColours: Array<any> = [
        { // grey
            fillColor: 'rgba(148,159,177,0.2)',
            strokeColor: 'rgba(148,159,177,1)',
            pointColor: 'rgba(148,159,177,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
            fillColor: 'rgba(77,83,96,0.2)',
            strokeColor: 'rgba(77,83,96,1)',
            pointColor: 'rgba(77,83,96,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(77,83,96,1)'
        },
        { // grey
            fillColor: 'rgba(148,159,177,0.2)',
            strokeColor: 'rgba(148,159,177,1)',
            pointColor: 'rgba(148,159,177,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(148,159,177,0.8)'
        }
    ];
    private lineChartLegend: boolean = true;
    private lineChartType: string = 'Line';

    // events
    chartClicked(ev: any) {
        console.log(ev);
    }

    chartHovered(ev: any) {
        console.log(ev);
    }

}