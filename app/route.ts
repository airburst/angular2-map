export class Point {
    constructor(lat: number, lon: number) {
        this.lat = lat;
        this.lon = lon;
    }
    public lat: number = this.lat;
    public lon: number = this.lon;
    public flatten(): any {
        return [this.lat, this.lon];
    }
}

export class WayPoint {
    constructor(point: Point, routePoints: number) {
        this.point = point;
        this.routePoints = routePoints;
    }
    public routePoints: number;
    public point: Point;
    public flatten(): any {
        return {
            'point': this.point.flatten(),
            'routePoints': this.routePoints
        };
    }
}

export class Marker {
    constructor(name: string, point: Point) {
        this.name = name;
        this.point = point; 
    }
    public name: string;
    public point: Point;
    public flatten(): any {
        return {
            'name': this.name,
            'point': this.point.flatten()
        };
    }
}

export class Route {
    constructor() {
        this.name = '';
        this.wayPoints = [];
        this.points = [];
        this.markers = [];
    }
    public name: string;
    public wayPoints: WayPoint[];
    public points: any;
    public markers: Marker[];
    
    public addWayPoint(wayPoint) {
        this.wayPoints.push(wayPoint.flatten());
    }
    
    public addPoint(point) {
        this.points.push(point.flatten());
    }
    
    public addMarker(marker) {
        this.markers.push(marker.flatten());
    }
    
    public flatten(): any {
        return {
            'name': this.name,
            'waypoints': this.wayPoints,
            'route': this.points,
            'markers': this.markers
        };
    }
}
