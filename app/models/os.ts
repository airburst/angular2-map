interface MapPoint {
    lat: number;
    lon: number;
    srs?: number;
}

export interface LocationResult {
    name: string;
    county?: string;
    location: MapPoint;
    type?: string;
}