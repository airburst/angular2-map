export interface IPoint {
    lat: number;
    lon: number;
    ele: number;
}

export interface AppStore {
    points: IPoint[]
}