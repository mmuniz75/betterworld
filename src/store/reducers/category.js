import { updateObject } from '../../shared/utility';

export const FETCH = 'FETCH_CATEGORIES';
export const FETCH_ADMIN = 'FETCH_CATEGORIES_ADMIN';
export const ADD = 'CATEGORY_ADD';
export const EDIT = 'CATEGORY_EDIT';
export const DELETE = 'CATEGORY_DELETE';
export const UPDATE = 'CATEGORY_UPDATE';

const initialState = {
    categories: [],
    categoriesAdmin: [],
    categoryToEdit : null
};

const categoryEdit = ( state, action ) => {
    return updateObject( state, {
        categoryToEdit: action.categoryToEdit
    } );
};

const addCategory = ( state, action ) => {
    const newCategory = {...action.categoryData};

    const categoriesCopy = [...state.categories];
    const categoriesAdminCopy = [...state.categoriesAdmin];
    
    categoriesAdminCopy.unshift(newCategory);

    if(newCategory.active) {
        categoriesCopy.unshift(newCategory);
    }
    
    return updateObject( state, {
        loading: false,
        categories: categoriesCopy, 
        categoriesAdmin: categoriesAdminCopy
    } );
};

const updateCategory = ( state, action ) => {
    const categoryCopy = {...action.categoryData};
        
    const categoriesAdminCopy = [...state.categoriesAdmin];
    const adminIndex = categoriesAdminCopy.index;
    categoriesAdminCopy.splice(adminIndex,1,categoryCopy);

    const categoriesCopy = [...state.categories];
    const index = categoriesCopy.findIndex(s => s.key === categoryCopy.key);
    if(index > -1) {

        if(categoryCopy.active) {
            categoriesCopy.splice(index,1,categoryCopy);
        }else{
            categoriesCopy.splice(index,1);
        }    

    }else if(categoryCopy.active) {
        categoriesCopy.unshift(categoryCopy);
    }    
        
    return updateObject( state, {
        categories: categoriesCopy, 
        categoriesAdmin: categoriesAdminCopy,
        categoryToEdit : null
    } );
};

const deleteCategory = ( state, action ) => {
    const categoriesCopy = [...state.categories];
    const categoriesAdminCopy = [...state.categoriesAdmin];
    
    const categoryCopy = {...categoriesAdminCopy[action.index]};

    categoriesAdminCopy.splice(action.index,1);
    
    if(categoryCopy.active) { 
        const index = categoriesCopy.findIndex(s => s.key === categoryCopy.key);
        categoriesCopy.splice(index,1);
    }      
    
    return updateObject( state, {
        categories : categoriesCopy, 
        categoriesAdmin: categoriesAdminCopy
    } );
};

const fetchCategories = ( state, action ) => {
    return updateObject( state, {
        categories: action.categories,
    } );
};

const fetchCategoriesAdmin = ( state, action ) => {
    return updateObject( state, {
        categoriesAdmin: action.categories,
    } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case EDIT: return categoryEdit( state, action )
        case ADD: return addCategory( state, action )
        case UPDATE: return updateCategory( state, action )
        case DELETE: return deleteCategory( state, action )
        case FETCH: return fetchCategories( state, action );
        case FETCH_ADMIN: return fetchCategoriesAdmin( state, action );
        default: return state;
    }
};

export default reducer;