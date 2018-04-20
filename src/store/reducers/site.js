//import * as actionTypes from '../actions/actionTypes';
import { updateObject,like } from '../../shared/utility';

export const FETCH_SITES = 'FETCH_SITES';
export const RESET_SITES = 'RESET_SITES';
export const ADD_SITE = 'ADD_SITE';
export const UPDATE_SITE = 'UPDATE_SITE';
export const DELETE_SITE = 'DELETE_SITE';
export const FILTER_SITES = 'FILTER_SITES';

export const FETCH_SUGGESTIONS = 'FETCH_SUGGESTIONS';
export const DELETE_SUGGESTION = 'DELETE_SUGGESTION';

export const SITE_EDIT = 'SITE_EDIT';
export const SITE_APPROVE = 'SITE_APPROVE';
export const SET_CATEGORY = 'SET_CATEGORY';

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
    const sites = [...action.sites];
    return updateObject( state, {
        lastSitesLoaded: action.sites,
        category : newCategory,
        sitesCashed : sites
    } );
};

const fitlerSites = ( state = initialState, action ) => {
    let search = action.search;
    let sites = [...state.sitesCashed];

    if(search.length>0) {
        const criteria = '%' + search + '%';
        const sitesFiltered = sites.filter(site => {
                                return like(criteria,site.description) || 
                                    like(criteria,site.name)
                            })
        sites = sitesFiltered;
    }else{
        search = null;
    }    
    
    return updateObject( state, {
        lastSitesLoaded: sites,
        filterCriteria: search
    } );
};

const addSite = ( state, action ) => {
    let sitesLoaded = [...state.lastSitesLoaded];
    let sitesCashed = [...state.sitesCashed];

    sitesLoaded = sitesLoaded.concat(action.site);
    sitesCashed = sitesCashed.concat(action.site);

    return updateObject( state, {
        lastSitesLoaded: sitesLoaded,
        sitesCashed : sitesCashed
    } );
};

const updateSiteByID = (site,sites) => {
    const sitesCopy = [...sites];
    const siteCopy = {...site};
    const index = sitesCopy.findIndex(s => s.key === siteCopy.key);
    sitesCopy.splice(index,1,siteCopy);
    return sitesCopy;
}

const updateSite = ( state, action ) => {
    const site = {...action.site};
    site.key = state.siteToEdit.key;
    const sitesLoaded = updateSiteByID(site,state.lastSitesLoaded)
    const sitesCashed = updateSiteByID(site,state.sitesCashed)
    
    return updateObject( state, {
        lastSitesLoaded: sitesLoaded,
        sitesCashed : sitesCashed,
        siteToEdit : null
    } );
};


const deleteSiteByID = (key,sites) => {
    const sitesCopy = [...sites];
    const index = sitesCopy.findIndex(s => s.key === key);
    sitesCopy.splice(index,1);
    return sitesCopy;
}

const deleteSite = ( state, action ) => {
    const sitesLoaded = deleteSiteByID(action.key,state.lastSitesLoaded)
    const sitesCashed = deleteSiteByID(action.key,state.sitesCashed)
    
    return updateObject( state, {
        lastSitesLoaded: sitesLoaded,
        sitesCashed : sitesCashed
    } );
};

const deleteSuggestion = ( state, action ) => {
    const suggestionRemoved = deleteSiteByID(action.key,state.suggestionsLoaded);
    return updateObject( state, {
        suggestionsLoaded : suggestionRemoved,
        siteToApprove : null
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
        case FILTER_SITES: return fitlerSites( state, action );
        case ADD_SITE: return addSite( state, action );
        case UPDATE_SITE: return updateSite( state, action );
        case DELETE_SITE: return deleteSite( state, action );
        case FETCH_SUGGESTIONS: return fetchSuggestion( state, action );
        case DELETE_SUGGESTION: return deleteSuggestion( state, action );
        case SET_CATEGORY: return setCategory( state, action );
        default: return state;
    }
};

export default reducer;