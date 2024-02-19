import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "../context/usercontext.jsx";
import Login from "../pages/login.jsx"
import Signup from "../pages/signup.jsx"
import PrivateRoute from "./routes.jsx";
import Dashboard from "../pages/dashboard.jsx";
import TasksCalendar from "../pages/entries.jsx";
import Profile from "../pages/profile.jsx";


function Nav() {
    return (
        <BrowserRouter>
            <UserProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/" element={<PrivateRoute />}>
                        <Route path="dashboard" element={<Dashboard />} />
                    </Route>
                    <Route path="view_entry" element={<TasksCalendar />} />
                    <Route path="myprofile" element={<Profile />} />
                </Routes>
            </UserProvider>
        </BrowserRouter>
    );
}

export default Nav;