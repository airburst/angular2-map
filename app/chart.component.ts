import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy} from 'angular2/core';
import {NgClass} from 'angular2/common';

@Component({
    selector: 'chart',
    template: `
        <div class="elevation-chart" [ngClass]="{show: show}">
            <div class="elevation-header">
                <a class="toggle" href="#" (click)="togglePanel()">{{toggleText}}</a>
            </div>
            <div class="elevation-graph"></div>
        </div>
    `,
    directives: [NgClass],
    styles: [`
        .elevation-chart {
            position: absolute;
            display: inline-block;
            height: 300px;
            width: 100%;
            left: 0px;
            bottom: -250px;
            background-color: #fff;
            color: #222;
            z-index: 9999;
            transition: all 0.25s ease-in-out;
        }
        
        .elevation-header {
            height: 40px;
            background-color: #f1f1f1;
            padding: 5px;
            text-align: right;
            vertical-align: middle;
        }

        .elevation-chart.show {
            bottom: 0;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class Chart {
    //@Input() elevation: number[];

    private show: boolean;
    private toggleText: string;
    
    constructor() {
        this.show = true;
        this.toggleText = (this.show) ? 'Elevation On' : 'Elevation Off';
    }
    
    togglePanel() {
        this.show = !this.show;
        this.toggleText = (this.show) ? 'Elevation On' : 'Elevation Off';
    }
    
}