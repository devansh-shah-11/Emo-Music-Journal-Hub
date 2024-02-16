import { useEffect, useState, useContext } from 'react';
import axios from "axios";
import './profile.css';
import { UserContext } from "../context/usercontext.jsx";
import { useNavigate } from 'react-router-dom';

function Profile() {

    console.log(localStorage)
    // const { logOutUser } = useContext(UserContext);
    // const [user, setUser] = useState(localStorage.getItem('user'));

    // useEffect(() => {
    //     setUser(JSON.parse(localStorage.getItem('user')));
    // }, []);

    const user = JSON.parse(localStorage.getItem('user'));
    
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
                console.log("User Data: ", response.data);
            }
        } catch (error) {
            console.log("Error getting user data: ", error);
            alert("Error getting user data. Please try again!");
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    const navigate = useNavigate();

    // const logOut = async () => {
    //     try {
    //         console.log("Logging out user: ", user);
    //         const loggedOut = await logOutUser(user);
    //         if (loggedOut) {
    //             window.location.reload(true);
    //         }
    //     } catch (error) {
    //         alert(error)
    //     }
    // }

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
                            {/* <a href="#logout"  class="nav-link" onClick={logOut}>Logout</a> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className='profile-container'>
                <div className="user-profile">
                    <h2>User Profile</h2>
                    {/* <p>Name: {user.data.name}</p>
                    <p>Email: {user.data.email}</p>
                    <p>Age: {user.data.age}</p>
                    <p>Occupation: {user.data.occupation}</p>
                    <p>Mobile Number: {user.data.mobilenumber}</p>
                    <p>Journal Entries: {user.data.entries}</p> */}
                </div>
            </div>
        </div>
    )
}

export default Profile;