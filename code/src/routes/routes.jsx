import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/usercontext.jsx";
import Dashboard from "../pages/dashboard.jsx";

const PrivateRoute = () => {

    const { user } = useContext(UserContext);
    const location = useLocation();
    const redirectLoginUrl = `/login?redirectTo=${encodeURI(location.pathname)}`;

    return !user ? <Navigate to={redirectLoginUrl} /> : <Dashboard/> ;
}

export default PrivateRoute;