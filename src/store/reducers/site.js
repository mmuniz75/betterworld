//import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

export const FETCH_SITES = 'FETCH_SITES';
export const SITE_EDIT = 'SITE_EDIT';

const initialState = {
    lastSitesLoaded: [],
    siteToEdit :null,
    category : null
};

const siteEdit = ( state, action ) => {
    return updateObject( state, {
        siteToEdit: action.site
    } );
};

const fetchSites = ( state, action ) => {
    const localState = {...state};
    const newCategory = action.category?action.category:localState.category;
    return updateObject( state, {
        lastSitesLoaded: action.sites,
        category : newCategory
    } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case SITE_EDIT: return siteEdit( state, action );
        case FETCH_SITES: return fetchSites( state, action );
        default: return state;
    }
};

export default reducer;