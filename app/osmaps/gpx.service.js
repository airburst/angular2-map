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
                    this.template = {
                        header: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="maps.fairhursts.net">',
                        title: '<metadata><name>{name}</name></metadata><rte><name>{name}</name>',
                        point: '<rtept lon="{lon}" lat="{lat}">' +
                            '<ele>0.0</ele>' +
                            '<name></name>' +
                            '</rtept>',
                        end: '</rte></gpx>'
                    };
                }
                // Parse xml into json
                GpxService.prototype.read = function (gpxData) {
                    // Parse gpx format into data structure
                    try {
                        var parser = new DOMParser();
                        var xmlDoc = parser.parseFromString(gpxData, 'text/xml');
                        return this.gpxToJson(xmlDoc);
                    }
                    catch (err) {
                        console.log(err);
                        return (err);
                    }
                };
                GpxService.prototype.gpxToJson = function (xml) {
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
                    // Track Points (gpx/trk/trkseg/trkpt[@lat, @lon, ele])
                    var trackPoints = xml.getElementsByTagName('trkpt');
                    for (var i = 0; i < trackPoints.length; i++) {
                        var point = new route_1.Point(parseFloat(trackPoints[i].getAttribute('lat').valueOf()), parseFloat(trackPoints[i].getAttribute('lon').valueOf()), parseFloat(trackPoints[i].getElementsByTagName('ele')[0].textContent));
                        route.addPoint(point);
                    }
                    // Add calculated total ascent and descent
                    route.calculateElevation();
                    return route.json();
                };
                GpxService.prototype.replaceAll = function (find, replace, str) {
                    return str.replace(new RegExp(find, 'g'), replace);
                };
                GpxService.prototype.write = function (route, name) {
                    if (name === undefined) {
                        name = 'Route';
                    }
                    var gpxContent = this.template.header + this.replaceAll('{name}', name, this.template.title);
                    for (var i = 0; i < route.points.length; i++) {
                        gpxContent += this.template.point
                            .replace('{lat}', route[i][0])
                            .replace('{lon}', route[i][1]);
                    }
                    ;
                    gpxContent += this.template.end;
                    return gpxContent;
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