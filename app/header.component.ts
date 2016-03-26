import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy} from 'angular2/core';
import {Segment} from './route';

@Component({
    selector: 'app-header',
    template: `
        <div class="stats">
            <div class="text">
                {{route.name}} &nbsp;&nbsp;&nbsp; Distance: {{route.distance | number:'1.1-2'}} km&nbsp;&nbsp;&nbsp;
                Ascent: {{route.ascent}} m&nbsp;
                <a href="#" title="recalculate elevation" (click)="recalc.emit()">Recalculate</a>
            </div>
            <div class="form">
                <button id="clear" (click)="clear.emit()">Clear Route</button>
                <button id="delete" (click)="remove.emit()">Remove WayPoint</button>
                <label for="file">Load GPX or TCX File:</label>
                <input id="file" type="file" (change)="load.emit($event)">
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppHeader {
    @Input() route: Segment[];
    @Output() clear = new EventEmitter();
    @Output() remove = new EventEmitter();
    @Output() load = new EventEmitter();
    @Output() recalc = new EventEmitter();
}