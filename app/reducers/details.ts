import {Reducer, Action} from '@ngrx/store';
import {RouteDetails} from '../route';
export const CLEAR_DETAILS = 'CLEAR_DETAILS';
export const SET_DETAILS = 'SET_DETAILS';
export const UPDATE_DETAILS = 'UPDATE_DETAILS';

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
    isImported: false,
    hasNewElevation: true
}

export const details = (state: RouteDetails = initialState, action: Action) => {

    switch (action.type) {
        case SET_DETAILS:
        console.log('SET_DETAILS', action.payload)//
            return action.payload;

        case UPDATE_DETAILS:
            return Object.assign({}, state, action.payload);

        case CLEAR_DETAILS:
            console.log('CLEAR_DETAILS', initialState)//
            return Object.assign({}, state, initialState);

        default:
            return state;
    }

}