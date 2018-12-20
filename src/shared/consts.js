export const SITES_URL = process.env.NODE_ENV === 'development' ? '/sites_dev' : '/sites';
export const SITES_SUGEST_URL = process.env.NODE_ENV === 'development' ? '/sites_sugest_dev' : '/sites_sugest';
export const CATEGORIES_URL = process.env.NODE_ENV === 'development' ? '/categories_dev' : '/categories';

export const API_SERVER = process.env.NODE_ENV === 'development' ? 'http://localhost:3030' : 'http://bestworld-security.herokuapp.com';

export const messages = {
    GENERIC_ERROR : "Erro ao efetuar operação",
    INVALID_PASSWORD : "Senha invalida",
    EMAIL_NOT_FOUND : "Email invalido",
    ROLE_REQUIRED: "Regra não informada",
    MISSING_ID_TOKEN: "Token não enviado",
    USER_REQUIRED: "Usuário não informado",
    EMAIL_EXISTS: "Email já cadastrado",
    WEAK_PASSWORD: "Senha tem que ter no minimo 6 caracteres",
    USER_DISABLED: "Usuário desativado",
    EMAIL_EMPTY: "Favor digitar um email valido",
    RESET_PASSWORD_EXCEED_LIMIT: "Tentativas maxima de reiniciar senha atingido.Tente mais tarde."
}
