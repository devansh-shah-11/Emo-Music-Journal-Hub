import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "../context/usercontext.jsx";
import Login from "../pages/login.jsx"
import Signup from "../pages/signup.jsx"
import PrivateRoute from "./routes.jsx";
import Dashboard from "../pages/dashboard.jsx";
import TasksCalendar from "../pages/entries.jsx";

function Nav() {
    return (
    <BrowserRouter>
        <UserProvider>
        <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route element={<PrivateRoute />}>
                <Route exact path="/" element={<Dashboard />} />
            </Route>
            <Route exact path="/view_entry" element={ <TasksCalendar /> } />
        </Routes>
        </UserProvider>
    </BrowserRouter>
    );
    }

export default Nav;