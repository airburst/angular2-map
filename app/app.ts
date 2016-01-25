import {Component, EventEmitter, OnInit} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {FileService} from './services/file.service';
import {GpxService} from './services/gpx.service';

@Component({
    selector: 'my-app',
    template: `
        <div>
            Load GPX File:
            <input type="file" (change)="fileChange($event)">
        </div>
        <div>
            <h2>Route</h2>
            <p>Name: {{route.name}}</p>
            <p>Total Ascent: {{route.ascent}}</p>
            <p>Total Descent: {{route.descent}}</p>
        </div>
        `,
    directives: [FORM_DIRECTIVES],
    providers: [GpxService, FileService]
})

export class AppComponent {
    constructor(private gpxService: GpxService, private fileService: FileService) { }

    route: any = '';
    totalAscent: number = 0;
    totalDescent: number = 0;
    
    // File load handler
    fileChange($event) {
        // Convert gpx file into json
        this.fileService.ReadTextFile($event.target, (data) => {
            this.route = this.gpxService.import(data);
        });
    }

}
