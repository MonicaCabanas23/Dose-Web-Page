import classes from'./MainLayout.module.scss';

import { Outlet, useNavigate } from "react-router-dom";
import { Navigation } from '../../core/containers/Menu/Menu';

import { Header } from '../../components/Header/Header';

import { useValidateToken } from '../../hooks/useAuth';
import { useEffect } from 'react';

export const MainLayout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!useValidateToken()) {
            navigate('/login');
        }
    })

    return (
        <>
            <Header/>
            <div className={ classes["MainLayout"] }>
                <Navigation/>
                <main>
                    <Outlet/>
                </main>
            </div>
        </>
    )
}