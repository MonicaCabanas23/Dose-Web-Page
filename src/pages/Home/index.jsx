import classes from './Home.module.scss';

import logo from './../../assets/logo.png';

export const Home = () => {
    return (
        <>
            <div className={ classes['BgImage'] }></div>
            <div className={ classes['Home'] }>
                <div className={ classes['Logo'] }>
                    <img src={logo}/>
                    <h2>MINGO</h2>
                </div>
            </div>
        </>
    )
}