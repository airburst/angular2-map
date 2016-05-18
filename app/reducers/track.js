"use strict";
exports.CLEAR_TRACK = 'CLEAR_TRACK';
exports.SET_TRACK = 'SET_TRACK';
exports.ADD_SEGMENT = 'ADD_SEGMENT';
exports.UPDATE_SEGMENT = 'UPDATE_SEGMENT';
exports.REMOVE_LAST_SEGMENT = 'REMOVE_LAST_SEGMENT';
exports.track = function (state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case exports.SET_TRACK:
            return action.payload;
        case exports.ADD_SEGMENT:
            return state.concat([action.payload]);
        case exports.UPDATE_SEGMENT:
            return state.map(function (segment) {
                return segment.id === action.payload.id ? Object.assign({}, segment, action.payload) : segment;
            });
        case exports.REMOVE_LAST_SEGMENT:
            return state.slice(0, state.length - 1);
        case exports.CLEAR_TRACK:
            return (state = []);
        default:
            return state;
    }
};
//# sourceMappingURL=track.js.map