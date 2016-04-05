import {Component, EventEmitter, Input, Output, ElementRef, ChangeDetectionStrategy} from 'angular2/core';
import {Segment} from './route';
import * as d3 from 'd3';

@Component({
    selector: 'app-header',
    template: `
        <div class="stats">
            <!--<div class="left">OS Route Planner</div>
            <div class="left">-->
                <a class="item" href="#" (click)="clear.emit()">
                    <div class="icon icon-clear"></div>
                    <span>Clear</span>
                </a>
                <a class="item" href="#" (click)="remove.emit()">
                    <div class="icon icon-undo"></div>
                    <span>Undo</span>
                </a>
                <a class="item" href="#" (click)="save.emit()">
                    <div class="icon icon-save"></div>
                    <span>Save</span>
                </a>
                <a class="item" href="#" (click)="fileTrigger()">
                    <div class="icon icon-save"></div>
                    <span>Import</span>
                    <label for="file" class="hidden">Load GPX or TCX File:</label>
                    <input class="hidden" id="file" type="file" (change)="import.emit($event)">
                </a>
            <!--</div>-->
        </div>
    `,
    styles: [`
        .stats {
            background-color: #f1f1f1;
            color: #222;
            font-family: 'Roboto', 'Arial', 'Helvetica';
            position: absolute;
            top: 0;
            z-index: 999;
            width: 100%;
            padding: 8px 0;
            display: flex;
            box-shadow: 0 5px 5px -3px rgba(0,0,0,.14),
                0 8px 10px 1px rgba(0,0,0,.098),
                0 3px 14px 2px rgba(0,0,0,.084);
        }

        .left {
            width: 25%;
            font-size: 1.6em;
            display: flex;
        }

        .right {
            width: 75%;
            display: flex;
            -webkit-justify-content: flex-end;
            justify-content: flex-end;
        }
        
        .item { 
            width: 50px;
            text-align: center;
            text-decoration: none;
            font-size: 0.8em;
            line-height: 1.2em;
            color: #666;
        }
        .item>div {
            margin-left: 13px;
            border: 0;
        }
        
        .icon {
            display: block;
            text-indent: -9999px;
            width: 24px;
            height: 24px;
            background-size: 24px 24px;
        }
        .icon-clear { background: url(dist/assets/images/icons/ic_close_black_24px.svg); }
        .icon-undo { background: url(dist/assets/images/icons/ic_undo_black_24px.svg); }
        .icon-save { background: url(dist/assets/images/icons/ic_cloud_upload_black_24px.svg); }
        
        .hidden { display: none; }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppHeader {
    @Input() route: Segment[];
    @Output() clear = new EventEmitter();
    @Output() remove = new EventEmitter();
    @Output() import = new EventEmitter();
    @Output() save = new EventEmitter();
    
    constructor(public elementRef: ElementRef) { }
    
    fileTrigger() {
        let el = this.elementRef.nativeElement;
        console.log(el);
    }
}