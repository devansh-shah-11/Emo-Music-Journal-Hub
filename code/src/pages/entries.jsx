import React from 'react';
import { useState, useEffect, useRef, useContext} from 'react';
import TextField from '@mui/material/TextField';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './entries.css';
import axios from "axios";
import { UserContext } from "../context/usercontext.jsx";
import { useNavigate } from 'react-router-dom';

function TasksCalendar() {
    console.log(localStorage.user)
    const user = localStorage.getItem('user');
    const { logOutUser } = useContext(UserContext);
    const [userData, setUserData] = useState(null);

    async function getEntries() {
        try {
            console.log("Getting user data: ", user);
            const response = await axios.get('http://localhost:8000/getentry', {
                headers: {
                    session_token: user,
                }
            });
            console.log("User Data: ", response);
            if (response.status === 200) {
                setUserData(response.data);
            }
        } catch (error) {
            console.log("Error getting user data: ", error);
            alert("Error getting user data. Please try again!");
        }
    }

    const notLoggedIn = () => {
        console.log("Inside notLoggedIn function")
        if (!user || user === "null") {
            console.log("User not logged in. Redirecting to login page...");
            navigate('/login');
        }
        else {
            console.log("User logged in: ", user);
        }
    }

    useEffect(() => {
        notLoggedIn();
    }, []);

    useEffect(() => {
        getEntries();
        console.log("User Data in useEffect part: ", userData);
    }, userData);

    const navigate = useNavigate();

    const logOut = async () => {
        try {
            console.log("Logging out user: ", user);
            const loggedOut = await logOutUser(user);
            if (loggedOut) {
                localStorage.removeItem('user');
                navigate('/login');
            }
        } catch (error) {
            alert(error)
        }
    }

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [journalentry, setjournalentry] = useState([]);

    useEffect(() => {
        console.log('Selected date: ', selectedDate);
        console.log("Journal Entries: ", userData);
        let tasksDuetoDate = [];
        if (userData){
            tasksDuetoDate = Object.entries(userData).filter(([key, journal]) => {
                const journalDate = new Date(journal[1]);
                console.log('Journal Date: ', journalDate);
                return journalDate.getDate() === selectedDate.getDate() &&
                    journalDate.getMonth() === selectedDate.getMonth() &&
                    journalDate.getFullYear() === selectedDate.getFullYear();
            }) || [];
            console.log('Tasks due to date: ', tasksDuetoDate); 
            console.log('Journal Entries: ', journalentry)
        }
        setjournalentry(tasksDuetoDate);
    }, [selectedDate, userData]);

    const handleMouseEnter = (date) => {
        console.log('Mouse entered on date: ', date);
        setSelectedDate(date);
    };

    return (
        user ? (
            <div className="dashboard">
                <div className="navbar">
                    <div className="navbar-content">
                        <div className="app-name">Smart Journal</div>
                        <div className="spacer"></div>
                        <div className="dropdown" style={{height: "90px"}}>
                            <button className="dropbtn">Profile
                            </button>
                            <div className="dropdown-content">
                                <a href="/dashboard" className="nav-link" onClick={() => navigate('/dashboard')}>Dashboard</a>
                                <a href="#logout"  className="nav-link" onClick={logOut}>Logout</a>
                            </div>
                        </div>
                    </div>
                </div>
            
                <div className='container'>
                    <TextField 
                        id="outlined-basic" 
                        label="Search" 
                        variant="outlined" 
                        className="search-bar"
                    />
                    <Calendar
                        tileContent={({ date, view }) => view === 'month' && <div onMouseEnter={() => handleMouseEnter(date)} style={{ height: '100%', width: '100%' }}></div>}
                    />
                    <ul>
                        {journalentry.map((entry, index) => {
                            return (
                                <li key={index} className='task-item'>{entry[0]}</li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        ) : (
            <div>
                <h1 style={{color: "red"}}>You are not logged in. Please log in to continue</h1>
            </div>
        )
    );
}

export default TasksCalendar;