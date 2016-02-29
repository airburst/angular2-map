System.register([], function(exports_1) {
    var Point, MapPoint, WayPoint, Marker, Route;
    return {
        setters:[],
        execute: function() {
            // LatLng coordinate (like Google Maps and GPX)
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
            // Northing - Easting Coordinate (like Ordnance Survey)
            MapPoint = (function () {
                function MapPoint(x, y) {
                    this.x = this.x;
                    this.y = this.y;
                    this.x = x;
                    this.y = y;
                }
                MapPoint.prototype.flatten = function () {
                    return [this.x, this.y,];
                };
                return MapPoint;
            })();
            exports_1("MapPoint", MapPoint);
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
                    this.maxLat = -1000000;
                    this.maxLon = -1000000;
                    this.diagonal = 0;
                }
                Route.prototype.addWayPoint = function (wayPoint) {
                    this.wayPoints.push(wayPoint);
                };
                Route.prototype.addPoints = function (points) {
                    var _this = this;
                    points.forEach(function (p) {
                        _this.addPoint(p);
                    });
                };
                Route.prototype.addPoint = function (point) {
                    this.points.push(point);
                };
                Route.prototype.addMarker = function (marker) {
                    this.markers.push(marker);
                };
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
                    this.diagonal = this.distanceBetween(this.minLat, this.minLon, this.maxLat, this.maxLon);
                };
                Route.prototype.centre = function () {
                    return new Point(this.minLat + ((this.maxLat - this.minLat) / 2), this.minLon + ((this.maxLon - this.minLon) / 2));
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
                Route.prototype.json = function () {
                    return {
                        'name': this.name,
                        'ascent': this.ascent,
                        'descent': this.descent,
                        'waypoints': this.wayPoints,
                        'points': this.points,
                        'markers': this.markers,
                        'centre': this.centre(),
                        'zoom': this.getZoomLevel()
                    };
                };
                return Route;
            })();
            exports_1("Route", Route);
        }
    }
});
//# sourceMappingURL=route.js.map