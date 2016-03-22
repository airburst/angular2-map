import {Reducer, Action} from '@ngrx/store';

export const CLEAR_ELEVATION = 'CLEAR_ELEVATION';
export const SET_ELEVATION = 'SET_ELEVATION';
export const ADD_ELEVATION = 'ADD_ELEVATION';
export const REMOVE_ELEVATION = 'REMOVE_ELEVATION';

export const elevation = (state: any = [], action: Action) => {

    switch (action.type) {
        case SET_ELEVATION:
            return action.payload;

        case ADD_ELEVATION:          
            return [...state, action.payload];

        case REMOVE_ELEVATION:
            return state.slice(0, state.length -1);            

        case CLEAR_ELEVATION:
            return [];

        default:
            return state;
        }
};