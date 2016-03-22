System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Route;
    return {
        setters:[],
        execute: function() {
            Route = (function () {
                function Route() {
                }
                Route.prototype.calculateElevation = function () {
                    var totalAscent = 0, totalDescent = 0, lastElevation = 0;
                    for (var i = 0; i < this.points.length - 1; i++) {
                        var e = this.points[i].ele;
                        if (e !== null) {
                            if (e > lastElevation) {
                                this.ascent += (e - lastElevation);
                                lastElevation = e;
                            }
                            if (e < lastElevation) {
                                this.descent += (lastElevation - e);
                                lastElevation = e;
                            }
                        }
                        this.setBounds(this.points[i]);
                    }
                };
                Route.prototype.setBounds = function (point) {
                    this.minLat = Math.min(this.minLat, point.lat);
                    this.maxLat = Math.max(this.maxLat, point.lat);
                    this.minLon = Math.min(this.minLon, point.lon);
                    this.maxLon = Math.max(this.maxLon, point.lon);
                    this.diagonal = this.distanceBetween(this.minLat, this.minLon, this.maxLat, this.maxLon);
                };
                Route.prototype.centre = function () {
                    return {
                        lat: this.minLat + ((this.maxLat - this.minLat) / 2),
                        lon: this.minLon + ((this.maxLon - this.minLon) / 2)
                    };
                };
                // Return distance (km) between two points
                Route.prototype.distanceBetween = function (lat1, lon1, lat2, lon2) {
                    var p = 0.017453292519943295; // Math.PI / 180
                    var c = Math.cos;
                    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
                        c(lat1 * p) * c(lat2 * p) *
                            (1 - c((lon2 - lon1) * p)) / 2;
                    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
                };
                Route.prototype.getZoomLevel = function () {
                    var distance = this.diagonal;
                    if (distance <= 0) {
                        return 10;
                    }
                    var z = 10;
                    distance = distance / 1.5;
                    while (((distance / Math.pow(2, 10 - z)) > 1) && (z > 0)) {
                        z -= 1;
                    }
                    return z + 1;
                };
                return Route;
            }());
            exports_1("Route", Route);
        }
    }
});
//# sourceMappingURL=route.js.map