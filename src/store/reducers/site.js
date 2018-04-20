//import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

export const FETCH_SITES = 'FETCH_SITES';
export const FETCH_SUGGESTIONS = 'FETCH_SUGGESTIONS';
export const SITE_EDIT = 'SITE_EDIT';
export const SITE_APPROVE = 'SITE_APPROVE';
export const SET_CATEGORY = 'SET_CATEGORY';
export const SET_SITES_CASH = 'SET_SITES_CASH';
export const SET_FILTER = 'SET_FILTER';

const initialState = {
    lastSitesLoaded: [],
    sitesCashed: [],
    filterCriteria: null,
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

const setSitesCash = ( state, action ) => {
    return updateObject( state, {
        filterCriteria: action.filterCriteria,
        sitesCashed : action.sitesCashed
    } );
};

const setFilter = ( state, action ) => {
    return updateObject( state, {
        filterCriteria: action.filterCriteria
    } );
};

const setCategory = ( state, action ) => {
    return updateObject( state, {
        category : action.category
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
        case SET_CATEGORY: return setCategory( state, action );
        case SET_SITES_CASH: return setSitesCash( state, action );
        case SET_FILTER: return setFilter( state, action );
        default: return state;
    }
};

export default reducer;