///<reference path="../../typings/window.extend.d.ts"/>
import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/do';
import 'rxjs/operator/catch';
import {Http, Response, Headers} from 'angular2/http';
import {chunk, flatten} from '../utils/utils';
import {Point, MapPoint, Segment, AppStore, Route} from '../route';
import {Store} from '@ngrx/store';
import {ADD_ELEVATION, REMOVE_ELEVATION, CLEAR_ELEVATION} from '../reducers/elevation';
import {UPDATE_SEGMENT} from '../reducers/track';
import {UPDATE_DETAILS} from '../reducers/details';

@Injectable()
export class ElevationService {

    public status: any;
    public results: any;
    private sampleSize: number;
    private route: Route;
    private SRTPUrl: string = 'http://localhost/getSRTMElevations.php';

    constructor(
        public store: Store<AppStore>,
        private http: Http
    ) {
        this.results = [];
        this.sampleSize = 200;
        this.route = new Route(store);
    };

    init(): any {
        // Subscribe to changes in the track and get elevation for 
        // the latest segment, if it hasn't already been processed
        this.route.track$.subscribe((v) => {
            this.getElevationData(v[v.length - 1]);
        });

        this.route.elevation$.subscribe((v) => {
            this.store.dispatch({
                type: UPDATE_DETAILS,
                payload: this.calculateElevation(flatten(v))
            });
        });
    };

    getElevationData(segment: Segment): void {
        let i,
            pathArray,
            path: Point[] = [],
            //elevationPromises,
            segmentElevation = [];

        if ((segment !== undefined) && (!segment.hasElevationData) && (segment.track.length > 0)) {
            path = this.flattenRoute(segment.track);
            this.getSRTPElevations(path, segment);
            // pathArray = chunk(path, this.sampleSize);
            // elevationPromises = pathArray.map(this.getSRTPElevations.bind(this));
            // Promise.all(elevationPromises)
            //     .then(function(response) {
            //         this.store.dispatch({
            //             type: ADD_ELEVATION,
            //             payload: flatten(response)
            //         });
            //         this.store.dispatch({
            //             type: UPDATE_SEGMENT,
            //             payload: { id: segment.id, hasElevationData: true }
            //         });
            //     }.bind(this), function(error) {
            //         console.log(error);
            //     });
        }
    };

    flattenRoute(points: Point[]): any {
        return points.map((point) => {
            return ([point.lat, point.lon]);
        });
    };

    getSRTPElevations(points: Array<any>, segment: Segment) {
        if (points.length <= 1) {
            throw ('No elevation requested: too few points in path');
        } else {
            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            return this.http.post(this.SRTPUrl, 'points=' + JSON.stringify(points), { headers: headers })
                .map(res => res.json())
                .subscribe(
                    data => this.updateStore(data, segment),
                    err => console.log(err),
                    () => console.log('Elevation fetch Complete')
                );
        }
    }
    
    updateStore(data, segment) {
        console.log(data)
        this.store.dispatch({
            type: ADD_ELEVATION,
            payload: flatten(data)
        });
        this.store.dispatch({
            type: UPDATE_SEGMENT,
            payload: { id: segment.id, hasElevationData: true }
        });
    }

    calculateElevation(elevations: Array<number>): any {
        let ascent: number = 0,
            lastElevation: number = elevations[0];

        elevations.forEach((e) => {
            ascent += (e > lastElevation) ? (e - lastElevation) : 0;
            lastElevation = e;
        });
        return { ascent: Math.floor(ascent) };
    }

}
