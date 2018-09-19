import { updateObject } from '../../shared/utility';

export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
export const ADD = 'CATEGORY_ADD';
export const EDIT = 'CATEGORY_EDIT';
export const DELETE = 'CATEGORY_EDIT';

const initialState = {
    categories: [],
    categoryToEdit : null
};

const categoryEdit = ( state, action ) => {
    return updateObject( state, {
        categoryToEdit: action.category
    } );
};

const addCategory = ( state, action ) => {
    const newCategory = {...action.categoryData};
    return updateObject( state, {
        loading: false,
        categories: state.categories.concat(newCategory)
    } );
};


const updateCategory = ( state, action ) => {
    const categoriesCopy = [...state.categories];
    const categoryCopy = {...action.categoryData};
    categoriesCopy.splice(categoryCopy.index,1,categoryCopy);
    
    return updateObject( state, {
        categories: categoriesCopy,
        categoryToEdit : null
    } );
};

const deleteCategory = ( state, action ) => {
    const categoriesCopy = {...state.categories};
    categoriesCopy.splice(action.index,1);
   
    return updateObject( state, {
        categories : categoriesCopy
    } );
};


const fetchCategories = ( state, action ) => {
    return updateObject( state, {
        categories: action.categories,
    } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case EDIT: return categoryEdit( state, action )
        case ADD: return addCategory( state, action )
        case UPDATE: return updateCategory( state, action )
        case DELETE: return deleteCategory( state, action )
        case FETCH_CATEGORIES: return fetchCategories( state, action );
        default: return state;
    }
};

export default reducer;