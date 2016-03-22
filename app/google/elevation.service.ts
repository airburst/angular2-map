///<reference path="../../typings/window.extend.d.ts"/>
import {Injectable} from 'angular2/core';
import {Point, MapPoint, Segment, AppStore} from '../route';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {SET_ELEVATION, ADD_ELEVATION, REMOVE_ELEVATION, CLEAR_ELEVATION} from '../reducers/elevation';

@Injectable()
export class ElevationService {

    public status: any;
    public results: any;
    private elevator: any;
    private sampleSize: number;
    private track: Observable<Array<Segment>>;

    constructor(public store: Store<AppStore>) {
        this.results = [];
        this.elevator = {};
        this.sampleSize = 240;
        this.track = store.select('track');
    };

    init(): any {
        this.elevator = new window.google.maps.ElevationService();
        this.status = window.google.maps.ElevationStatus;

        // Subscribe to changes in the track and get elevation for latest segment
        this.track.subscribe((v) => {
            this.getElevation(v[v.length - 1]);
        });
    };

    getElevation(segment: Segment): void {
        let i,
            j,
            index = 0,
            pathArray,
            path = [],
            self = this;

        if ((segment !== undefined) && (segment.track.length > 0)) {
            path = this.convertToGoogleRoute(segment.track);
            for (i = 0, j = path.length; i < j; i += this.sampleSize) {
                pathArray = path.slice(i, i + this.sampleSize);
                this.elevation(pathArray).then(function(response) {
                    console.log(response);
                }, function(Errortxt) {
                    console.log(Errortxt);
                });
            }
        }
    };

    convertToGoogleRoute(points: Point[]): any {
        let gPath = [];
        points.forEach((point) => {
            gPath.push(this.toLatLng(point));
        })
        return gPath;
        // return points.map((point) => {
        //     this.toLatLng(point);
        // })
    };

    toLatLng(point: Point): any {
        return new window.google.maps.LatLng(point.lat, point.lon)
    };

    elevation(path: any): any {
        let self = this;
        return new Promise(function(resolve, reject) {
            console.log('path', path.length);//
            if (path.length <= 1) {
                reject('No elevation requested: too few points in path');
            }
            self.elevator.getElevationAlongPath({
                'path': path,
                'samples': (path.length < self.sampleSize) ? path.length : self.sampleSize
            }, function(results, status) {
                if (status === self.status.OK) {
                    if (results[0]) {
                        resolve(results);
                    }
                    else
                        reject('No valid result was determined from the Google Elevation service. Please try again');
                }
                else
                    reject('Google Elevation service was not available. Please try again');
            });
        });
    };

    // Combine several requests into single response
    multiPathHandler(results, status, index): void {
        if (status !== this.status.OK) {
            console.log(status);
        } else {
            this.results = { index: index, results: results };
            console.log(this.results);
        }
    };

    // Reduce a path to <= maximum sample size
    private reducePath = function(points: Point[]): Point[] {
        let path = [];

        // If elevation path is below max size, use it
        let eLen = points.length;
        if (eLen < this.sampleSize) { return points; }

        // Otherwise, reduce to no more than the max number of point
        let eDiv = Math.floor(eLen / this.sampleSize) + 1;      // Reduction factor
        let eMod = eLen - (Math.floor(eLen / eDiv) * eDiv);     // Remainder of single points
        let eLast = eLen - eMod;                                // Last factorised sample point

        // Resample at interval of (eDiv) points
        for (let i = 0; i < eLast; i += eDiv) {
            path.push(points[i]);
        }

        // Then add the last individual points at frequency = 1
        for (let i = eLast; i < eLen; i++) {
            path.push(points[i]);
        }
        return path;
    };

}
