"use strict";
exports.CLEAR_ELEVATION = 'CLEAR_ELEVATION';
exports.SET_ELEVATION = 'SET_ELEVATION';
exports.ADD_ELEVATION = 'ADD_ELEVATION';
exports.REMOVE_ELEVATION = 'REMOVE_ELEVATION';
exports.elevation = function (state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case exports.SET_ELEVATION:
            return action.payload;
        case exports.ADD_ELEVATION:
            return state.concat([action.payload]);
        case exports.REMOVE_ELEVATION:
            return state.slice(0, state.length - 1);
        case exports.CLEAR_ELEVATION:
            return (state = []);
        default:
            return state;
    }
};
//# sourceMappingURL=elevation.js.map