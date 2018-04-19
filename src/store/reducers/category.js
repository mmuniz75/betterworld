//import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
export const CATEGORY_ADD = 'CATEGORY_ADD';

const initialState = {
    categories: [],
};

const categoryAdd = ( state, action ) => {
    const newCategory = updateObject( action.categoryData, { id: action.categoryId } );
    return updateObject( state, {
        loading: false,
        categories: state.categories.concat( newCategory )
    } );
};

const fetchCategories = ( state, action ) => {
    return updateObject( state, {
        categories: action.categories,
    } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case CATEGORY_ADD: return categoryAdd( state, action )
        case FETCH_CATEGORIES: return fetchCategories( state, action );
        default: return state;
    }
};

export default reducer;