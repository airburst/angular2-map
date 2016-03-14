import {Component, EventEmitter, Input, Output} from 'angular2/core';
import {Route} from './route';

@Component({
    selector: 'app-header',
    template: `
        <div class="stats">
            <div class="text" *ngIf="route.points.length > 0">
                {{route.name}} &nbsp;&nbsp;&nbsp; Ascent: {{route.ascent | number:'1.1-2'}} m &nbsp;&nbsp;&nbsp;
                Descent: {{route.descent | number:'1.1-2'}} m &nbsp;&nbsp;&nbsp; Distance: {{route.distance | number:'1.1-2'}}
                km
            </div>
            <div class="form">
                <button id="clear" (click)="clear.emit()">Clear Route</button>
                <button id="delete" (click)="removeLast()">Remove last WP</button>
                <label for="file">Load GPX or TCX File:</label>
                <input id="file" type="file" (change)="fileChange($event)">
            </div>
        </div>
    `
})

export class AppHeader {
    @Input() route: Route;
    @Output() clear = new EventEmitter();
}