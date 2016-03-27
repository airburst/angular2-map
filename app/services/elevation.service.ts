///<reference path="../../typings/window.extend.d.ts"/>
import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
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
    private gridProjection: any;
    private sampleSize: number;
    private route: Route;
    private elevationUrl: string = 'http://localhost/getOSElevation.php';

    constructor(
        public store: Store<AppStore>,
        private http: Http
    ) {
        this.results = [];
        this.sampleSize = 200;
        this.route = new Route(store);
    };

    init(): any {
        this.gridProjection = new window.OpenSpace.GridProjection();
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
        if ((segment !== undefined) && (!segment.hasElevationData) && (segment.track.length > 0)) {
            this.getElevationFromApi(segment);
        }
    };
    
    getElevationFromApi(segment: Segment) {
        let path = this.flattenRoute(segment.track);
        console.log(path)//
        if (path.length <= 1) {
            throw ('No elevation requested: too few points in path');
        } else {
            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            return this.http.post(this.elevationUrl, 'points=' + JSON.stringify(path), { headers: headers })
                .map(res => res.json())
                .subscribe(
                    data => this.updateStore(data, segment),
                    err => console.log(err),
                    () => console.log('Elevation fetch Complete')
                );
        }
    }

    // Flatten into an array of [easting, northing]
    flattenRoute(points: Point[]): Array<any> {
        return points.map((point) => {
            let mp = this.convertToOsMapPoint(point);
            return ([mp.x, mp.y]);
        });
    };
    
    convertToOsMapPoint(point: Point) {
        let mp = new window.OpenLayers.LonLat(point.lon, point.lat),
            mapPoint = this.gridProjection.getMapPointFromLonLat(mp);
        return new window.OpenLayers.Geometry.Point(mapPoint.lon, mapPoint.lat);
    };

    updateStore(data, segment) {
        console.log(data)//
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
