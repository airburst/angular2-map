System.register([], function(exports_1) {
    var Point, WayPoint, Marker, Route;
    return {
        setters:[],
        execute: function() {
            Point = (function () {
                function Point(lat, lon) {
                    this.lat = this.lat;
                    this.lon = this.lon;
                    this.lat = lat;
                    this.lon = lon;
                }
                Point.prototype.flatten = function () {
                    return [this.lat, this.lon];
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
                    this.wayPoints = [];
                    this.points = [];
                    this.markers = [];
                }
                Route.prototype.addWayPoint = function (wayPoint) {
                    this.wayPoints.push(wayPoint.flatten());
                };
                Route.prototype.addPoint = function (point) {
                    this.points.push(point.flatten());
                };
                Route.prototype.addMarker = function (marker) {
                    this.markers.push(marker.flatten());
                };
                Route.prototype.flatten = function () {
                    return {
                        'name': this.name,
                        'waypoints': this.wayPoints,
                        'route': this.points,
                        'markers': this.markers
                    };
                };
                return Route;
            })();
            exports_1("Route", Route);
        }
    }
});
//# sourceMappingURL=route.js.map