import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy} from '@angular/core';
import {NgClass} from '@angular/common';
import {ElevationChart} from './chart.component';
import {Segment} from './models/route';
import {Store} from '@ngrx/store';
import {UPDATE_DETAILS} from './reducers/details';
import {RouteObserver, AppStore} from './models/route';

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
                        <div class="label">Height Gain</div>
                    </div>
                    
                    <div *ngIf="!route.hasNewElevation && !calculating" class="item">
                        <div class="value">
                            <a  class="header-link" href="#" title="recalculate elevation" 
                                (click)="recalculateElevation(); false;">Recalculate
                            </a>
                        </div>
                    </div>
                    
                    <div *ngIf="calculating" class="item">
                        <div class="value">{{remainingTime}} s</div>
                    </div>
                    
                </div>
                <div class="right">
                    <a class="toggle-link" href="#" (click)="togglePanel(); false;">
                        <div class="centre-container">
                            <div class="toggle-text">{{toggleText}}</div>
                        </div>
                        <div class="centre-container">
                            <div class="icon" [ngClass]="{'icon-down': show, 'icon-up': !show}"></div>
                        </div>
                    </a>
                </div>
            </div>
            <div class="chart">
                <elevation-chart></elevation-chart>
            </div>
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
            background-color: #222;
            opacity: 0.9;
            color: #white;
            z-index: 9999;
            box-shadow: 2px 5px 5px 8px rgba(0,0,0,.10),
                2px 5px 10px 1px rgba(0,0,0,.098),
                2px 3px 14px 2px rgba(0,0,0,.084);
            transition: all 0.25s ease-in-out;
        }
        
        .elevation-header {
            /*background-color: #00695C;*/
            background-color: #222;
            font-family: 'Roboto', 'Arial', 'Helvetica';
            padding: 0 10px;
            display: flex;
        }
        .elevation-header,
        .toggle-link,
        .header-link { color: white; }

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
            font-size: 1.2em;
            line-height: 3em;
            text-decoration: none;
            display: flex;
            flex-direction: row;
        }
        .centre-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .toggle-text {
            display: inline-block;
        }
        .icon {
            display: inline-block;
            text-indent: -9999px;
            width: 24px;
            height: 24px;
            background-size: 24px 24px;
        }
        .icon-clear { background: url(dist/assets/images/icons/ic_close_white_24px.svg); }
        .icon-up { background: url(dist/assets/images/icons/ic_arrow_drop_up_white_24px.svg); }
        .icon-down { background: url(dist/assets/images/icons/ic_arrow_drop_down_white_24px.svg); }
    `]
})

export class InfoPanel {
    @Input() route: any;
    @Output() recalc = new EventEmitter();

    private show: boolean;
    private toggleText: string;
    private calculating: boolean;
    //private doneCalculating: boolean;
    private recalcDuration: number;
    private remainingTime: number;
    private period: number;
    private cancelCountdown: number;
    private routeObserver: RouteObserver;

    constructor(public store: Store<AppStore>) {
        this.show = false;
        this.calculating = false;
        this.setToggleText();
        this.recalcDuration = 0;
        this.remainingTime = 0;
        this.period = 2000;
        this.routeObserver = new RouteObserver(store);
        
        this.routeObserver.details$.subscribe((v) => {
            this.checkForRecalc(v);
        });
    }

    recalculateElevation() {
        this.calculating = true;
        this.recalc.emit({value: 'true'});
    }

    checkForRecalc(details: any) {
        if ((details.recalculateTime !== this.recalcDuration) && (details.recalculateTime !== 0)) {
            this.startCountdown(details.recalculateTime);
        }
    }
    
    startCountdown(startTime: number, period?: number) {
        if (period) { this.period = period; }
        this.recalcDuration = startTime;
        this.remainingTime = startTime - this.period / 1000;
        this.cancelCountdown = setInterval(this.updateRemainingTime.bind(this), 1000 );
    }

    updateRemainingTime() {
        this.remainingTime -= 1;
        if (this.remainingTime <= 0) { this.stopCountdown(); }
    }

    stopCountdown() {
        clearInterval(this.cancelCountdown);
        this.calculating = false;
        this.recalcDuration = 0;
    }
    
    togglePanel() {
        this.show = !this.show;
        this.setToggleText()
    }

    setToggleText() {
        this.toggleText = (this.show) ? 'Elevation On' : 'Elevation Off';
    }

}