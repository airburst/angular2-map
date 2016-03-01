///<reference path="../../typings/window.extend.d.ts"/>
import {Injectable} from 'angular2/core';
import {MapPoint} from '../route';

@Injectable()
export class DirectionsService {

    private service: any = {};

    constructor() {
        this.service = new window.google.maps.DirectionsService();
    }
    
    getRouteBetween(from: MapPoint, to: MapPoint) {
        this.service.route({
            origin: from,
            destination: to,
            travelMode: window.google.maps.DirectionsTravelMode.BICYCLING
        },
            function(result, status) {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    return result;  // Need to push values to Observable route
                } else {
                    throw {
                        message: 'There was a problem getting directions data.',
                        status: status,
                        type: 'Directions Service Error'
                    };
                }
            }
        );
    };

}
