"use strict";
exports.CLEAR_RESULTS = 'CLEAR_RESULTS';
exports.SET_RESULTS = 'SET_RESULTS';
exports.results = function (state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case exports.SET_RESULTS:
            return action.payload;
        case exports.CLEAR_RESULTS:
            return (state = []);
        default:
            return state;
    }
};
//# sourceMappingURL=gazetteer.js.map