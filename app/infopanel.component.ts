import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {ElevationChart} from './chart.component';
import {Segment} from './route';

@Component({
    selector: 'infopanel',
    template: `
        <div class="infopanel" [ngClass]="{show: show}">
            <div class="elevation-header">
                <div class="left">
                    <div class="item">
                        <div class="value">{{route.distance | number:'1.1-2'}} km</div>
                        <div class="label">Distance</div>
                    </div>
                    <div class="item">
                        <div class="value">{{route.ascent}} m</div>
                        <div class="label">Height Gain <a *ngIf="!route.hasNewElevation" class="header-link" href="#" title="recalculate elevation" (click)="recalc.emit()">Recalculate</a></div>
                    </div>
                </div>
                <div class="right">
                    <a class="toggle-link" href="#" (click)="togglePanel()">{{toggleText}}</a>
                </div>
            </div>
            <elevation-chart></elevation-chart>
        </div>
    `,
    directives: [NgClass, ElevationChart],
    styles: [`
        .infopanel {
            position: absolute;
            display: flex;
            flex-direction: column;
            height: 300px;
            width: 100%;
            left: 0px;
            bottom: -244px; /* 300px (chart-height) - 56px (header-height) */
            background-color: #fff;
            color: #222;
            z-index: 9999;
            transition: all 0.25s ease-in-out;
        }
        
        .elevation-header {
            background-color: #f1f1f1;
            color: #222;
            font-family: 'Open Sans', 'Arial', 'Helvetica';
            padding: 0 10px;
            display: flex;
        }

        .infopanel.show {
            bottom: 0;
        }
        
        .left, .right {
            width: 50%;
            display: flex;
        }

        .right {
            -webkit-justify-content: flex-end;
            justify-content: flex-end;
        }
        
        .item {
            width: 140px;
            height: 56px;  /* 3.4em */
        }
        
        .value {
            font-size: 1.5em;
            line-height: 1.6em;
        }
        
        .label {
            font-size: 0.8em;
            line-height: 0.4em;
        }
        
        .toggle-link {
            font-size: 0.8em;
            line-height: 4em;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InfoPanel {
    @Input() route: Segment[];
    //@Input() elevation: number[];
    @Output() recalc = new EventEmitter();

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