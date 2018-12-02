export const SITES_URL = process.env.NODE_ENV === 'development' ? '/sites_dev' : '/sites';
export const SITES_SUGEST_URL = process.env.NODE_ENV === 'development' ? '/sites_sugest_dev' : '/sites_sugest';
export const CATEGORIES_URL = process.env.NODE_ENV === 'development' ? '/categories_dev' : '/categories';

export const API_SERVER = "http://bestworld-security.herokuapp.com";

export const messages = {
    GENERIC_ERROR : "Erro ao efetuar operação",
    INVALID_PASSWORD : "Senha invalida",
    EMAIL_NOT_FOUND : "Login invalido",
    ROLE_REQUIRED: "Regra não informada",
    MISSING_ID_TOKEN: "Token não enviado"
}