import classes from './Header.module.scss'
import logo from './../../assets/logo.png';
import { Logout } from './../Buttons/Logout/Logout';

export const Header = () => {
    return (
        <header className={ classes["Header"] }>
            <div className={ classes["Logo"] }>
                <img src={logo}/> <h1>MINGO</h1>
            </div>
            <Logout/>
        </header>
    )
}