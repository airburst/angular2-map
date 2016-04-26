System.register(['angular2/core', '@ngrx/store', '../reducers/gazetteer'], function(exports_1, context_1) {
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
    var core_1, store_1, gazetteer_1;
    var GazetteerService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (store_1_1) {
                store_1 = store_1_1;
            },
            function (gazetteer_1_1) {
                gazetteer_1 = gazetteer_1_1;
            }],
        execute: function() {
            GazetteerService = (function () {
                function GazetteerService(store) {
                    this.store = store;
                    this.place = '';
                }
                GazetteerService.prototype.searchPostcode = function (place) {
                    var postcodeService = new window.OpenSpace.Postcode();
                    this.place = place;
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
                        this.searchPlace(this.place);
                    }
                    if ((mapPoint !== null) && (eastVal.length > 3)) {
                        this.updateStore([{
                                name: this.place,
                                location: mapPoint
                            }]);
                    }
                };
                GazetteerService.prototype.searchPlace = function (place) {
                    var osGaz = new window.OpenSpace.Gazetteer;
                    var gazArray = osGaz.getLocations(place, this.placeSearchResponse.bind(this));
                };
                GazetteerService.prototype.placeSearchResponse = function (places) {
                    if (places.length === 0) {
                        this.updateStore([{
                                name: 'No matching places found',
                                location: { lat: 0, lon: 0 }
                            }]);
                    }
                    if (places.length === 1) {
                        this.updateStore(places[0]);
                    }
                    if (places.length > 1) {
                        this.updateStore(places);
                    }
                };
                ;
                GazetteerService.prototype.updateStore = function (results) {
                    if (results !== undefined) {
                        this.store.dispatch({ type: gazetteer_1.SET_RESULTS, payload: results });
                    }
                };
                GazetteerService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [store_1.Store])
                ], GazetteerService);
                return GazetteerService;
            }());
            exports_1("GazetteerService", GazetteerService);
        }
    }
});
//# sourceMappingURL=gazetteer.js.map