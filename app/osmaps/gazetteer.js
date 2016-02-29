System.register(['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var GazetteerService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            // @Injectable()
            // export class WikipediaService {
            //     search(terms: Observable<string>, debounceDuration = 400) {
            //         return terms.debounceTime(debounceDuration)
            //             .distinctUntilChanged()
            //             .switchMap(term => this.rawSearch(term));
            //     }
            //     // rawSearch(term: string) {
            //     //     var search = new URLSearchParams()
            //     //     search.set('action', 'opensearch');
            //     //     search.set('search', term);
            //     //     search.set('format', 'json');
            //     //     return this.jsonp
            //     //         .get('http://en.wikipedia.org/w/api.php?callback=JSONP_CALLBACK', { search })
            //     //         .map((response) => response.json()[1]);
            //     // }
            // }
            GazetteerService = (function () {
                function GazetteerService() {
                    this.sectorFlag = 0;
                    this.place = '';
                }
                // search(terms: Observable<string>, debounceDuration = 400) {
                //     return terms.debounceTime(debounceDuration)
                //         .distinctUntilChanged()
                //         .switchMap(term => this.searchPostcode(term));
                // }
                GazetteerService.prototype.searchPostcode = function (place, callback) {
                    var postcodeService = new window.OpenSpace.Postcode();
                    this.place = place;
                    this.callback = callback;
                    // Are we searching for a postcode sector or full postcode?
                    if (place.length < 5) {
                        this.sectorFlag = 1;
                    }
                    // Search postcode service
                    postcodeService.getLonLat(place, this.postcodeSearchResponse.bind(this));
                };
                GazetteerService.prototype.postcodeSearchResponse = function (mapPoint) {
                    // If not a valid PostCode, pass to gazetteer search
                    // An easting of length three indicates no match found for postcode
                    var eastVal = '';
                    if (mapPoint !== null) {
                        eastVal = mapPoint.getEasting().toString();
                    }
                    // No postcode match: search gazetteer for place name
                    if (eastVal.length === 3 || mapPoint === null) {
                        this.searchPlace(this.place, this.callback);
                    }
                    // Centre map on postcode MapPoint       
                    if ((mapPoint !== null) && (eastVal.length > 3)) {
                        this.callback(mapPoint, 'postcode');
                    }
                };
                GazetteerService.prototype.searchPlace = function (place, callback) {
                    this.callback = callback;
                    var osGaz = new window.OpenSpace.Gazetteer;
                    var gazArray = osGaz.getLocations(place, this.placeSearchResponse.bind(this));
                };
                // Return place search results
                GazetteerService.prototype.placeSearchResponse = function (places) {
                    if (places.length === 0) {
                        this.callback([], 'null');
                    }
                    if (places.length === 1) {
                        this.callback(places[0], 'place');
                    }
                    if (places.length > 1) {
                        this.callback(places, 'place');
                    }
                };
                ;
                GazetteerService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], GazetteerService);
                return GazetteerService;
            }());
            exports_1("GazetteerService", GazetteerService);
        }
    }
});
//# sourceMappingURL=gazetteer.js.map