import {Reducer, Action} from '@ngrx/store';
import {Segment} from '../route';
export const CLEAR_TRACK = 'CLEAR_TRACK';
export const SET_TRACK = 'SET_TRACK';
export const ADD_SEGMENT = 'ADD_SEGMENT';
export const UPDATE_SEGMENT = 'UPDATE_SEGMENT';
export const REMOVE_LAST_SEGMENT = 'REMOVE_LAST_SEGMENT';

export const track = (state: any = [], action: Action) => {

    console.log(action.type);

    switch (action.type) {
        case SET_TRACK:
            return action.payload;

        case ADD_SEGMENT:
            return [...state, action.payload];

        case UPDATE_SEGMENT:
            return state.map(segment => {
                return segment.id === action.payload.id ? Object.assign({}, segment, action.payload) : segment;
            });

        case REMOVE_LAST_SEGMENT:
            // Need to get trackPointsCount and 
            // slice that number of points..
            return state.slice(0, state.length - 1);

        case CLEAR_TRACK:
            return [];

        default:
            return state;
    }

};

