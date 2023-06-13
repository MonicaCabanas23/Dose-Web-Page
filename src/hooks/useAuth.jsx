import jwt_decode from 'jwt-decode';

export const useAuth = () => {
    const dataStorage = JSON.parse(localStorage.getItem('dataStorage')) || null ;        
    return dataStorage;
}

export const useValidateToken = () => {
    const decodeJwt = jwt_decode(useAuth().token);

    if (decodeJwt.exp <= (new Date().getTime() + 1) / 1000) {
        localStorage.removeItem('dataStorage');

        return false;
    }

    return true;
}