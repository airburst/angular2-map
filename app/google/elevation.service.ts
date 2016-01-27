///<reference path="../../typings/window.extend.d.ts"/>
import {Injectable} from 'angular2/core';
import {Point, MapPoint, Route} from '../route';

@Injectable()
export class ElevationService {
    
    private elevator: any = {};
    sampleSize: number = 256;
    
    init(): any {
        this.elevator = new window.google.maps.ElevationService();
    }
    
    // Return elevation data for route
    elevation(points: Point[], callback: Function) {
        if (points.length <= 1) { return []; }
        
        // Create an elevation request from path, with 256 sample points
        // The max path size appears to be 412 data points
        let request: any = {
            'path': this.reducePath(points),
            'samples': this.sampleSize
        }
        this.elevator.getElevationAlongPath(request, callback);
    };

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
        for (let i = eLast; i < eLen ; i++) {
            path.push(points[i]);
        }

        return path;
    };

}
