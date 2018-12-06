import { updateObject } from '../../shared/utility';

export const FETCH = 'FETCH_USERS';
export const ADD = 'user_ADD';
export const EDIT = 'user_EDIT';
export const DELETE = 'user_DELETE';
export const UPDATE = 'user_UPDATE';

const initialState = {
    users: [],
    userToEdit : null
};

const userEdit = ( state, action ) => {
    return updateObject( state, {
        userToEdit: action.userToEdit
    } );
};

const addUser = ( state, action ) => {
    const usersCopy = [...state.users];
    const newUser = {...action.userData};
    usersCopy.unshift(newUser);
    return updateObject( state, {
        loading: false,
        users: usersCopy 
    } );
};

const updateUser = ( state, action ) => {
    const usersCopy = [...state.users];
    const userCopy = {...action.userData};
    usersCopy.splice(userCopy.index,1,userCopy);
    
    return updateObject( state, {
        users: usersCopy,
        userToEdit : null
    } );
};


const fetchUsers = ( state, action ) => {
    return updateObject( state, {
        users: action.users,
    } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case EDIT: return userEdit( state, action )
        case ADD: return addUser( state, action )
        case UPDATE: return updateUser( state, action )
        case FETCH: return fetchUsers( state, action );
        default: return state;
    }
};

export default reducer;