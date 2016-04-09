import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy} from 'angular2/core';
import {Segment} from './route';
import * as d3 from 'd3';

@Component({
    selector: 'app-header',
    inputs: ['route'],
    template: `
        <div class="stats">
            <div class="left">
                <div class="centre-container">
                    OS Route Planner
                </div>
            </div>
            <div class="right">
                <a class="item" href="#" (click)="clear.emit()">
                    <div class="icon icon-clear"></div>
                    <span>Clear</span>
                </a>
                <a class="item" href="#" (click)="remove.emit()">
                    <div class="icon icon-undo"></div>
                    <span>Undo</span>
                </a>
                <a class="item" href="#" (click)="toggleRoads.emit()">
                    <div class="icon icon-undo"></div>
                    <span *ngIf="route.followsRoads">Ride</span>
                    <span *ngIf="!route.followsRoads">Walk</span>
                </a>
                <!--<a class="item" href="#" (click)="save.emit()">
                    <div class="icon icon-save"></div>
                    <span>Save</span>
                </a>-->
                <a class="item" href="#" (click)="fileTrigger()">
                    <div class="icon icon-import"></div>
                    <span>Import</span>
                    <label for="file" class="hidden">Load GPX or TCX File:</label>
                    <input class="hidden" id="file" type="file" (change)="import.emit($event)">
                </a>
                <a class="item" href="#" (click)="export.emit()">
                    <div class="icon icon-export"></div>
                    <span>Export</span>
                </a>
            </div>
        </div>
    `,
    styles: [`
        .stats {
            background-color: #00695C;
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
        .stats, .item { color: white; }

        .left {
            width: 25%;
            padding-left: 8px;
            font-size: 1.6em;
            display: flex;
        }

        .right {
            width: 75%;
            padding-right: 8px;
            display: flex;
            -webkit-justify-content: flex-end;
            justify-content: flex-end;
        }
        
        .centre-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .item { 
            width: 50px;
            text-align: center;
            text-decoration: none;
            font-size: 0.8em;
            line-height: 1.2em;
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
        .icon-clear { background: url(dist/assets/images/icons/ic_close_white_24px.svg); }
        .icon-undo { background: url(dist/assets/images/icons/ic_undo_white_24px.svg); }
        .icon-save { background: url(dist/assets/images/icons/ic_save_white_24px.svg); }
        .icon-import { background: url(dist/assets/images/icons/ic_file_upload_white_24px.svg); }
        .icon-export { background: url(dist/assets/images/icons/ic_file_download_white_24px.svg); }

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
    @Output() export = new EventEmitter();
    @Output() toggleRoads = new EventEmitter();
    
    fileTrigger() {
        // Warning: NOT the Angular2 way to access the DOM!
        let f = window.document.getElementById('file');
        f.click();
    }
}