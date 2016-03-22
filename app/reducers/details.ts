import {Reducer, Action} from '@ngrx/store';
import {RouteDetails} from '../route';
export const CLEAR_DETAILS = 'CLEAR_DETAILS';
export const SET_DETAILS = 'SET_DETAILS';
export const UPDATE_DETAILS = 'UPDATE_DETAILS';

const initialState: RouteDetails = {
    name: '',
    distance: 0,
    ascent: 0,
    descent: 0,
    easting: 386210,
    northing: 168060,
    zoom: 7,
    followsRoads: true,
    isImported: false
}

export const details = (state: RouteDetails = initialState, action: Action) => {

    switch (action.type) {
        case SET_DETAILS:
            return action.payload;

        case UPDATE_DETAILS:
            return Object.assign({}, state, action.payload);

        case CLEAR_DETAILS:
            return initialState;

        default:
            return state;
    }

}