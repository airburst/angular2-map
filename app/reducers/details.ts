import {Reducer, Action} from '@ngrx/store';
import {RouteDetails} from '../models/route';
export const CLEAR_DETAILS = 'CLEAR_DETAILS';
export const SET_DETAILS = 'SET_DETAILS';
export const UPDATE_DETAILS = 'UPDATE_DETAILS';
export const TOGGLE_ROADS = 'TOGGLE_ROADS';

export const initialState: RouteDetails = {
    name: "",
    distance: 0,
    ascent: 0,
    easting: 386210,
    northing: 168060,
    lat: 0,
    lon: 0,
    zoom: 7,
    followsRoads: true,
    isEditable: false,
    hasNewElevation: true,
    selectedPointIndex: -1,
    recalculateTime: 0
}

export const details = (state: RouteDetails = initialState, action: Action) => {

    switch (action.type) {
        case SET_DETAILS:
            return Object.assign({}, state, action.payload);

        case UPDATE_DETAILS:
            return Object.assign({}, state, action.payload);

        case CLEAR_DETAILS:
            return (state = initialState);

        case TOGGLE_ROADS:
            return Object.assign({}, state, { followsRoads: !state.followsRoads });

        default:
            return state;
    }

}