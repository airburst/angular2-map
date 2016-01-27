import {Injectable} from 'angular2/core';
import {Point, WayPoint, Marker, Route} from '../route';

@Injectable()
export class GpxService {
    
    // Parse xml into json
    read(gpxData: any): string {
        // Parse gpx format into data structure
        try {           
            let parser: DOMParser = new DOMParser();
            let xmlDoc: Document = parser.parseFromString(gpxData,'text/xml');
            return this.gpxToJson(xmlDoc);
        }
        catch (err) {
            console.log(err);
            return (err);
        }
    }
    
    private gpxToJson(xml: Document): string {
        let route = new Route();

        // Route Name (gpx/metadata/name)
        let meta = xml.getElementsByTagName('metadata')[0];
        route.name = ((meta.getElementsByTagName('name')[0]) !== undefined) ? meta.getElementsByTagName('name')[0].textContent : '';
        
        // Waypoints (gpx/wpt[@lat, @lon, name])
        let wayPoints: NodeListOf<Element> = xml.getElementsByTagName('wpt');
        for (let i = 0; i < wayPoints.length; i++) {
            let marker = new Marker(
                wayPoints[i].getElementsByTagName('name')[0].textContent,
                new Point(
                    parseFloat(wayPoints[i].getAttribute('lat').valueOf()),
                    parseFloat(wayPoints[i].getAttribute('lon').valueOf())
                )
            );
            route.addMarker(marker);
        }
        
        // Track Points (gpx/trk/trkseg/trkpt[@lat, @lon, ele])
        let trackPoints = xml.getElementsByTagName('trkpt');
        for (let i = 0; i < trackPoints.length; i++) {
            let point = new Point(
                parseFloat(trackPoints[i].getAttribute('lat').valueOf()),
                parseFloat(trackPoints[i].getAttribute('lon').valueOf()),
                parseFloat(trackPoints[i].getElementsByTagName('ele')[0].textContent)
            );
            route.addPoint(point);
        }
        // Add calculated total ascent and descent
        route.calculateElevation();
        
        return route.json();
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