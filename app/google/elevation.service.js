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
    var ElevationService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            ElevationService = (function () {
                function ElevationService() {
                    this.elevator = {};
                    this.sampleSize = 256;
                    // Reduce a path to <= maximum sample size (256)
                    this.reducePath = function (points) {
                        var path = [];
                        // If elevation path is below max size, use it
                        var eLen = points.length;
                        if (eLen < this.sampleSize) {
                            return points;
                        }
                        // Otherwise, reduce to no more than the max number of point
                        var eDiv = Math.floor(eLen / this.sampleSize) + 1; // Reduction factor
                        var eMod = eLen - (Math.floor(eLen / eDiv) * eDiv); // Remainder of single points
                        var eLast = eLen - eMod; // Last factorised sample point
                        // Resample at interval of (eDiv) points
                        for (var i = 0; i < eLast; i += eDiv) {
                            path.push(points[i]);
                        }
                        // Then add the last individual points at frequency = 1
                        for (var i = eLast; i < eLen; i++) {
                            path.push(points[i]);
                        }
                        return path;
                    };
                }
                ElevationService.prototype.init = function () {
                    this.elevator = new window.google.maps.ElevationService();
                };
                // Return elevation data for route
                ElevationService.prototype.elevation = function (points, callback) {
                    if (points.length <= 1) {
                        return [];
                    }
                    // Create an elevation request from path, with 256 sample points
                    // The max path size appears to be 412 data points
                    var request = {
                        'path': this.reducePath(points),
                        'samples': this.sampleSize
                    };
                    this.elevator.getElevationAlongPath(request, callback);
                };
                ;
                ElevationService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], ElevationService);
                return ElevationService;
            })();
            exports_1("ElevationService", ElevationService);
        }
    }
});
//# sourceMappingURL=elevation.service.js.map