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
        this.minLat = 1000000;
        this.minLon = 1000000;
        this.maxLat = -1000000;
        this.maxLon = -1000000;
        this.diagonal = 0;
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
    public minLat: number;
    public minLon: number;
    public maxLat: number;
    public maxLon: number;
    public diagonal: number;
    
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
            // Update route bounds
            this.setBounds(this.points[i]);
        }
    }
    
    private setBounds(point: Point): void {
        this.minLat = Math.min(this.minLat, point.lat);
        this.maxLat = Math.max(this.maxLat, point.lat);
        this.minLon = Math.min(this.minLon, point.lon);
        this.maxLon = Math.max(this.maxLon, point.lon);
        this.diagonal = this.distance(this.minLat, this.minLon, this.maxLat, this.maxLon);
    }
    
    private centre(): Point {
        return new Point(
            this.minLat + ((this.maxLat - this.minLat) / 2),
            this.minLon + ((this.maxLon - this.minLon) / 2)
        );
    }
    
    // Return distance (km) between two points
    private distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        let p = 0.017453292519943295;    // Math.PI / 180
        let c = Math.cos;
        let a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }
    
    private zoom(distance: number): number {
        if (distance <= 0) { return 10; }
        let z = 10;
        distance = distance / 1.5;
        while (((distance / Math.pow(2, 10 - z)) > 1) && (z > 0)) {
            z -= 1;
        }
        return z + 1;
    }
    
    public json(): any {
        return {
            'name': this.name,
            'ascent': this.ascent,
            'descent': this.descent,
            'waypoints': this.wayPoints,
            'route': this.points,
            'markers': this.markers,
            'centre': this.centre(),
            'zoom': this.zoom(this.diagonal)
        };
    }
}
