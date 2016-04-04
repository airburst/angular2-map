import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy} from 'angular2/core';
import {Segment} from './route';

@Component({
    selector: 'app-header',
    template: `
        <div class="stats">
            <div class="left">OS Route Planner</div>
            <div class="right">
                <button id="clear" (click)="clear.emit()">Clear Route</button>
                <button id="delete" (click)="remove.emit()">Remove WayPoint</button>
                <button id="save" (click)="save.emit()">Save</button>
                <label for="file">Load GPX or TCX File:</label>
                <input id="file" type="file" (change)="import.emit($event)">
            </div>
        </div>
    `,
    styles: [`
        .stats {
            background-color: #f1f1f1;
            color: #222;
            font-family: 'Open Sans', 'Arial', 'Helvetica';
            line-height: 2em;
            position: absolute;
            top: 0;
            z-index: 999;
            width: 100%;
            padding: 10px;
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

        .header-link {
            color: white;
            text-decoration-style: dashed;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppHeader {
    @Input() route: Segment[];
    @Output() clear = new EventEmitter();
    @Output() remove = new EventEmitter();
    @Output() import = new EventEmitter();
    @Output() save = new EventEmitter();
}