System.register(['angular2/core', '../route'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, route_1;
    var GpxService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (route_1_1) {
                route_1 = route_1_1;
            }],
        execute: function() {
            GpxService = (function () {
                function GpxService() {
                }
                // Parse xml into json
                GpxService.prototype.parse = function (gpxData) {
                    // Parse gpx format into data structure
                    try {
                        var parser = new DOMParser();
                        var xmlDoc = parser.parseFromString(gpxData, 'text/xml');
                        return this._extract(xmlDoc);
                    }
                    catch (err) {
                        console.log(err);
                        return (err);
                    }
                };
                GpxService.prototype._extract = function (xml) {
                    var route = new route_1.Route();
                    // Route Name (gpx/metadata/name)
                    var meta = xml.getElementsByTagName('metadata')[0];
                    route.name = ((meta.getElementsByTagName('name')[0]) !== undefined) ? meta.getElementsByTagName('name')[0].textContent : '';
                    // Waypoints (gpx/wpt[@lat, @lon, name])
                    var wayPoints = xml.getElementsByTagName('wpt');
                    for (var i = 0; i < wayPoints.length; i++) {
                        var marker = new route_1.Marker(wayPoints[i].getElementsByTagName('name')[0].textContent, new route_1.Point(parseFloat(wayPoints[i].getAttribute('lat').valueOf()), parseFloat(wayPoints[i].getAttribute('lon').valueOf())));
                        route.addMarker(marker);
                    }
                    // Track Points (gpx/trk/trkseg/trkpt[@lat, @lon])
                    var trackPoints = xml.getElementsByTagName('trkpt');
                    for (var i = 0; i < trackPoints.length; i++) {
                        var point = new route_1.Point(parseFloat(trackPoints[i].getAttribute('lat').valueOf()), parseFloat(trackPoints[i].getAttribute('lon').valueOf()));
                        route.addPoint(point);
                    }
                    return route.flatten();
                };
                GpxService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], GpxService);
                return GpxService;
            })();
            exports_1("GpxService", GpxService);
        }
    }
});
//# sourceMappingURL=gpx.service.js.map