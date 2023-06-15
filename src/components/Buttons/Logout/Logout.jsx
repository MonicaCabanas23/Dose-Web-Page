import classes from './Logout.module.scss';

export const Logout = () => {    
    const handleClick = (e) => {
        e.preventDefault();
        localStorage.removeItem('dataStorage');
        setTimeout(() => {            
            window.location.href = "/";
        }, 2000)   
    }

    return (
        <button className={ classes['Logout'] } onClick={handleClick}>
            Logout
        </button>
    )
}