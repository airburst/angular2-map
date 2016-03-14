import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy} from 'angular2/core';
import {Point} from './route';

@Component({
    selector: 'app-header',
    template: `
        <div class="stats">
            <div class="text">
                {{route.length}} &nbsp;&nbsp;&nbsp; Ascent: {{route.ascent | number:'1.1-2'}} m &nbsp;&nbsp;&nbsp;
                Descent: {{route.descent | number:'1.1-2'}} m &nbsp;&nbsp;&nbsp; Distance: {{route.distance | number:'1.1-2'}}
                km
            </div>
            <div class="form">
                <button id="clear" (click)="clear.emit()">Clear Route</button>
                <button id="delete" (click)="remove.emit()">Remove WayPoint</button>
                <label for="file">Load GPX or TCX File:</label>
                <input id="file" type="file" (change)="fileChange($event)">
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppHeader {
    @Input() route: Point[];
    @Output() clear = new EventEmitter();
    @Output() remove = new EventEmitter();
}