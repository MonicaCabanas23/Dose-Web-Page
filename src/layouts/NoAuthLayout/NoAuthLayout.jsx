import classes from './NoAuthLayout.module.scss';
import logo from './../../assets/logo.png';
import { Outlet, Link } from "react-router-dom";

export const NoAuthLayout = ({scrollTop}) => {    
    return (
        <>
            <header className={ scrollTop >= 25 ? [classes["Header"], classes["Scrolled"]].join(" ") : classes["Header"] }>
                <div className={ classes["Logo"] }>
                    <img src={logo}/> <h1>DOSE</h1>
                </div>
                <Link className={ classes["Button"] } to="dose.apk" download={true} target='_blank' >
                    Let’s get started
                </Link>
            </header>
            <main className={ classes["Main"] }>
                <Outlet/>
            </main>
        </>
    )
}