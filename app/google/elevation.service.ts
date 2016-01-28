///<reference path="../../typings/window.extend.d.ts"/>
import {Injectable} from 'angular2/core';
import {Point, MapPoint, Route} from '../route';

@Injectable()
export class ElevationService {

    constructor() {
        this.results = [];
        this.elevator = {};
        this.sampleSize = 256;
    }
    public status: any;
    public results: any;
    private elevator: any;
    private sampleSize: number;

    init(): any {
        this.elevator = new window.google.maps.ElevationService();
        this.status = window.google.maps.ElevationStatus;
    }
    
    // Return elevation data for route
    elevation(path: any, callback: Function): any {
        console.log('path', path);
        if (path.length <= 1) {
            console.log('No elevation requested: too few points in path');
            callback([], this.status.OK);
        }
        
        // Batch into samples and create an elevation request for each path
        this.elevator.getElevationAlongPath({
            'path': path,
            'samples': this.sampleSize
        }, callback);        
    };
    
    // Convert Point into Google LatLng
    toLatLng(point: Point): any {
        return new window.google.maps.LatLng(point.lat, point.lon)
    }
    
    // Convert Path into Google Path
    // TODO: Only return points that don't already have elevation data
    googleRoute(points: Point[]): any {
        let gPath = [];
        points.forEach((point) => { gPath.push(this.toLatLng(point)); })
        return gPath;
    }
    
    // Combine several requests into single response
    multiPathHandler(results, status, index): void {
        if (status !== this.status.OK) {
            console.log(status);
        } else {
            this.results[index] = results;
            console.log(this.results);
        }
    }
    
    // Cut a path into an array of paths, each <= sample size
    getElevation(route: Route): void {
        let i,
            j,
            index = 0,
            pathArray,
            path = this.googleRoute(route.points),
            self = this;
        
        for (i = 0, j = path.length; i < j; i += this.sampleSize) {
            pathArray = path.slice(i, i + this.sampleSize);
            this.elevation(pathArray, function(results, status) {
                console.log(index);
                self.multiPathHandler(results, status, index);
            });
            index++;
        }
    }

    // Reduce a path to <= maximum sample size (256)
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
