import { useEffect, useState, useContext } from 'react';
import axios from "axios";
import './profile.css';
import { UserContext } from "../context/usercontext.jsx";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { logout, selectUser } from "../features/userSlice";

function Profile() {

    let user = useSelector(selectUser);
    if(!user) {
        user = localStorage.getItem("user");
        console.log("User from local storage: ", user);
    }
    console.log("Yoman User: ", user)
    const { logOutUser } = useContext(UserContext);
    const [userData, setUserData] = useState(null);
    const dispatch = useDispatch();
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
    }, [user]);

    const navigate = useNavigate();

    const logOut = async () => {
        try {
            console.log("Logging out user: ", user);
            const loggedOut = await logOutUser(user);
            if (loggedOut) {
                localStorage.removeItem("user");
                dispatch(logout());
                navigate('/login');
            }
        } catch (error) {
            alert(error)
        }
    }
    
    if(!userData) {
        navigate('/login');
    }

    return (
        <div className="dashboard">
            <div className="navbar">
                <div className="navbar-content">
                    <div className="app-name">Smart Journal</div>
                    <div className="spacer"></div>
                    <div className="dropdown" style={{height: "90px"}}>
                        <button className="dropbtn">Profile
                        </button>
                        <div className="dropdown-content">
                            <a href="/" className="nav-link" onClick={() => navigate('/dashboard')}>Dashboard</a>
                            <a href="#logout"  className="nav-link" onClick={logOut}>Logout</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='profile-container'>
                {userData && (
                    <div>
                        <h1 style={{textAlign: "center"}}>Profile</h1>
                        <div className="profile-details">
                            <div className="profile-item">
                                <div className="profile-label">Name</div>
                                <div className="profile-value">{userData.name}</div>
                            </div>
                            <div className="profile-item">
                                <div className="profile-label">Email</div>
                                <div className="profile-value">{userData.email}</div>
                            </div>
                            <div className="profile-item">
                                <div className="profile-label">Mobile Number</div>
                                <div className="profile-value">{userData.mobilenumber}</div>
                            </div>
                            <div className="profile-item">
                                <div className="profile-label">Age</div>
                                <div className="profile-value">{userData.age}</div>
                            </div>
                            <div className="profile-item">
                                <div className="profile-label">Occupation</div>
                                <div className="profile-value">{userData.occupation}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile;