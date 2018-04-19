//import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

export const FETCH_SITES = 'FETCH_SITES';
export const FETCH_SUGGESTIONS = 'FETCH_SUGGESTIONS';
export const SITE_EDIT = 'SITE_EDIT';
export const SITE_APPROVE = 'SITE_APPROVE';

const initialState = {
    lastSitesLoaded: [],
    siteToEdit :null,
    siteToApprove : null,
    category : null,
    suggestionsLoaded : []
};

const siteEdit = ( state, action ) => {
    return updateObject( state, {
        siteToEdit: action.site
    } );
};

const siteApprove = ( state, action ) => {
    return updateObject( state, {
        siteToApprove: action.site
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

const fetchSuggestion = ( state, action ) => {
    return updateObject( state, {
        suggestionsLoaded: action.suggestions,
    } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case SITE_EDIT: return siteEdit( state, action );
        case SITE_APPROVE: return siteApprove( state, action );
        case FETCH_SITES: return fetchSites( state, action );
        case FETCH_SUGGESTIONS: return fetchSuggestion( state, action );
        default: return state;
    }
};

export default reducer;