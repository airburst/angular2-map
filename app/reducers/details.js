"use strict";
exports.CLEAR_DETAILS = 'CLEAR_DETAILS';
exports.SET_DETAILS = 'SET_DETAILS';
exports.UPDATE_DETAILS = 'UPDATE_DETAILS';
exports.TOGGLE_ROADS = 'TOGGLE_ROADS';
exports.initialState = {
    name: "",
    distance: 0,
    ascent: 0,
    easting: 386210,
    northing: 168060,
    lat: 0,
    lon: 0,
    zoom: 7,
    followsRoads: true,
    isEditable: true,
    hasNewElevation: true,
    selectedPointIndex: -1,
    recalculateTime: 0
};
exports.details = function (state, action) {
    if (state === void 0) { state = exports.initialState; }
    switch (action.type) {
        case exports.SET_DETAILS:
            return Object.assign({}, state, action.payload);
        case exports.UPDATE_DETAILS:
            return Object.assign({}, state, action.payload);
        case exports.CLEAR_DETAILS:
            return (state = exports.initialState);
        case exports.TOGGLE_ROADS:
            return Object.assign({}, state, { followsRoads: !state.followsRoads });
        default:
            return state;
    }
};
//# sourceMappingURL=details.js.map