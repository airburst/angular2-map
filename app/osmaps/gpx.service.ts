import {Injectable} from 'angular2/core';
import {Point, WayPoint, Marker, Route} from '../route';

@Injectable()
export class GpxService {
    
    // Parse xml into json
    import(gpxData: any): string {
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

}