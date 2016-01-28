///<reference path="../../typings/window.extend.d.ts"/>
import {Injectable} from 'angular2/core';

@Injectable()
export class GazetteerService {

    constructor() {
        this.sectorFlag = 0;
        this.place = '';
    }
    
    private sectorFlag: number;
    private place: string;
    private callback: Function;
    
    public searchPostcode(place: string, callback: Function): void {
        let postcodeService = new window.OpenSpace.Postcode();
        this.place = place;
        this.callback = callback;
   
        // Are we searching for a postcode sector or full postcode?
        if (place.length < 5) { this.sectorFlag = 1; }      

        // Search postcode service
        postcodeService.getLonLat(place, this.postcodeSearchResponse.bind(this));
    }
     
    private postcodeSearchResponse(mapPoint: any): void {         
        // If not a valid PostCode, pass to gazetteer search
        // An easting of length three indicates no match found for postcode
        let eastVal: string = '';
        if (mapPoint !== null) { eastVal = mapPoint.getEasting().toString(); }

        // No postcode match: search gazetteer for place name
        if (eastVal.length === 3 || mapPoint === null) { this.searchPlace(this.place, this.callback); }     

        // Centre map on postcode MapPoint       
        if ((mapPoint !== null) && (eastVal.length > 3)) { this.callback(mapPoint, 'postcode'); }
    }
    
    public searchPlace(place: string, callback: Function): void {
        this.callback = callback;
        let osGaz = new window.OpenSpace.Gazetteer;
        let gazArray = osGaz.getLocations(place, this.placeSearchResponse.bind(this));
    }
    
    // Return place search results
    private placeSearchResponse(places: any): void {
        if (places.length === 0) { this.callback([], 'null'); }
        if (places.length === 1) { this.callback(places[0], 'place'); }
        if (places.length > 1) { this.callback(places, 'place'); }
    };
 
}
