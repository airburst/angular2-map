import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy} from 'angular2/core';
import {Segment} from './route';

@Component({
    selector: 'app-header',
    template: `
        <div class="stats">
            <div class="text">OS Route Planner</div>
            <div class="form">
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
            box-sizing: border-box;
        }

        .text {
            width: 50%;
            float: left;
            font-size: 1.6em;
        }

        .form {
            width: 50%;
            float: right;
            text-align: right;
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