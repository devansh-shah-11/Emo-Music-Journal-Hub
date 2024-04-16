import { useEffect, useState, useRef, useContext } from 'react';
import './dashboard.css';
import axios from "axios";
import { UserContext } from "../context/usercontext.jsx";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../features/userSlice";
import { useNavigate } from "react-router-dom";

function Dashboard(){

    const { logOutUser } = useContext(UserContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    let user = useSelector(selectUser);
    console.log("User from redux: ", user);
    if(user === "null" || !user) {
        user = localStorage.getItem("user");
    }

    const notLoggedIn = () => {
        console.log("Inside notLoggedIn function")
        if (!user || user === "null") {
            console.log("User not logged in. Redirecting to login page...");
            navigate('/login');
        }
        else {
            console.log("User logged in: ", user);
            localStorage.setItem("user", user);
        }
    }

    useEffect(() => {
        notLoggedIn();
    }, []);

    const logOut = async () => {
        try {
            console.log("Logging out user: ", user);
            const loggedOut = await logOutUser(user);
            console.log("Logged out: ", loggedOut);
            if (loggedOut) {
                dispatch(logout());
                localStorage.removeItem("user");
                console.log("Logged out successfully!");
                navigate('/login');
            }
        } catch (error) {
            alert(error)
        }
    }

    const redirectProfile = () => {
        localStorage.setItem("user", user);
        console.log(localStorage)
        navigate('/myprofile')
    }

    const redirectNow = (path) => (e) => {
        e.preventDefault();
        console.log("Redirecting to: ", path)
        console.log("Current User: ", user)
        window.location.href = path;
    }

    const SaveJournal = async () => {

        console.log("Saving Journal...");
        console.log(`Title: ${title}`);
        console.log(`Body: ${body}`);

        const journalEntry = {
            title,
            body
        };
        console.log(journalEntry);
        try {
            const url = 'http://localhost:8000/addentry'
            const response = await axios.post(url,
            {
                title: title,
                body: body,
                session_token: user,
            });
            console.log("Response: ", response);
            if (response.status === 200) {
                alert("Journal saved successfully!");
                console.log("Now predicting emotion...")
                const url = 'http://localhost:8000/predicttext'
                const response = await axios.post(url,
                {
                    text: body,
                });
                console.log("Predicted emotion is: ", response);
                alert("Predicted emotion is: " + response.data.prediction);
            }
            setTitle('');
            setBody('');
        } catch (error) {
            console.log("Error saving journal: ", error);
        }
    }
    
    const [showSongs, setShowSongs] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (navigator.mediaDevices?.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                    setInterval(() => {
                        if (videoRef.current && canvasRef.current) {
                            const video = videoRef.current;
                            const canvas = canvasRef.current;
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            const context = canvas.getContext('2d');
                            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                            canvas.toBlob(blob => {
                                let formData = new FormData();
                                formData.append('file', blob, 'image.png');
                                const url = 'http://localhost:8000/predict';
                                console.log("Sending image to server...");
                                axios.post(url, formData, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                })
                                .then(response => {
                                    console.log("Image is sent to server and response is: ", response.data);
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                            }, 'image/png');
                        }
                    }, 60000);
                })
                .catch(err => console.log(err));
        }
    }, []);

    return (
        user ? (
            <div className="dashboard">
                <div className="navbar">
                    <div className="navbar-content">
                        <div className="app-name">Smart Journal</div>
                        <div className="spacer"></div>
                            <div className="nav-items">
                                <a href="/view_entry" onClick={redirectNow('/view_entry')} style={{textDecoration: "none"}}>View Past Entries</a>
                            </div>
                                <div className="dropdown" style={{height: "90px"}}>
                                    <button className="dropbtn">Profile
                                    </button>
                                    <div className="dropdown-content">
                                    <a href="/myprofile" onClick={redirectProfile} className="nav-link">My Profile</a>
                                    <a href="#logout" className="nav-link" onClick={logOut}>Logout</a>
                                </div>
                            </div>
                    </div>
                </div>
                <br></br>
                <br></br>
                <br></br>
                <div className="dashboard-content">
                    <div className="left-space"></div>
                    <div className="text-box">
                        <input 
                            type="text" 
                            placeholder="Title" 
                            className="title-input" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea 
                            placeholder="Body" 
                            className="body-input" 
                            value={body} 
                            onChange={e => setBody(e.target.value)} 
                        />
                        <button className="save-button" onClick={SaveJournal}>Save Journal</button>
                    </div>
                    <div className="video-box">
                        <video ref={videoRef} id="live-video" autoPlay playsInline></video>
                        <canvas ref={canvasRef} id="canvas" style={{display: "none"}} />
                    </div>
                </div>
                <button onClick={() => setShowSongs(!showSongs)} className="song-button">Generate Songs</button>

                {showSongs && (
                    <div className="recommendation-box">
                        <h2>Title: Songs Recommended</h2>
                        <ol>
                        <li>Song 1</li>
                        <li>Song 2</li>
                        <li>Song 3</li>
                        <li>Song 4</li>
                        <li>Song 5</li>
                        </ol>
                    </div>
                )}
            </div>
        ) : (
            <div>
                <h1 style={{color: "red"}}>Not logged in</h1>
            </div>
        )
    )
}

export default Dashboard;