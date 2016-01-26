System.register([], function(exports_1) {
    var Point, WayPoint, Marker, Route;
    return {
        setters:[],
        execute: function() {
            Point = (function () {
                function Point(lat, lon, ele) {
                    this.lat = this.lat;
                    this.lon = this.lon;
                    this.ele = this.ele;
                    this.lat = lat;
                    this.lon = lon;
                    this.ele = ele;
                }
                Point.prototype.flatten = function () {
                    return [this.lat, this.lon, this.ele];
                };
                return Point;
            })();
            exports_1("Point", Point);
            WayPoint = (function () {
                function WayPoint(point, routePoints) {
                    this.point = point;
                    this.routePoints = routePoints;
                }
                WayPoint.prototype.flatten = function () {
                    return {
                        'point': this.point.flatten(),
                        'routePoints': this.routePoints
                    };
                };
                return WayPoint;
            })();
            exports_1("WayPoint", WayPoint);
            Marker = (function () {
                function Marker(name, point) {
                    this.name = name;
                    this.point = point;
                }
                Marker.prototype.flatten = function () {
                    return {
                        'name': this.name,
                        'point': this.point.flatten()
                    };
                };
                return Marker;
            })();
            exports_1("Marker", Marker);
            Route = (function () {
                function Route() {
                    this.name = '';
                    this.ascent = 0;
                    this.descent = 0;
                    this.wayPoints = [];
                    this.points = [];
                    this.markers = [];
                    this.minLat = 1000000;
                    this.minLon = 1000000;
                    this.maxLat = 0;
                    this.maxLon = 0;
                }
                Route.prototype.addWayPoint = function (wayPoint) { this.wayPoints.push(wayPoint); };
                Route.prototype.addPoint = function (point) { this.points.push(point); };
                Route.prototype.addMarker = function (marker) { this.markers.push(marker); };
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
                        // Update route bounds
                        this.setBounds(this.points[i]);
                    }
                };
                Route.prototype.setBounds = function (point) {
                    this.minLat = Math.min(this.minLat, point.lat);
                    this.maxLat = Math.max(this.maxLat, point.lat);
                    this.minLon = Math.min(this.minLon, point.lon);
                    this.maxLon = Math.max(this.maxLon, point.lon);
                };
                Route.prototype.centre = function () {
                    return new Point(this.minLat + (this.maxLat - this.minLat) / 2, this.minLon + (this.maxLon - this.minLon) / 2);
                };
                Route.prototype.json = function () {
                    return {
                        'name': this.name,
                        'ascent': this.ascent,
                        'descent': this.descent,
                        'waypoints': this.wayPoints,
                        'route': this.points,
                        'markers': this.markers,
                        'centre': this.centre()
                    };
                };
                return Route;
            })();
            exports_1("Route", Route);
        }
    }
});
//# sourceMappingURL=route.js.map