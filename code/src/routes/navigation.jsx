import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "../context/usercontext.jsx";
import Login from "../pages/login.jsx"
import Signup from "../pages/signup.jsx"
import PrivateRoute from "./routes.jsx";
import Dashboard from "../pages/dashboard.jsx";
import TasksCalendar from "../pages/entries.jsx";
import Profile from "../pages/profile.jsx";
import Feedback from "../pages/feedback.jsx"

function Nav() {
    return (
        <BrowserRouter>
            <UserProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    {/* <Route path="/" element={<PrivateRoute />}>
                        
                    </Route> */}
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="view_entry" element={<TasksCalendar />} />
                    <Route path="myprofile" element={<Profile />} />
                    <Route path="feedback" element={<Feedback />} />
                </Routes>
            </UserProvider>
        </BrowserRouter>
    );
}

export default Nav;