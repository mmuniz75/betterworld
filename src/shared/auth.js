export const logout = (props) => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    props.onLogout();
};

export const authCheckState = (props) => {
    const token = localStorage.getItem('token');
    if (!token) {
        logout(props);
    } else {
        const expirationDate = new Date(localStorage.getItem('expirationDate'));
        if (expirationDate <= new Date()) {
            logout(props);
        } else {
            const userId = localStorage.getItem('userId');
            const role = localStorage.getItem('role');
            props.onAuth(token, userId, role);
            checkAuthTimeout(props,(expirationDate.getTime() - new Date().getTime()) / 1000 );
        }   
    }
    
};

export const checkAuthTimeout = (props,expirationTime) => {
    setTimeout(() => {
        logout(props);
    }, expirationTime * 1000);
};

