System.register(['angular2/core'], function(exports_1) {
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
    var DirectionsService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            DirectionsService = (function () {
                function DirectionsService() {
                    this.service = {};
                }
                DirectionsService.prototype.init = function () {
                    this.service = new window.google.maps.DirectionsService();
                };
                DirectionsService.prototype.getRouteBetween = function (from, to) {
                    this.service.route({
                        origin: from,
                        destination: to,
                        travelMode: window.google.maps.DirectionsTravelMode.BICYCLING
                    }, function (result, status) {
                        if (status === window.google.maps.DirectionsStatus.OK) {
                            return result; // Need to push values to Observable route
                        }
                        else {
                            throw {
                                message: 'There was a problem getting directions data.',
                                status: status,
                                type: 'Directions Service Error'
                            };
                        }
                    });
                };
                ;
                DirectionsService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], DirectionsService);
                return DirectionsService;
            })();
            exports_1("DirectionsService", DirectionsService);
        }
    }
});
//# sourceMappingURL=directions.service.js.map