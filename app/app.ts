import {Component, EventEmitter, OnInit} from 'angular2/core';
import {FORM_DIRECTIVES, Control} from 'angular2/common';
import {FileService} from './services/file.service';
import {ScriptLoadService} from './services/scriptload.service';
import {ElevationService} from './google/elevation.service';
import {DirectionsService} from './google/directions.service';
import {GpxService} from './osmaps/gpx.service';
import {OsMap} from './osmaps/osmap';
import {AppHeader} from './header.component';
import {InfoPanel} from './infopanel.component';
import {GazetteerService} from './osmaps/gazetteer';
import {Route, RouteDetails, AppStore, boundingRectangle} from './route';
import {settings} from './config/config';
import {Store} from '@ngrx/store';
import {SET_TRACK, REMOVE_LAST_SEGMENT, CLEAR_TRACK} from './reducers/track';
import {SET_ELEVATION, REMOVE_ELEVATION, CLEAR_ELEVATION} from './reducers/elevation';
import {SET_DETAILS, UPDATE_DETAILS, CLEAR_DETAILS} from './reducers/details';

@Component({
    selector: 'my-app',
    template: `
        <app-header [route]="route.details$ | async"
            (clear)="clearRoute()"
            (remove)="removeLast()"
            (save)="save()"
            (import)="importFile($event)"
        >
        </app-header>
        <map></map>
        <infopanel [route]="route.details$ | async"
            (recalc)="recalculateElevation()"
        >
        </infopanel>
        `,
    directives: [FORM_DIRECTIVES, OsMap, AppHeader, InfoPanel],
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

    public osmap: OsMap;
    public route: Route;

    constructor(
        private gpxService: GpxService,
        private fileService: FileService,
        private scriptLoadService: ScriptLoadService,
        private elevationService: ElevationService,
        private directionsService: DirectionsService,
        private gazetteerService: GazetteerService,
        public store: Store<AppStore>
    ) {
        this.route = new Route(store);
    }

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

    importFile(ev) {
        if (this.fileService.supports(ev.target)) {
            this.fileService.readTextFile(ev.target, (...data) => {
                this.gpxService.read(data);
                this.osmap.centreAndSetMapEvents();
                this.osmap.removeMapEvents();
            });
        }
    }
    
    save() {
        console.log(JSON.stringify(this.store.getState()));
    }

    clearRoute() {
        this.store.dispatch({ type: CLEAR_TRACK });
        this.store.dispatch({ type: CLEAR_ELEVATION });
        this.store.dispatch({ type: CLEAR_DETAILS });
        this.osmap.init();
    }

    removeLast() {
        this.store.dispatch({ type: REMOVE_LAST_SEGMENT });
        this.store.dispatch({ type: REMOVE_ELEVATION });
    }

    recalculateElevation() {
        let segment = this.store.getState().track[0];
        segment.hasElevationData = false;
        this.elevationService.getElevationData(segment);
    }

    search(ev) {
        let place: string = ev.target.value;
        if (place !== '') {
            this.gazetteerService.searchPostcode(place, this.showSearchResults);
        }
    }

    showSearchResults(results, type) {
        console.log('Results in App:', type, results);
    }

}
