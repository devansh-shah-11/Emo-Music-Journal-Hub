import { useEffect, useState, useRef, useContext } from 'react';
import axios from "axios";
import { UserContext } from "../context/usercontext.jsx";
import './profile.css';
import { useNavigate } from 'react-router-dom';

function Profile() {

    const { user } = useContext(UserContext);
    const { logOutUser } = useContext(UserContext);
    const [userData, setUserData] = useState(null);

    console.log("User: ", user)

    async function getUserData() {
        try {
            console.log("Getting user data: ", user);
            const response = await axios.get('http://localhost:3001/getuser', {
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

    useEffect(() => {
        getUserData();
    }, []);

    const navigate = useNavigate();

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
                <div className="user-profile">
                    <h2>User Profile</h2>
                    <p>Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    <p>Age: {userData.age}</p>
                    <p>Occupation: {userData.occupation}</p>
                </div>
            </div>
        </div>
    )
}

export default Profile;