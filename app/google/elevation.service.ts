///<reference path="../../typings/window.extend.d.ts"/>
import {Injectable} from '@angular/core';
import {chunk, flatten, elevationData} from '../utils/utils';
import {Point, MapPoint, Segment, AppStore, RouteObserver} from '../models/route';
import {Store} from '@ngrx/store';
import {ADD_ELEVATION, REMOVE_ELEVATION, CLEAR_ELEVATION} from '../reducers/elevation';
import {UPDATE_SEGMENT} from '../reducers/track';
import {UPDATE_DETAILS} from '../reducers/details';

@Injectable()
export class ElevationService {

    public status: any;
    public results: any;
    private elevator: any;
    private sampleSize: number;
    private route: RouteObserver;
    private throttle: number = 2000;

    constructor(public store: Store<AppStore>) {
        this.results = [];
        this.elevator = {};
        this.sampleSize = 200;
        this.route = new RouteObserver(store);
    };

    init(): any {
        this.elevator = new window.google.maps.ElevationService();
        this.status = window.google.maps.ElevationStatus;

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
    
    getElevationDataWithThrottle(segment: Segment): void {
        this.clear();
        this.getElevationData(segment, true);
    }

    getElevationData(segment: Segment, isThrottled?: boolean): void {
        let i: number = 0,
            pathArray,
            path: Point[] = [],
            elevationPromises,
            segmentElevation = [],
            throttle = isThrottled ? this.throttle : 0,
            recalcTime,
            roadMode = this.store.getState().details.followsRoads;

        if ((segment !== undefined) && (!segment.hasElevationData) && (segment.track.length > 1)) {
            path = this.convertToGoogleRoute(segment.track);
            pathArray = chunk(path, this.sampleSize);
            
            // Publish recalculation estimate for infopanel to render
            recalcTime = pathArray.length * throttle / 1000;
            this.publishRecalcTime(recalcTime);

            elevationPromises = [];
            pathArray.forEach((p, i) => {
                elevationPromises.push(this.elevation(i * throttle, p))
            })

            Promise.all(elevationPromises)
                .then(function(response) {
                    let data = flatten(response);
                    this.store.dispatch({
                        type: ADD_ELEVATION,
                        payload: elevationData(data)
                    });
                    this.updateSegment(segment, data, roadMode);
                    this.store.dispatch({
                        type: UPDATE_DETAILS,
                        payload: { hasNewElevation: true }
                    });
                    this.publishRecalcTime(0);
                }.bind(this), function(error) {
                    console.log(error);
                });
        }
    };
    
    updateSegment(segment, data, roadMode) {
        if (roadMode) {
            this.store.dispatch({
                type: UPDATE_SEGMENT,
                payload: { id: segment.id, hasElevationData: true }
            });
        } else {
            // Replace the track with sampled points returned by Google
            this.store.dispatch({
                type: UPDATE_SEGMENT,
                payload: { 
                    id: segment.id, 
                    hasElevationData: true,
                    track: this.extractTrackFromElevationResponse(data)
                }
            });
        }
    }
    
    extractTrackFromElevationResponse(response): Point[] {
        return response.map((point) => {
            return { lat: point.location.lat(), lon: point.location.lng() }
        });
    };

    convertToGoogleRoute(points: Point[]): any {
        return points.map((point) => {
            return new window.google.maps.LatLng(point.lat, point.lon);
        });
    };

    elevation(delay: number, path: any): Promise<any> {
        let self = this,
            roadMode = self.store.getState().details.followsRoads;
            
        return new Promise(function(resolve, reject) {
            if (path.length <= 1) {
                reject('No elevation requested: too few points in path');
            }
            setTimeout(() => { self.elevator.getElevationAlongPath({
                    'path': path,
                    'samples': ((path.length < self.sampleSize) && roadMode) ? path.length : self.sampleSize
                }, function(results, status) {
                    if (status === self.status.OK) {
                        if (results[0]) {
                            resolve(results);
                        }
                        else
                            reject('No valid result was determined from the Google Elevation service. Please try again');
                    }
                    else
                        reject('Google Elevation service was not available. Please try again. ' + status);
                });
            }, delay);
            
        });
    };

    calculateElevation(elevations: Array<number>): any {
        let ascent: number = 0,
            lastElevation: number = elevations[0];

        elevations.forEach((e) => {
            ascent += (e > lastElevation) ? (e - lastElevation) : 0;
            lastElevation = e;
        });
        return { ascent: Math.floor(ascent) };
    }
    
    clear() {
        this.store.dispatch({ type: CLEAR_ELEVATION });
    }
    
    publishRecalcTime(duration: number) {
        this.store.dispatch({
            type: UPDATE_DETAILS,
            payload: { recalculateTime: duration }
        });
    }

}
