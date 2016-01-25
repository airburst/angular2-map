export class Point {
    constructor(lat: number, lon: number, ele?: number) {
        this.lat = lat;
        this.lon = lon;
        this.ele = ele;
    }
    public lat: number = this.lat;
    public lon: number = this.lon;
    public ele: number = this.ele;
    
    public flatten(): any {
        return [this.lat, this.lon, this.ele];
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
        this.ascent = 0;
        this.descent = 0;
        this.wayPoints = [];
        this.points = [];
        this.markers = [];
    }
    public name: string;
    public ascent: number;
    public descent: number;
    public wayPoints: WayPoint[];
    public points: Point[];
    public markers: Marker[];
    public addWayPoint(wayPoint) { this.wayPoints.push(wayPoint); }
    public addPoint(point) { this.points.push(point); }
    public addMarker(marker) { this.markers.push(marker); }
    
    public calculateElevation(): void {
        let totalAscent: number = 0,
            totalDescent: number = 0,
            lastElevation: number = 0;

        for (let i: number = 0; i < this.points.length - 1; i++) {
            let e = this.points[i].ele;
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
        }
    }
    
    public json(): any {
        return {
            'name': this.name,
            'ascent': this.ascent,
            'descent': this.descent,
            'waypoints': this.wayPoints,
            'route': this.points,
            'markers': this.markers
        };
    }
}
