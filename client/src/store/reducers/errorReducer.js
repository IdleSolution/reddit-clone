import * as actions from "./../actions/ActionTypes";

const initialState = {
    error: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SHOW_ERROR:
            return {
                ...state,
                error: action.payload
            };
        case actions.CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return {
                ...state
            };
    }
};

export default reducer;
