export const useAuth = () => {
    const dataStorage = JSON.parse(localStorage.getItem('dataStorage')) || null ;        
    return dataStorage;
}