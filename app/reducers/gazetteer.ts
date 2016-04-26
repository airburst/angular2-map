import {Reducer, Action} from '@ngrx/store';

export const CLEAR_RESULTS = 'CLEAR_RESULTS';
export const SET_RESULTS = 'SET_RESULTS';

export const results = (state: any = [], action: Action) => {
    switch (action.type) {
        case SET_RESULTS:
            return action.payload;           

        case CLEAR_RESULTS:
            return (state = []);

        default:
            return state;
        }
};