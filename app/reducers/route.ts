import {Reducer, Action} from '@ngrx/store';
import {Route} from '../route';

export const CLEAR = 'CLEAR';

export const route:Reducer<Route> = (state:Route = new Route(), action:Action) => {

    switch (action.type) {
        case CLEAR:
            return state.clear();

        default:
            return state;
    }
}