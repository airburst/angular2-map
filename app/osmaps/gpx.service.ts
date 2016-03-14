import {Injectable} from 'angular2/core';
import {Point, WayPoint, Marker, Route} from '../route';

@Injectable()
export class GpxService {
    
    read(gpxData: any): Route {
        let route: any = gpxData[0],
            name: string = gpxData[1],
            ext: string = gpxData[2];

        try {           
            let parser: DOMParser = new DOMParser();
            let xmlDoc: Document = parser.parseFromString(route,'text/xml');
            
            // Parse the file dependent on type
            if (ext === 'gpx') { return this.gpxToRoute(xmlDoc); }
            if (ext === 'tcx') { return this.tcxToRoute(xmlDoc); }
        }
        catch (err) {
            console.log(err);
            return (err);
        }
    }
    
    private gpxToRoute(xml: Document): Route {
        let route = new Route();

        // Route Name (gpx/metadata/name)
        let meta = xml.getElementsByTagName('metadata')[0];
        route.name = ((meta.getElementsByTagName('name')[0]) !== undefined) ? meta.getElementsByTagName('name')[0].textContent : '';
        
        // Waypoints (gpx/wpt[@lat, @lon, name])
        let wayPoints: NodeListOf<Element> = xml.getElementsByTagName('wpt');
        for (let i = 0; i < wayPoints.length; i++) {
            let marker: Marker = {
                name: wayPoints[i].getElementsByTagName('name')[0].textContent,
                point: {
                    lat: parseFloat(wayPoints[i].getAttribute('lat').valueOf()),
                    lon: parseFloat(wayPoints[i].getAttribute('lon').valueOf())
                }
            };
            route.addMarker(marker);
        }
        
        // Track Points (gpx/trk/trkseg/trkpt[@lat, @lon, ele])
        let trackPoints = xml.getElementsByTagName('trkpt');
        for (let i = 0; i < trackPoints.length; i++) {
            let point = {
                lat: parseFloat(trackPoints[i].getAttribute('lat').valueOf()),
                lon: parseFloat(trackPoints[i].getAttribute('lon').valueOf())
                //parseFloat(trackPoints[i].getElementsByTagName('ele')[0].textContent)
            };
            route.addPoint(point);
        }
        // Add calculated total ascent and descent
        // route.calculateElevation();
        route.isImported = true;
        
        return route;
    }
    
    // TODO: understand the full schema:
    // http://www8.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd
    // This function only handles course[0], not activities or multiple courses
    private tcxToRoute(xml: Document): Route {
        let route = new Route();

        // Course Name (Course/Name)
        let course = xml.getElementsByTagName('Course')[0];
        route.name = ((course.getElementsByTagName('Name')[0]) !== undefined) ? course.getElementsByTagName('Name')[0].textContent : '';
        
        // Track Points (Track/Trackpoint[Position/LatitudeDegrees, Position/LongitudeDegrees, AltitudeMeters])
        let trackPoints = xml.getElementsByTagName('Trackpoint');
        for (let i = 0; i < trackPoints.length; i++) {
            let point: Point = {
                lat: parseFloat(trackPoints[i].getElementsByTagName('LatitudeDegrees')[0].textContent),
                lon: parseFloat(trackPoints[i].getElementsByTagName('LongitudeDegrees')[0].textContent)
                //parseFloat(trackPoints[i].getElementsByTagName('AltitudeMeters')[0].textContent)
            };
            route.addPoint(point);
        }
        
        // Markers - add start and finish points
        // TODO: find out whether courses support waypoints
        route.addMarker({name: 'Start', point: route.points[0]});
        route.addMarker({name:'Finish', point: route.points[route.points.length - 1]});

        // Add calculated total ascent and descent
        // route.calculateElevation();
        route.isImported = true;
        
        return route;
    }
    
    private template: any = {
        header: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="maps.fairhursts.net">',
        title: '<metadata><name>{name}</name></metadata><rte><name>{name}</name>',
        point: '<rtept lon="{lon}" lat="{lat}">' +
               '<ele>0.0</ele>' +
               '<name></name>' +
               '</rtept>',
        end: '</rte></gpx>'
    }

    private replaceAll(find: string, replace: string, str: string): string {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    write(route: Route, name: string): string {
        if (name === undefined) { name = 'Route'; }
        let gpxContent: string = this.template.header + this.replaceAll('{name}', name, this.template.title);
        for (let i = 0; i < route.points.length; i++) {
            gpxContent += this.template.point
                .replace('{lat}', route[i][0])
                .replace('{lon}', route[i][1]);
        };
        gpxContent += this.template.end;

        return gpxContent;
    }

}