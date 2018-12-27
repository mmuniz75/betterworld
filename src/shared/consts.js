const getLanguage = () => {
    const language = window.navigator.userLanguage || window.navigator.language;
    if(language.substring(0,2)!=='pt')
        return '_EN'
    else 
        return '';
}

export const SITES_URL = process.env.NODE_ENV === 'development' ? '/sites_dev' : '/sites' + getLanguage();
export const SITES_SUGEST_URL = process.env.NODE_ENV === 'development' ? '/sites_sugest_dev' : '/sites_sugest'  + getLanguage();
export const CATEGORIES_URL = process.env.NODE_ENV === 'development' ? '/categories_dev' : '/categories'  + getLanguage();

export const API_SERVER = process.env.NODE_ENV === 'development' ? 'http://localhost:3030' : 'http://bestworld-security.herokuapp.com';

