import { useEffect, useState, useRef } from 'react';
import './dashboard.css';

function Dashboard(){

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
                    <div class="app-name">Application Name</div>
                    <div class="spacer"></div>
                        <div class="nav-items">
                            <a href="#view_entries" style={{textDecoration: "none"}}>View Past Entries</a>
                        </div>
                        <div class="dropdown" style={{height: "90px"}}>
                            <button class="dropbtn">Profile
                                <i class="fa fa-caret-down"></i>
                            </button>
                            <div class="dropdown-content">
                            <a href="#my_profile">My Profile</a>
                            <a href="#logout">Logout 
                                <i class="fa fa-power-off"></i>
                            </a>
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
                    <input type="text" placeholder="Title" class="title-input" />
                    <textarea placeholder="Body" class="body-input"></textarea>
                    <button className="save-button">Save Journal</button>
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