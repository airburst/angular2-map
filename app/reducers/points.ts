import {Reducer, Action} from '@ngrx/store';

export const CLEAR = 'CLEAR';
export const SET = 'SET';
export const ADD = 'ADD';
export const REMOVE = 'REMOVE';

export const points = (state: any = [], action: Action) => {
    switch (action.type) {

        case SET:
            console.log('POINTS.SET')
            return action.payload;

        case ADD:
            console.log('POINTS.ADD')            
            return [...state, action.payload];

        case REMOVE:
            console.log('POINTS.REMOVE')
            // Need to get trackPointsCount and 
            // slice that number of points..
            return state.slice(0, state.length -1);            

        case CLEAR:
            console.log('POINTS.CLEAR')
            return [];

        default:
            return state;
        }
};