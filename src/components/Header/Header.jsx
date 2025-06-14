import classes           from './Header.module.scss'
import logo              from './../../assets/logo.png';
import { Logout }        from './../Buttons/Logout/Logout';
import { AiOutlineMenu } from 'react-icons/ai';

export const Header = ({menuEvent}) => {    
    return (
        <header className={ classes["Header"] }>
            <div className={ classes["Menu"] } onClick={menuEvent}><AiOutlineMenu/></div>
            <div className={ classes["Logo"] }>
                    <img src={logo} style={{ width: "1rem", height: "1rem" }}/> 
                <h1>MINGO</h1>
            </div>
            <Logout/>
        </header>
    )
}