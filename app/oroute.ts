export interface IPoint {
    lat: number;
    lon: number;
    ele: number;
}

export interface IWayPoint {
    point: IPoint;
    trackPointsCount: number;
}

export interface IMarker {
    point: IPoint;
    name: string;
}

//MapPoint(x,y)

export interface AppStore {
    points: IPoint[]
}