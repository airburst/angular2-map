import {Component, EventEmitter, OnInit} from 'angular2/core';
import {FORM_DIRECTIVES, Control} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {FileService} from './services/file.service';
import {ScriptLoadService} from './services/scriptload.service';
import {ElevationService} from './google/elevation.service';
import {DirectionsService} from './google/directions.service';
import {GpxService} from './osmaps/gpx.service';
import {OsMap} from './osmaps/osmap';
import {AppHeader} from './header.component';
import {GazetteerService} from './osmaps/gazetteer';
import {Segment, AppStore} from './route';
import {settings} from './config/config';
import {Store} from '@ngrx/store';
import {SET_TRACK, ADD_SEGMENT, UPDATE_SEGMENT, REMOVE_LAST_SEGMENT, CLEAR_TRACK} from './reducers/track';
import {SET_ELEVATION, ADD_ELEVATION, REMOVE_ELEVATION, CLEAR_ELEVATION} from './reducers/elevation';

@Component({
    selector: 'my-app',
    template: `
        <app-header [route]="track | async"
            (clear)="clearRoute()"
            (remove)="removeLast()"
            (load)="fileChange($event)"
        >
        </app-header>
        <map></map>
        `,
    directives: [FORM_DIRECTIVES, OsMap, AppHeader],
    providers: [
        GpxService,
        FileService,
        ScriptLoadService,
        ElevationService,
        GazetteerService,
        DirectionsService
    ]
})

export class AppComponent implements OnInit {
    constructor(
        private gpxService: GpxService,
        private fileService: FileService,
        private scriptLoadService: ScriptLoadService,
        private elevationService: ElevationService,
        private directionsService: DirectionsService,
        private gazetteerService: GazetteerService,
        public store: Store<AppStore>
    ) {
        this.track = store.select('track');
    }

    osmap: OsMap;
    track: Observable<Array<Segment>>;

    // Lazy load OpenSpace and Google scripts and initialise map canvas
    ngOnInit() {
        this.fileService.setAllowedExtensions(['tcx', 'gpx']);
        let scripts = [settings.osMapUrl(), settings.gMapUrl],
            loadPromises = scripts.map(this.scriptLoadService.load);

        Promise.all(loadPromises)
            .then((value) => {
                this.directionsService.init();
                this.elevationService.init();
                this.osmap = new OsMap(this.directionsService, this.store);
                this.osmap.init();
            }, function(value) {
                console.error('Script not found:', value)
            });
    }

    fileChange($event) {
        if (this.fileService.supports($event.target)) {
            this.fileService.readTextFile($event.target, (...data) => {    
                //this.osmap.route = this.gpxService.read(data);
                //this.store.dispatch({ type: SET, payload: this.osmap.route });
                //this.osmap.drawWholeRoute();
            });
        }
    }

    clearRoute() {
        this.store.dispatch({ type: CLEAR_TRACK });
        this.store.dispatch({ type: CLEAR_ELEVATION });       
    }

    removeLast() {
        this.store.dispatch({ type: REMOVE_LAST_SEGMENT });
        this.store.dispatch({ type: REMOVE_ELEVATION });  
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
