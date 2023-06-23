import classes from './NoAuthLayout.module.scss';
import logo from './../../assets/logo.png';
import { Outlet } from "react-router-dom";

export const NoAuthLayout = ({scrollTop}) => {    
    return (
        <>
            <header className={ scrollTop >= 25 ? [classes["Header"], classes["Scrolled"]].join(" ") : classes["Header"] }>
                <div className={ classes["Logo"] }>
                    <img src={logo}/> <h1>MINGO</h1>
                </div>
                <button className={ classes["Button"] }>
                    Let’s get started
                </button>
            </header>
            <main className={ classes["Main"] }>
                <Outlet/>
            </main>
        </>
    )
}