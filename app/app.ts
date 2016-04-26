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
import {SearchResults} from './search.results.component';
import {GazetteerService} from './osmaps/gazetteer';
import {Route, RouteDetails, AppStore, boundingRectangle} from './route';
import {settings} from './config/config';
import {Store} from '@ngrx/store';
import {SET_TRACK, REMOVE_LAST_SEGMENT, CLEAR_TRACK} from './reducers/track';
import {SET_ELEVATION, REMOVE_ELEVATION, CLEAR_ELEVATION} from './reducers/elevation';
import {SET_DETAILS, UPDATE_DETAILS, CLEAR_DETAILS, TOGGLE_ROADS} from './reducers/details';
import {SET_RESULTS, CLEAR_RESULTS} from './reducers/gazetteer';

@Component({
    selector: 'my-app',
    template: `
        <app-header [route]="route.details$ | async"
            (clear)="clearRoute()"
            (remove)="removeLast()"
            (save)="save()"
            (search)="search($event)"
            (import)="importFile($event)"
            (export)="exportFile($event)"
            (toggleRoads)="toggleRoads()"
        >
        </app-header>
        <search-results [results]="searchResults"
            (selected)="selectedSearchLocation(location)"
        ></search-results>
        <map></map>
        <infopanel [route]="route.details$ | async"
            (recalc)="recalculateElevation()"
        >
        </infopanel>
        `,
    directives: [FORM_DIRECTIVES, OsMap, AppHeader, InfoPanel, SearchResults],
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
    public searchResults: any[];

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
        this.searchResults = [];
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
                this.route.searchResults$.subscribe((results) => {
                    this.showSearchResults(results);
                });
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
    
    exportFile() {
        let name = this.store.getState().details.name + '.gpx',
            gpx = this.gpxService.write();   
        this.fileService.save(gpx, name);
    }
    
    save() {
        console.log(this.store.getState());
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
    
    toggleRoads() {
        this.store.dispatch({ type: TOGGLE_ROADS });
    }

    recalculateElevation() {
        let segment = this.store.getState().track[0];
        segment.hasElevationData = false;
        this.store.dispatch({ type: CLEAR_ELEVATION });
        this.elevationService.getElevationData(segment);
    }

    search(ev) {
        let place: string = ev.target.value;
        if (place !== '') {
            this.gazetteerService.searchPostcode(place);
        }
    }

    selectedSearchLocation(location) {
        this.store.dispatch({
            type: UPDATE_DETAILS,
            payload: { easting: location.lat, northing: location.lon }
        });
    }    

    showSearchResults(results) {
        this.searchResults = results;
        console.log('Results in App:', results);
    }

}
