import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
// import {ADD_ELEVATION, REMOVE_ELEVATION, CLEAR_ELEVATION} from './reducers/elevation';
// import {UPDATE_SEGMENT} from './reducers/track';
// import {UPDATE_DETAILS} from './reducers/details';

export interface Point {
    lat: number;
    lon: number;
    ele?: number;   //TODO - remove from POint
}

export interface WayPoint {
    point: Point;
    trackPointsCount: number;
}

export interface Marker {
    point: Point;
    name: string;
}

export interface MapPoint {
    x: number;
    y: number;
}

export interface Segment {
    id: string;
    waypoint: Point;
    track: Array<Point>;
    hasElevationData: boolean;
}

export interface RouteDetails {
    name: string;
    distance: number;
    ascent: number;
    descent: number;
    easting?: number;
    northing?: number;
    zoom?: number;
    followsRoads: boolean;
    isImported: boolean;
}

export interface AppStore {
    details: RouteDetails;
    track: Segment[];
    elevation: any[];
    markers: Marker[];
}  

export class Route {
    public details$: Observable<RouteDetails>;
    public track$: Observable<Array<Segment>>;
    public elevation$: Observable<Array<any>>;
    
    constructor(store: Store<AppStore>) {
        this.details$ = store.select('details');
        this.track$ = store.select('track');
        this.elevation$ = store.select('elevation');
    }
    
    // private setBounds(point: Point): void {
    //     this.minLat = Math.min(this.minLat, point.lat);
    //     this.maxLat = Math.max(this.maxLat, point.lat);
    //     this.minLon = Math.min(this.minLon, point.lon);
    //     this.maxLon = Math.max(this.maxLon, point.lon);
    //     this.diagonal = this.distanceBetween(this.minLat, this.minLon, this.maxLat, this.maxLon);
    // }

    // public centre(): Point {
    //     return {
    //         lat: this.minLat + ((this.maxLat - this.minLat) / 2),
    //         lon: this.minLon + ((this.maxLon - this.minLon) / 2)
    //     }
    // }
    
    // Return distance (km) between two points
    // private distanceBetween(lat1: number, lon1: number, lat2: number, lon2: number): number {
    //     let p = 0.017453292519943295;    // Math.PI / 180
    //     let c = Math.cos;
    //     let a = 0.5 - c((lat2 - lat1) * p) / 2 +
    //         c(lat1 * p) * c(lat2 * p) *
    //         (1 - c((lon2 - lon1) * p)) / 2;
    //     return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    // }

    // public getZoomLevel(): number {
    //     let distance = this.diagonal;
    //     if (distance <= 0) { return 10; }
    //     let z = 10;
    //     distance = distance / 1.5;
    //     while (((distance / Math.pow(2, 10 - z)) > 1) && (z > 0)) {
    //         z -= 1;
    //     }
    //     return z + 1;
    // }
}
