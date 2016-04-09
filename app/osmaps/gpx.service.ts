import {Injectable} from 'angular2/core';
import {Store} from '@ngrx/store';
import {Point, WayPoint, Marker, Segment, AppStore, boundingRectangle} from '../route';
import {SET_TRACK} from '../reducers/track';
import {SET_MARKERS} from '../reducers/markers';
import {SET_ELEVATION} from '../reducers/elevation';
import {SET_DETAILS, initialState} from '../reducers/details';
import {replaceAll, flatten} from '../utils/utils';

@Injectable()
export class GpxService {

    public appStore: AppStore;

    constructor(public store: Store<AppStore>) { }

    init() {
        this.appStore = <AppStore>{
            details: Object.assign({}, initialState),
            track: [],
            elevation: [],
            markers: []
        }
    }

    read(gpxData: any): void {
        let route: any = gpxData[0],
            name: string = gpxData[1],
            ext: string = gpxData[2];

        this.init();
        try {
            let parser: DOMParser = new DOMParser();
            let xmlDoc: Document = parser.parseFromString(route, 'text/xml');

            // Parse the file dependent on type
            if (ext === 'gpx') { this.gpxToRoute(xmlDoc); }
            if (ext === 'tcx') { this.tcxToRoute(xmlDoc); }
        }
        catch (err) {
            console.log(err);
            return (err);
        }
    }

    private gpxToRoute(xml: Document): void {
        // Route Name (gpx/metadata/name)
        let meta = xml.getElementsByTagName('metadata')[0];
        this.appStore.details.name = ((meta.getElementsByTagName('name')[0]) !== undefined) ? meta.getElementsByTagName('name')[0].textContent : '';

        // Waypoints (gpx/wpt[@lat, @lon, name]) -> Markers
        let wayPoints: NodeListOf<Element> = xml.getElementsByTagName('wpt');
        for (let i = 0; i < wayPoints.length; i++) {
            let marker: Marker = {
                name: wayPoints[i].getElementsByTagName('name')[0].textContent,
                point: {
                    lat: parseFloat(wayPoints[i].getAttribute('lat').valueOf()),
                    lon: parseFloat(wayPoints[i].getAttribute('lon').valueOf())
                }
            };
            this.appStore.markers.push(marker);
        }

        // Track Points (gpx/trk/trkseg/trkpt[@lat, @lon, ele])
        let trackPoints = xml.getElementsByTagName('trkpt'),
            track: Point[] = [],
            elevation: number[] = [];
        for (let i = 0; i < trackPoints.length; i++) {
            let point: Point = {
                lat: parseFloat(trackPoints[i].getAttribute('lat').valueOf()),
                lon: parseFloat(trackPoints[i].getAttribute('lon').valueOf()),
            };
            track.push(point);
            elevation.push(parseFloat(trackPoints[i].getElementsByTagName('ele')[0].textContent));
        }
        this.appStore.track.push(<Segment>{ id: 'imported', track: track, waypoint: null, hasElevationData: true });
        this.appStore.elevation.push(elevation);
        this.appStore.details.isEditable = true;
        this.appStore.details.hasNewElevation = false;

        this.updateStore();
    }

    // TODO: understand the full schema:
    // http://www8.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd
    // This function only handles course[0], not activities or multiple courses
    private tcxToRoute(xml: Document): void {
        // Course Name (Course/Name)
        let course = xml.getElementsByTagName('Course')[0];
        this.appStore.details.name = ((course.getElementsByTagName('Name')[0]) !== undefined) ? course.getElementsByTagName('Name')[0].textContent : '';

        // Track Points (Track/Trackpoint[Position/LatitudeDegrees, Position/LongitudeDegrees, AltitudeMeters])
        let trackPoints = xml.getElementsByTagName('Trackpoint'),
            track: Point[] = [],
            elevation: number[] = [];
        for (let i = 0; i < trackPoints.length; i++) {
            let point: Point = {
                lat: parseFloat(trackPoints[i].getElementsByTagName('LatitudeDegrees')[0].textContent),
                lon: parseFloat(trackPoints[i].getElementsByTagName('LongitudeDegrees')[0].textContent)
            };
            track.push(point);
            elevation.push(parseFloat(trackPoints[i].getElementsByTagName('AltitudeMeters')[0].textContent));
        }
        this.appStore.track.push(<Segment>{ id: 'imported', track: track, waypoint: null, hasElevationData: true });
        this.appStore.elevation.push(elevation);

        // Markers - add start and finish points
        // TODO: find out whether courses support waypoints
        this.appStore.markers.push({ name: 'Start', point: track[0] });
        this.appStore.markers.push({ name: 'Finish', point: track[track.length - 1] });
        this.appStore.details.isEditable = true;
        this.appStore.details.hasNewElevation = false;

        this.updateStore();
    }

    updateStore() {
        let box = boundingRectangle(this.appStore.track),
            payload = Object.assign({}, 
                this.appStore.details, {
                    lat: box.lat,
                    lon: box.lon,
                    zoom: box.zoom,
                    distance: box.distance,
                    easting: 0,
                    northing: 0
                });
      
        this.store.dispatch({
            type: SET_DETAILS,
            payload: payload
        });
        
        this.store.dispatch({
            type: SET_MARKERS,
            payload: this.appStore.markers
        });
        
        this.store.dispatch({
            type: SET_TRACK,
            payload: this.appStore.track
        });

        this.store.dispatch({
            type: SET_ELEVATION,
            payload: this.appStore.elevation
        });        
    };

    private template: any = {
        header: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + 
            '<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="maps.fairhursts.net">',
        title: '<metadata><name>{name}</name></metadata><trk><name>{name}</name>',
        point: '<trkpt lon="{lon}" lat="{lat}">' +
               '<ele>{ele}</ele>' +
               '<name></name>' +
               '</trkpt>',
        end: '</trk></gpx>'
    }

    write(name?: string): string {
        if (name === undefined) { name = 'Route'; }
        let gpxContent: string = this.template.header + replaceAll('{name}', name, this.template.title),
            e = flatten(this.store.getState().elevation);
        
        this.store.getState().track.forEach((segment) => {
            segment.track.forEach((t, i) => {
                gpxContent += this.template.point
                    .replace('{lat}', t.lat.toFixed(7))
                    .replace('{lon}', t.lon.toFixed(7))
                    .replace('{ele}', e[i].toFixed(1));
            });
        });
        
        gpxContent += this.template.end;
        return gpxContent;
    }

}