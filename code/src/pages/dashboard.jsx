import { useEffect, useState, useRef, useContext } from 'react';
import './dashboard.css';
import axios from "axios";
import { UserContext } from "../context/usercontext.jsx";

function Dashboard(){

    const { user } = useContext(UserContext);
    const { logOutUser } = useContext(UserContext);

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

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

    const redirectNow = (path) => (e) => {
        e.preventDefault();
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
            const response = await axios.post('http://localhost:3001/addentry', {
                headers: {
                    session_token: user,
                },
                params: {
                    title: title,
                    body: body
                }
            });
            console.log("Response: ", response);
            if (response.status === 200) {
                alert("Journal saved successfully!");
            }
            setTitle('');
            setBody('');
        } catch (error) {
            console.log("Error saving journal: ", error);
        }
    }
    
    const [showSongs, setShowSongs] = useState(false);

    const videoRef = useRef(null);

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            })
            .catch(err => console.log(err));
        }
    }, []);

    return (
        <div class="dashboard">
            <div class="navbar">
                <div class="navbar-content">
                    <div class="app-name">Smart Journal</div>
                    <div class="spacer"></div>
                        <div class="nav-items">
                            <a href="/view_entry" onClick={redirectNow('/view_entry')} style={{textDecoration: "none"}}>View Past Entries</a>
                        </div>
                            <div class="dropdown" style={{height: "90px"}}>
                                <button class="dropbtn">Profile
                                    <i class="fa fa-caret-down"></i>
                                </button>
                                <div class="dropdown-content">
                                <a href="/myprofile"  class="nav-link">My Profile</a>
                                <a href="#logout"  class="nav-link" onClick={logOut}>Logout</a>
                            </div>
                        </div>
                </div>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <div class="dashboard-content">
                <div className="left-space"></div>
                <div className="text-box">
                    <input 
                        type="text" 
                        placeholder="Title" 
                        class="title-input" 
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
    )
}

export default Dashboard;