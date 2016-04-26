System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _this = this;
    var Route, boundingRectangle, distance, initialBounds, centre, distanceBetween, getZoomLevel;
    return {
        setters:[],
        execute: function() {
            Route = (function () {
                function Route(store) {
                    this.details$ = store.select('details');
                    this.track$ = store.select('track');
                    this.elevation$ = store.select('elevation');
                    this.searchResults$ = store.select('results');
                }
                return Route;
            }());
            exports_1("Route", Route);
            exports_1("boundingRectangle", boundingRectangle = function (tracks) {
                var b = Object.assign({}, initialBounds), dist = 0, lastPoint = tracks[0].track[0], self = _this;
                tracks.forEach(function (s) {
                    s.track.forEach(function (t) {
                        b.minLat = Math.min(b.minLat, t.lat);
                        b.maxLat = Math.max(b.maxLat, t.lat);
                        b.minLon = Math.min(b.minLon, t.lon);
                        b.maxLon = Math.max(b.maxLon, t.lon);
                        dist += distanceBetween(lastPoint.lat, lastPoint.lon, t.lat, t.lon);
                        lastPoint = t;
                    });
                });
                var mapCentre = centre(b.minLat, b.minLon, b.maxLat, b.maxLon), diagonal = distanceBetween(b.minLat, b.minLon, b.maxLat, b.maxLon), zoom = getZoomLevel(diagonal);
                return { lat: mapCentre.lat, lon: mapCentre.lon, zoom: zoom, distance: dist };
            });
            exports_1("distance", distance = function (tracks) {
                if (tracks.length === 0) {
                    return 0;
                }
                var dist = 0, lastPoint = (tracks[0].waypoint !== null) ? tracks[0].waypoint : tracks[0].track[0];
                tracks.forEach(function (s) {
                    s.track.forEach(function (t) {
                        dist += distanceBetween(lastPoint.lat, lastPoint.lon, t.lat, t.lon);
                        lastPoint = t;
                    });
                });
                return dist;
            });
            initialBounds = {
                minLat: 1000000,
                minLon: 1000000,
                maxLat: -1000000,
                maxLon: -1000000
            };
            centre = function (lat1, lon1, lat2, lon2) {
                return {
                    lat: lat1 + ((lat2 - lat1) / 2),
                    lon: lon1 + ((lon2 - lon1) / 2)
                };
            };
            // Return distance (km) between two points
            exports_1("distanceBetween", distanceBetween = function (lat1, lon1, lat2, lon2) {
                var p = 0.017453292519943295; // Math.PI / 180
                var c = Math.cos;
                var a = 0.5 - c((lat2 - lat1) * p) / 2 +
                    c(lat1 * p) * c(lat2 * p) *
                        (1 - c((lon2 - lon1) * p)) / 2;
                return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
            });
            getZoomLevel = function (distance) {
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
        }
    }
});
//# sourceMappingURL=route.js.map