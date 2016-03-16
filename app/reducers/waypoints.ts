import {Reducer, Action} from '@ngrx/store';

export const CLEAR = 'CLEAR';
export const SET = 'SET';
export const ADD = 'ADD';
export const REMOVE = 'REMOVE';

export const waypoints = (state: any = [], action: Action) => {
    switch (action.type) {

        case SET:
            console.log('WAYPOINTS.SET')
            return action.payload;

        case ADD:
            console.log('WAYPOINTS.ADD')            
            return [...state, action.payload];

        case REMOVE:
            console.log('WAYPOINTS.REMOVE')
            // Need to get trackPointsCount and 
            // slice that number of points..
            return state.slice(0, state.length -1);            

        case CLEAR:
            console.log('WAYPOINTS.CLEAR')
            return [];

        default:
            return state;
        }
};