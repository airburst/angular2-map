import {Reducer, Action} from '@ngrx/store';

export const CLEAR_WAYPOINTS = 'CLEAR_WAYPOINTS';
export const SET_WAYPOINTS = 'SET_WAYPOINTS';
export const ADD_WAYPOINT = 'ADD_WAYPOINT';
export const UPDATE_LAST_WAYPOINT = 'UPDATE_LAST_WAYPOINT';
export const REMOVE_WAYPOINT = 'REMOVE_WAYPOINT';

export const waypoints = (state: any = [], action: Action) => {

    console.log(action.type);

    switch (action.type) {
        case SET_WAYPOINTS:
            return action.payload;

        case ADD_WAYPOINT:          
            return [...state, action.payload];

        case UPDATE_LAST_WAYPOINT:
            let lastWaypoint = state[state.length - 1];
            lastWaypoint.trackPointsCount = action.payload.trackPointsCount;
            return state;

        case REMOVE_WAYPOINT:
            // Need to get trackPointsCount and 
            // slice that number of points..
            return state.slice(0, state.length -1);            

        case CLEAR_WAYPOINTS:
            return [];

        default:
            return state;
        }
};