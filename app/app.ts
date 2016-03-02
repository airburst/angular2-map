import {Component, EventEmitter, OnInit} from 'angular2/core';
import {FORM_DIRECTIVES, Control} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
//import {Map} from 'immutable';
import {FileService} from './services/file.service';
import {ScriptLoadService} from './services/scriptload.service';
import {ElevationService} from './google/elevation.service';
import {GpxService} from './osmaps/gpx.service';
import {OsMap} from './osmaps/osmap';
import {GazetteerService} from './osmaps/gazetteer';
import {Route, MapPoint} from './route';
import {settings} from './config/config';

@Component({
    selector: 'my-app',
    templateUrl: '/app/app.template.html',
    directives: [FORM_DIRECTIVES, OsMap],
    providers: [GpxService, FileService, ScriptLoadService, ElevationService, GazetteerService]
})

export class AppComponent implements OnInit {
    constructor(
        private gpxService: GpxService,
        private fileService: FileService,
        private scriptLoadService: ScriptLoadService,
        private elevationService: ElevationService,
        private gazetteerService: GazetteerService
    ) {
        this.route = new Route();
        this.osmap = new OsMap();
        this.distance = 0;
        this.path = [];
    }

    route: Route;
    path: MapPoint[];
    distance: number;
    osmap: OsMap;

    // Lazy load OpenSpace and Google scripts and initialise map canvas
    ngOnInit() {
        this.fileService.setAllowedExtensions(['tcx', 'gpx']);
        let scripts = [settings.osMapUrl(), settings.gMapUrl],
            loadPromises = scripts.map(this.scriptLoadService.load);

        Promise.all(loadPromises)
            .then((value) => {
                this.osmap.init();
                this.elevationService.init();
            }, function(value) {
                console.error('Script not found:', value)
            });
    }

    fileChange($event) {
        if (this.fileService.supports($event.target)) {
            // TODO: wrap in a try-catch and throw exception if we cannot read file
            this.fileService.readTextFile($event.target, (...data) => {
                this.route = this.gpxService.read(data);
                this.distance = this.osmap.calculateDistanceInKm(this.route.points);
                
                // Change centre of map
                let centre = this.osmap.convertToOsMapPoint(this.route.centre());
                this.osmap.centreMap(centre.x, centre.y, this.route.getZoomLevel());

                // Plot path and markers
                this.osmap.draw(this.route);
            });
        }
    }

    search($event) {
        let place: string = $event.target.value;
        if (place !== '') {
            this.gazetteerService.searchPostcode(place, this.showSearchResults);
        }
    }

    showSearchResults(results, type) {
        console.log('Results in App:', type, results);
    }

}
