import * as actions from "./../actions/ActionTypes";

const initialState = {
    loading: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.START_LOADING:
            return {
                ...state,
                loading: true
            };
        case actions.STOP_LOADING:
            return {
                ...state,
                loading: false
            };
        default:
            return {
                ...state
            };
    }
};

export default reducer;
