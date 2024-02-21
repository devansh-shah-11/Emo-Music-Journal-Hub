import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

const PrivateRoute = () => {

    const user = useSelector(selectUser);
    console.log("Initial User: ", user)
    const location = useLocation();
    const redirectLoginUrl = `/login?redirectTo=${encodeURI(location.pathname)}`;

    return user ? <Outlet /> : <Navigate to={redirectLoginUrl} />;
}

export default PrivateRoute;