import classes from './Logout.module.scss';

export const Logout = ({ classesProp=['Logout'] }) => {    
    const handleClick = (e) => {
        e.preventDefault();
        localStorage.removeItem('dataStorage');
        setTimeout(() => {            
            window.location.href = "/";
        }, 2000)   
    }

    const classesToShow = classesProp.map(x => {
        return classes[x]
    });

    return (
        <button className={ classesToShow.join(" ") } onClick={handleClick}>
            Logout
        </button>
    )
}