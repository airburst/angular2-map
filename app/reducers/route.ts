import {Reducer, Action} from '@ngrx/store';
import {Point, AppStore} from '../route';

export const CLEAR = 'CLEAR';
export const SET = 'SET';
export const ADD_POINT = 'ADD_POINT';

export const waypoints = (state: any = [], {type, payload}) => {
    switch (type) {

        case SET:
            return payload;

        case ADD_POINT:
            return [...state, payload];

        case CLEAR:
            return [];

        default:
            return state;
        }
};