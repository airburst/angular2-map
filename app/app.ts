import {Component, EventEmitter, OnInit} from 'angular2/core';
import {FORM_DIRECTIVES, Control} from 'angular2/common';
import {RouteParams, Router} from 'angular2/router';
import {FileService} from './services/file.service';
import {ScriptLoadService} from './services/scriptload.service';
import {StorageService} from './services/storage.service';
import {ElevationService} from './google/elevation.service';
import {DirectionsService} from './google/directions.service';
import {GpxService} from './osmaps/gpx.service';
import {OsMap} from './osmaps/osmap';
import {AppHeader} from './header.component';
import {InfoPanel} from './infopanel.component';
import {SearchResults} from './search.results.component';
import {GazetteerService} from './osmaps/gazetteer';
import {RouteObserver, Route, AppStore} from './models/route';
import {settings} from './config/config';
import {Store} from '@ngrx/store';
import {SET_TRACK, REMOVE_LAST_SEGMENT, CLEAR_TRACK} from './reducers/track';
import {SET_ELEVATION, REMOVE_ELEVATION, CLEAR_ELEVATION} from './reducers/elevation';
import {SET_DETAILS, UPDATE_DETAILS, CLEAR_DETAILS, TOGGLE_ROADS} from './reducers/details';
import {SET_RESULTS, CLEAR_RESULTS} from './reducers/gazetteer';

@Component({
    // selector: 'my-app',
    template: `
        <app-header [route]="route.details$ | async"
            (clear)="resetRoute()"
            (remove)="removeLast()"
            (save)="save()"
            (search)="search($event)"
            (import)="importFile($event)"
            (export)="exportFile($event)"
            (toggleRoads)="toggleRoads()"
        >
        </app-header>
        <search-results [results]="searchResults"
            (selected)="selectSearchResult($event)"
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
        StorageService,
        ElevationService,
        GazetteerService,
        DirectionsService
    ]
})

export class AppComponent implements OnInit {

    public osmap: OsMap;
    public route: RouteObserver;
    public searchResults: any[];
    private savedRoute: Route;
    private errorMessage: any = '';
    private routeId: string = '';

    constructor(
        public params: RouteParams,
        private gpxService: GpxService,
        private fileService: FileService,
        private scriptLoadService: ScriptLoadService,
        private storageService: StorageService,
        private elevationService: ElevationService,
        private directionsService: DirectionsService,
        private gazetteerService: GazetteerService,
        public store: Store<AppStore>
    ) {
        this.route = new RouteObserver(store);
        this.searchResults = [];
        // Get id parameter
        console.log(this.params.get('id'))
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
                
                // Watch for search results
                this.route.searchResults$.subscribe((results) => {
                    this.handleSearchResults(results);
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
                ev.target.value = null;  // Empty the file input so that it can detect changes
            });
        }
    }
    
    exportFile() {
        let name = this.store.getState().details.name + '.gpx',
            gpx = this.gpxService.write();   
        this.fileService.save(gpx, name);
    }
    
    save() {
        console.log('Saving');
        let r = new Route(this.store.getState());
        this.storageService.saveRoute(r)
            .subscribe(
                route => this.savedRoute = route,
                error => this.errorMessage = <any>error
            );
    }
    
    clearRoute() {
        this.store.dispatch({ type: CLEAR_TRACK });
        this.store.dispatch({ type: CLEAR_ELEVATION });
        this.osmap.init();
    }
    
    resetRoute() {
        this.store.dispatch({ type: CLEAR_DETAILS });
        this.clearRoute();
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
        this.elevationService.getElevationDataWithThrottle(segment);
    }

    search(place: string) {
        if (place !== '') { this.gazetteerService.searchPostcode(place); }
    }
    
    handleSearchResults(results) {
        if (results.length === 1) {
            this.selectSearchResult(results[0]);
        } else {
            this.searchResults = results;
        }
    }

    selectSearchResult(selected) {
        this.store.dispatch({
            type: UPDATE_DETAILS,
            payload: { easting: selected.location.lon, northing: selected.location.lat }
        });
        this.store.dispatch({ type: CLEAR_RESULTS });   // Empty the search results
        this.clearRoute();
    }

}
