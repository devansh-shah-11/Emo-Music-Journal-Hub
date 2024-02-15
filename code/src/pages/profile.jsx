import { useEffect, useState, useRef, useContext } from 'react';
import axios from "axios";
import { UserContext } from "../context/usercontext.jsx";
import './profile.css';
import { useNavigate } from 'react-router-dom';

function Profile() {

    const navigate = useNavigate();

    const { user } = useContext(UserContext);
    const { logOutUser } = useContext(UserContext);

    const logOut = async () => {
        try {
            console.log("Logging out user: ", user);
            const loggedOut = await logOutUser(user);
            if (loggedOut) {
                window.location.reload(true);
            }
        } catch (error) {
            alert(error)
        }
    }

    return (
        <div class="dashboard">
            <div class="navbar">
                <div class="navbar-content">
                    <div class="app-name">Smart Journal</div>
                    <div class="spacer"></div>
                    <div class="dropdown" style={{height: "90px"}}>
                        <button class="dropbtn">Profile
                            <i class="fa fa-caret-down"></i>
                        </button>
                        <div class="dropdown-content">
                            <a href="/" class="nav-link" onClick={navigate('/')}>Dashboard</a>
                            <a href="#logout"  class="nav-link" onClick={logOut}>Logout</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className='profile-container'>

            </div>
            <br></br>
            <br></br>
            <br></br>
            <div class="dashboard-content">
                
            </div>
        </div>
    )
}

export default Profile;