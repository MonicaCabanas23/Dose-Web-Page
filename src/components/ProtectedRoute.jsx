import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({children, redirectTo="/"}) => {    
    /*if (useAuth() === null) {
        return <Navigate to={redirectTo}/>
    }*/
    
    return children ? children : <Outlet/> ;
}