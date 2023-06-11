import { Outlet } from "react-router-dom";

export const NoAuthLayout = () => {
    return (
        <>
            <header></header>
            <main>
                <Outlet/>
            </main>
        </>
    )
}