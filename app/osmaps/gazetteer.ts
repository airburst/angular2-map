///<reference path="../../typings/window.extend.d.ts"/>
import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {LocationResult} from '../models/os';
import {AppStore} from '../route';
import {SET_RESULTS, CLEAR_RESULTS} from '../reducers/gazetteer';

@Injectable()
export class GazetteerService {
    
    constructor(public store: Store<AppStore>) {
        this.place = '';
    }

    private place: string;

    public searchPostcode(place): void {
        let postcodeService = new window.OpenSpace.Postcode();
        this.place = place;
        postcodeService.getLonLat(place, this.postcodeSearchResponse.bind(this));
    }

    private postcodeSearchResponse(mapPoint: any): void {         
        // If not a valid PostCode, pass to gazetteer search
        // An easting of length three indicates no match found for postcode
        let eastVal: string = '';
        if (mapPoint !== null) { eastVal = mapPoint.getEasting().toString(); }

        // No postcode match: search gazetteer for place name
        if (eastVal.length === 3 || mapPoint === null) { this.searchPlace(this.place); }     
    
        if ((mapPoint !== null) && (eastVal.length > 3)) {
            this.updateStore([{
                name: this.place, 
                location: mapPoint
            }]); 
        }
    }

    public searchPlace(place: string): void {
        let osGaz = new window.OpenSpace.Gazetteer;
        let gazArray = osGaz.getLocations(place, this.placeSearchResponse.bind(this));
    }
    
    private placeSearchResponse(places: LocationResult[]): void {
        if (places.length === 0) {
            this.updateStore([{
                name: 'No matching places found',
                location: {lat: 0, lon: 0}
            }]); 
        }
        if (places.length === 1) { this.updateStore(places[0]); }
        if (places.length > 1) { this.updateStore(places); }
    };
    
    private updateStore(results) {
        if (results !== undefined) {
            this.store.dispatch({ type: SET_RESULTS, payload: results });
        }
    }

}
