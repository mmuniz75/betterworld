export const SITES_URL = process.env.NODE_ENV === 'development' ? '/sites_dev' : '/sites';
export const SITES_SUGEST_URL = process.env.NODE_ENV === 'development' ? '/sites_sugest_dev' : '/sites_sugest';
export const CATEGORIES_URL = process.env.NODE_ENV === 'development' ? '/categories_dev.json' : '/categories.json';