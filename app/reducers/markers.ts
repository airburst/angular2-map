import {Reducer, Action} from '@ngrx/store';
import {Marker} from '../route';
export const CLEAR_MARKERS = 'CLEAR_MARKERS';
export const SET_MARKERS = 'SET_MARKERS';
export const ADD_MARKER = 'ADD_MARKER';
export const REMOVE_MARKER = 'REMOVE_MARKER';

export const markers = (state: Array<Marker> = [], action: Action) => {

    switch (action.type) {
        case SET_MARKERS:
            return action.payload;

        case ADD_MARKER:
            return [...state, action.payload];

        case REMOVE_MARKER:
            return state.slice(0, state.length - 1);

        case CLEAR_MARKERS:
            return (state = []);

        default:
            return state;
    }

};

