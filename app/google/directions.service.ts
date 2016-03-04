///<reference path="../../typings/window.extend.d.ts"/>
import {Injectable} from 'angular2/core';
import {Point} from '../route';

@Injectable()
export class DirectionsService {

    constructor() {}
    
    private service: any;
    
    init() {
        this.service = new window.google.maps.DirectionsService();
    }
    
    getRouteBetween(from: any, to: any): Promise<any> {
        let ds = this.service,
            directionsPromise = new Promise(function(resolve, reject) {
            
            ds.route({
                origin: from,
                destination: to,
                travelMode: window.google.maps.DirectionsTravelMode.BICYCLING
            },
                function(result, status) {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        // Hardcoded path to collection of points
                        let googleMapPath = result.routes[0].overview_path,
                            points: Point[] = [];
                        googleMapPath.forEach((p) => {
                            points.push(new Point(p.lat(), p.lng()));
                        });
                        resolve(points);
                    } else {
                        reject({
                            message: 'There was a problem getting directions data.',
                            status: status,
                            type: 'Directions Service Error'
                        });
                    }
                }
            );
        });
        
        return directionsPromise;
    };
    
    convertToGoogleMapPoint(point: Point) {
        return new window.google.maps.LatLng(point.lat, point.lon);
    };
    
}
