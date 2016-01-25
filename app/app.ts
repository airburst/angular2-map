import {Component, EventEmitter, OnInit} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {FileService} from './services/file.service';
import {GpxService} from './services/gpx.service';
import {ScriptLoadService} from './services/scriptload.service';
import {OsMap} from './osmaps/osmap';

@Component({
    selector: 'my-app',
    template: `
        <div>
            Load GPX File:
            <input type="file" (change)="fileChange($event)">
        </div>
        <div>
            <h2>Route</h2>
            <p>Name: {{route.name}}
                &nbsp;&nbsp;|&nbsp;&nbsp;
                Total Ascent: {{route.ascent | number:'1.1-2'}} m
                &nbsp;&nbsp;|&nbsp;&nbsp;
                Total Descent: {{route.descent | number:'1.1-2'}} m</p>
        </div>
        <map></map>
        `,
    directives: [FORM_DIRECTIVES, OsMap],
    providers: [GpxService, FileService, ScriptLoadService]
})

export class AppComponent implements OnInit {
    constructor(
        private gpxService: GpxService,
        private fileService: FileService,
        private scriptLoadService: ScriptLoadService
    ) { }
    
    route: any = {};
    totalAscent: number = 0;
    totalDescent: number = 0;
    map: OsMap;

    // Load OS script and initialise map canvas
    ngOnInit() {
        let vm = this;  // So we can bind the map to app scope
        this.scriptLoadService.load('http://openspace.ordnancesurvey.co.uk/osmapapi/openspace.js?key=A73F02BD5E3B3B3AE0405F0AC8602805')
            .then(function(value) {
                vm.map = new OsMap;
                vm.map.init();
            }, function(value) {
                console.error('Script not found:', value)
            });
    }
    
    // File load handler
    fileChange($event) {
        // Convert gpx file into json
        this.fileService.ReadTextFile($event.target, (data) => {
            this.route = this.gpxService.import(data);
            
            // Test - change centre of map
            this.map.easting = 380000;
            this.map.centreMap();
        });
    }

}
