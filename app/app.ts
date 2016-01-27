import {Component, EventEmitter, OnInit} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {FileService} from './services/file.service';
import {ScriptLoadService} from './services/scriptload.service';
import {ElevationService} from './google/elevation.service';
import {GpxService} from './osmaps/gpx.service';
import {OsMap} from './osmaps/osmap';
import {MapPoint} from './route';
import {settings} from './config/config';

@Component({
    selector: 'my-app',
    template: `
        <div>
            Load GPX File:
            <input type="file" (change)="fileChange($event)">
        </div>
        <div class="stats">
            Name: {{route.name}}
                &nbsp;&nbsp;|&nbsp;&nbsp;
                Total Ascent: {{route.ascent | number:'1.1-2'}} m
                &nbsp;&nbsp;|&nbsp;&nbsp;
                Total Descent: {{route.descent | number:'1.1-2'}} m
                &nbsp;&nbsp;|&nbsp;&nbsp;
                Distance: {{distance | number:'1.1-2'}} km
        </div>
        <map></map>
        `,
    directives: [FORM_DIRECTIVES, OsMap],
    providers: [GpxService, FileService, ScriptLoadService, ElevationService],
    styles: [`
        .stats {
            background-color: #222;
            color: #fff;
            font-family: 'Open Sans', 'Arial', 'Helvetica';
            line-height: 2em;
            padding: 10px;
        }
    `]
})

export class AppComponent implements OnInit {
    constructor(
        private gpxService: GpxService,
        private fileService: FileService,
        private scriptLoadService: ScriptLoadService,
        private elevationService: ElevationService
    ) { }
    
    route: any = {};
    path: MapPoint[] = [];
    distance: number = 0;
    map: OsMap = new OsMap;

    // Load OS and Google scripts and initialise map canvas
    ngOnInit() {
        let scripts = [settings.osMapUrl(), settings.gMapUrl],
            loadPromises = scripts.map(this.scriptLoadService.load);
        Promise.all(loadPromises)
            .then((value) => {
                //TODO: Test for OpenSpace unavailable in Window object
                this.map.init();
                this.elevationService.init();    // Doesn't do much yet
            }, function(value) {
                console.error('Script not found:', value)
            });
    }
    
    // File load handler
    fileChange($event) {
        // Convert gpx file into json
        this.fileService.ReadTextFile($event.target, (data) => {
            this.route = this.gpxService.read(data);
            this.distance = this.map.getDistance(this.route.points);
            
            // Change centre of map
            let centre = this.map.convertToMapPoint(this.route.centre);
            this.map.centreMap(centre.x, centre.y, this.route.zoom);
            
            // Plot path and markers
            this.map.drawPath(this.route);
        });
    }

}
