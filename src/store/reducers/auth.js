import { updateObject } from '../../shared/utility';

export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';

const initialState = {
    token: null,
    userId: null
};

const authSuccess = (state, action) => {
    return updateObject( state, { 
        token: action.idToken,
        userId: action.userId,
        role: action.role
     } );
};

const authLogout = (state, action) => {
    return updateObject(state, { token: null, userId: null, role: null });
};


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case AUTH_SUCCESS: return authSuccess(state, action);
        case AUTH_LOGOUT: return authLogout(state, action);
        default:
            return state;
    }
};

export default reducer;