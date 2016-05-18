"use strict";
exports.CLEAR_MARKERS = 'CLEAR_MARKERS';
exports.SET_MARKERS = 'SET_MARKERS';
exports.ADD_MARKER = 'ADD_MARKER';
exports.REMOVE_MARKER = 'REMOVE_MARKER';
exports.markers = function (state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case exports.SET_MARKERS:
            return action.payload;
        case exports.ADD_MARKER:
            return state.concat([action.payload]);
        case exports.REMOVE_MARKER:
            return state.slice(0, state.length - 1);
        case exports.CLEAR_MARKERS:
            return (state = []);
        default:
            return state;
    }
};
//# sourceMappingURL=markers.js.map