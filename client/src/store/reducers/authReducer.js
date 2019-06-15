import * as actions from "./../actions/ActionTypes";

const initialState = {
    user: {},
    authenticated: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_CURRENT_USER:
            const user = state.user;
            user.id = action.payload.id;
            user.username = action.payload.username;
            return {
                ...state,
                user,
                authenticated: true
            };

        case actions.LOGOUT_USER:
            return {
                ...state,
                user: {},
                authenticated: false
            };
        default:
            return {
                ...state
            };
    }
};

export default reducer;
