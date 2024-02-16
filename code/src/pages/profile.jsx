import { useEffect, useState, useContext } from 'react';
import axios from "axios";
import './profile.css';
import { UserContext } from "../context/usercontext.jsx";
import { useNavigate } from 'react-router-dom';

function Profile() {

    const user = JSON.parse(localStorage.getItem('user'));
    const { logOutUser } = useContext(UserContext);
    const [userData, setUserData] = useState(null);

    console.log("User: ", user);

    async function getUser() {
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
                console.log("User Data: ", userData);
            }
        } catch (error) {
            console.log("Error getting user data: ", error);
            alert("Error getting user data. Please try again!");
        }
    }

    useEffect(() => {
        getUser();
    }, userData);

    const navigate = useNavigate();

    const logOut = async () => {
        try {
            console.log("Logging out user: ", user);
            const loggedOut = await logOutUser(user);
            if (loggedOut) {
                // window.location.reload(true);
                localStorage.removeItem('user');
                navigate('/login');
            }
        } catch (error) {
            alert(error)
        }
    }
    
    if(!userData) {
        navigate('/Login');
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
                            <a href="/" class="nav-link" onClick={() => navigate('/')}>Dashboard</a>
                            <a href="#logout"  class="nav-link" onClick={logOut}>Logout</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='profile-container'>
                {userData && (
                    <div>
                        <h1 style={{textAlign: "center"}}>Profile</h1>
                        <div class="profile-details">
                            <div class="profile-item">
                                <div class="profile-label">Name</div>
                                <div class="profile-value">{userData.name}</div>
                            </div>
                            <div class="profile-item">
                                <div class="profile-label">Email</div>
                                <div class="profile-value">{userData.email}</div>
                            </div>
                            <div class="profile-item">
                                <div class="profile-label">Mobile Number</div>
                                <div class="profile-value">{userData.mobilenumber}</div>
                            </div>
                            <div class="profile-item">
                                <div class="profile-label">Age</div>
                                <div class="profile-value">{userData.age}</div>
                            </div>
                            <div class="profile-item">
                                <div class="profile-label">Occupation</div>
                                <div class="profile-value">{userData.occupation}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile;