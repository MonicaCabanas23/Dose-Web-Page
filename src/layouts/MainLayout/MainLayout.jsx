import classes from'./MainLayout.module.scss';

import { Outlet } from "react-router-dom";
import { Navigation } from '../../core/containers/Menu/Menu';

import { Header } from '../../components/Header/Header';

export const MainLayout = () => {
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