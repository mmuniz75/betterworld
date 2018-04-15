//import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

export const FETCH_CATEGORIES_START = 'FETCH_CATEGORIES_START';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAIL = 'FETCH_CATEGORIES_FAIL';

export const CATEGORY_ADD_START = '';
export const CATEGORY_ADD_SUCCESS = 'CATEGORY_ADD_SUCCESS';
export const CATEGORY_ADD_FAIL = 'CATEGORY_ADD_FAIL';

const initialState = {
    categories: [],
    loading: false
};


const categoryAddStart = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const categoryAddSuccess = ( state, action ) => {
    const newCategory = updateObject( action.categoryData, { id: action.categoryId } );
    return updateObject( state, {
        loading: false,
        categories: state.categories.concat( newCategory )
    } );
};

const categoryAddFail = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const fetchCategoriesStart = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const fetchCategoriesSuccess = ( state, action ) => {
    return updateObject( state, {
        categories: action.categories,
        loading: false
    } );
};

const fetchCategoriesFail = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case CATEGORY_ADD_START: return categoryAddStart( state, action );
        case CATEGORY_ADD_SUCCESS: return categoryAddSuccess( state, action )
        case CATEGORY_ADD_FAIL: return categoryAddFail( state, action );
        case FETCH_CATEGORIES_START: return fetchCategoriesStart( state, action );
        case FETCH_CATEGORIES_SUCCESS: return fetchCategoriesSuccess( state, action );
        case FETCH_CATEGORIES_FAIL: return fetchCategoriesFail( state, action );
        default: return state;
    }
};

export default reducer;