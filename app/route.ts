// LatLng coordinate (like Google Maps and GPX)
export class Point {
    constructor(lat: number, lon: number, ele?: number) {
        this.lat = lat;
        this.lon = lon;
        this.ele = ele;
    }
    public lat: number;
    public lon: number;
    public ele: number;

    public flatten(): any {
        return [this.lat, this.lon, this.ele];
    }
}

// Northing - Easting Coordinate (like Ordnance Survey)
export class MapPoint {
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    public x: number;
    public y: number;

    public flatten(): any {
        return [this.x, this.y, ];
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
        this.isImported = false;
        this.clear();
    }
    public name: string;
    public ascent: number;
    public descent: number;
    public wayPoints: WayPoint[];
    public points: Point[];
    public markers: Marker[];
    public minLat: number;
    public minLon: number;
    public maxLat: number;
    public maxLon: number;
    public diagonal: number;
    public isImported: boolean;
    
    public clear() {
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
        
    public addWayPoint(wayPoint: WayPoint) {
        this.wayPoints.push(wayPoint);
    }
    
    public addPoints(points: Point[]) {
        points.forEach((p) => {
            this.addPoint(p);
        });
    }
    
    public addPoint(point: Point) {
        this.points.push(point);
    }
    
    private removePoints(number: number) {
        this.points.splice(this.points.length - number)
    }
    
    public addMarker(marker: Marker) {
        this.markers.push(marker);
    }
    
    public lastWayPoint() {
        return this.wayPoints[this.wayPoints.length - 1];
    }
    
    public penultimateWayPoint() {
        return this.wayPoints[this.wayPoints.length - 2];
    }
    
    public removelastWayPoint() {
        let n = this.lastWayPoint().routePoints;
        this.removePoints(n);
        this.wayPoints.pop();
    }

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

            this.setBounds(this.points[i]);
        }
    }

    private setBounds(point: Point): void {
        this.minLat = Math.min(this.minLat, point.lat);
        this.maxLat = Math.max(this.maxLat, point.lat);
        this.minLon = Math.min(this.minLon, point.lon);
        this.maxLon = Math.max(this.maxLon, point.lon);
        this.diagonal = this.distanceBetween(this.minLat, this.minLon, this.maxLat, this.maxLon);
    }

    public centre(): Point {
        return new Point(
            this.minLat + ((this.maxLat - this.minLat) / 2),
            this.minLon + ((this.maxLon - this.minLon) / 2)
        );
    }
    
    // Return distance (km) between two points
    private distanceBetween(lat1: number, lon1: number, lat2: number, lon2: number): number {
        let p = 0.017453292519943295;    // Math.PI / 180
        let c = Math.cos;
        let a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2;
        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }

    public getZoomLevel(): number {
        let distance = this.diagonal;
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
            'points': this.points,
            'markers': this.markers,
            'centre': this.centre(),
            'zoom': this.getZoomLevel()
        };
    }
}
