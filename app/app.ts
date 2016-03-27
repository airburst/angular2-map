import {Component, EventEmitter, OnInit} from 'angular2/core';
import {FORM_DIRECTIVES, Control} from 'angular2/common';
import {FileService} from './services/file.service';
import {ScriptLoadService} from './services/scriptload.service';
import {ElevationService} from './services/elevation.service';
import {DirectionsService} from './google/directions.service';
import {GpxService} from './osmaps/gpx.service';
import {OsMap} from './osmaps/osmap';
import {AppHeader} from './header.component';
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
            (load)="fileChange($event)"
            (recalc)="recalculateElevation()"
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
            
        // Set centre and zoom when route changes ===TODO: may want to move this into osmap
        this.route.track$.subscribe((t) => {
            let b = boundingRectangle(t);
            this.store.dispatch({
                type: UPDATE_DETAILS,
                payload: { lat: b.lat, lon: b.lon, zoom: b.zoom }
            });
        });
    }

    fileChange($event) {
        if (this.fileService.supports($event.target)) {
            this.fileService.readTextFile($event.target, (...data) => {    
                this.gpxService.read(data);
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
    
    recalculateElevation() {
        this.store.dispatch({ type: CLEAR_ELEVATION });
        let segment = this.route.track$.destination.value.track[0];
        segment.hasElevationData = false;
        this.elevationService.getElevationData(segment);
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
