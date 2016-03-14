import {Component, EventEmitter, Input, Output} from 'angular2/core';
import {IPoint} from './oroute';

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
                <button id="add" (click)="add.emit()">TEST Add</button>
                <label for="file">Load GPX or TCX File:</label>
                <input id="file" type="file" (change)="fileChange($event)">
            </div>
        </div>
    `
})

export class AppHeader {
    @Input() route: IPoint[];
    @Output() clear = new EventEmitter();
    @Output() remove = new EventEmitter();
    @Output() add = new EventEmitter();
}