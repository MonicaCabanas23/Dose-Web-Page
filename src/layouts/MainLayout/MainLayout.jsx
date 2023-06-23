import classes from'./MainLayout.module.scss';

import { Outlet, useNavigate } from "react-router-dom";
import { Navigation } from '../../core/containers/Menu/Menu';

import { Header } from '../../components/Header/Header';

import { useValidateToken } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';

export const MainLayout = () => {
    const [menuState, setMenuState] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (!useValidateToken()) {
            navigate('/login');
        }
    })

    const changeMenuState = () => {
        setMenuState(!menuState);
    }

    return (
        <>
            <Header menuEvent={changeMenuState}/>
            <div className={ classes["MainLayout"] }>
                <Navigation menuState={menuState}/>
                <main>
                    <Outlet/>
                </main>
            </div>
        </>
    )
}