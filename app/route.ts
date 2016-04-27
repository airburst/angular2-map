import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {UPDATE_DETAILS} from './reducers/details';
import {LocationResult} from './models/os';

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
    easting?: number;
    northing?: number;
    lat?: number;
    lon?: number;
    zoom?: number;
    followsRoads: boolean;
    isEditable: boolean;
    hasNewElevation: boolean;
    selectedPointIndex: number;
}

export interface AppStore {
    details: RouteDetails;
    track: Segment[];
    elevation: any[];
    markers: Marker[];
    searchResults: LocationResult[];
}

export class Route {
    public details$: Observable<RouteDetails>;
    public track$: Observable<Array<Segment>>;
    public elevation$: Observable<Array<any>>;
    public searchResults$: Observable<Array<LocationResult>>;
    
    constructor(store: Store<AppStore>) {
        this.details$ = store.select('details');
        this.track$ = store.select('track');
        this.elevation$ = store.select('elevation');
        this.searchResults$ = store.select('results');
    }
}

export const boundingRectangle = (tracks: Array<Segment>) => {
    let b = Object.assign({}, initialBounds),
        dist: number = 0,
        lastPoint: Point = tracks[0].track[0],
        self = this;
        
    tracks.forEach(<Segment>(s) => {
        s.track.forEach((t) => {
            b.minLat = Math.min(b.minLat, t.lat);
            b.maxLat = Math.max(b.maxLat, t.lat);
            b.minLon = Math.min(b.minLon, t.lon);
            b.maxLon = Math.max(b.maxLon, t.lon);
            dist += distanceBetween(lastPoint.lat, lastPoint.lon, t.lat, t.lon);
            lastPoint = t;
        });
    });

    let mapCentre = centre(b.minLat, b.minLon, b.maxLat, b.maxLon),
        //diagonal = distanceBetween(b.minLat, b.minLon, b.maxLat, b.maxLon),
        zoom = getZoomLevel(b.minLat, b.minLon, b.maxLat, b.maxLon);
    return { lat: mapCentre.lat, lon: mapCentre.lon, zoom: zoom, distance: dist };
}

export const distance = (tracks: Array<Segment>) => {
    if (tracks.length === 0) { return 0; }
    let dist: number = 0,
        lastPoint: Point = (tracks[0].waypoint !== null) ? tracks[0].waypoint : tracks[0].track[0];

    tracks.forEach(<Segment>(s) => {
        s.track.forEach((t) => {
            dist += distanceBetween(lastPoint.lat, lastPoint.lon, t.lat, t.lon);
            lastPoint = t;
        });
    });
    return dist;
};

const initialBounds = {
    minLat: 1000000,
    minLon: 1000000,
    maxLat: -1000000,
    maxLon: -1000000
}

const centre = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    return {
        lat: lat1 + ((lat2 - lat1) / 2),
        lon: lon1 + ((lon2 - lon1) / 2)
    }
}

// Return distance (km) between two points
export const distanceBetween = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

const getZoomLevel = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    let toolbarHeight = 111,
        wHeight = window.innerHeight - toolbarHeight, 
        wWidth = window.innerWidth,
        pixelDensity,
        osPixelMap = [1, 2, 5, 10, 20, 40, 100, 200, 500, 1000],
        z = 1;
        
    // Establish box height and width
    let bHeight = distanceBetween(lat1, lon1, lat2, lon1),
        bWidth = distanceBetween(lat1, lon1, lat1, lon2);

    // Find out the minimum pixel density - height or width
    pixelDensity = Math.min((wHeight / bHeight), (wWidth / bWidth));
    while (pixelDensity > osPixelMap[z]) { z++; }
    return z;
}
