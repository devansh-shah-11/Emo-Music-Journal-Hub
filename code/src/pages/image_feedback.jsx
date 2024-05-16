import React, { useEffect, useState } from 'react';
import './feedback.css';
import { UserContext } from "../context/usercontext.jsx";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectUser } from "../features/userSlice";

function ImageFeedback() {
    const [images, setImages] = useState([]);
    const [selectedEmotions, setSelectedEmotions] = useState(new Array(images.length).fill(''));
    const imageEmotions = ["anger", "contempt", "disgust", "fear", "happy", "sadness", "surprise"];
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRAZDEuY29tIn0.H8wlcotJ3Sa3MTnbW9utGnmBUhhqZL3IG07I8oN0eDU';

    let token = useSelector(selectUser);
    if(!token) {
        token = localStorage.getItem("user");
        console.log("User from local storage: ", token);
    }
    console.log("Yoman User: ", token)

    useEffect(() => {
        
        const websocket = new WebSocket('ws://localhost:8000/ws/image');
    
        websocket.onopen = () => {
            websocket.send(token);
        };
    
        websocket.onmessage = (event) => {
            const image = JSON.parse(event.data);
            setImages(prevImages => [...prevImages, image]);
            setSelectedEmotions(prevSelectedEmotions => [...prevSelectedEmotions, image.emotion]);
        };
    
        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    
        websocket.onclose = () => {
            console.log('WebSocket connection closed');
        };
    
        return () => {
            websocket.close();
        };
    }, []);    

    const handleEmotionChange = (index, event) => {
        const updatedSelectedEmotions = [...selectedEmotions];
        updatedSelectedEmotions[index] = event.target.value;
        setSelectedEmotions(updatedSelectedEmotions);
    };

    const handleSubmit = (img, index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        setSelectedEmotions(prevSelectedEmotions => {
            const updatedSelectedEmotions = [...prevSelectedEmotions];
            updatedSelectedEmotions.splice(index, 1);
            return updatedSelectedEmotions;
        });
        console.log('Image:', img);
        const formData = new FormData();
        formData.append('file', img.filename);
        if (selectedEmotions[index]) {
            formData.append('emotion', selectedEmotions[index]);
        } else {
            formData.append('emotion', img.emotion);
        }
        formData.append('session_token', token); 
        console.log('Form Data:', formData);
        fetch('http://localhost:8000/image_feedback', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            console.log('Success:', response);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
    

    return (
        <div className="feedback-container"> 
            {images.length === 0 ? (
                <h1 className="emptyText">No pending images for feedback</h1>
            ) : (
                <div>
                    <h1 className="Heading">Image Predictions</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Model Prediction</th>
                                <th>Actual Emotion</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {images.map((img, index) => (
                                <tr key={index}>
                                    <td>
                                        <img src={`data:image/jpeg;base64,${img.data}`} alt="Prediction" />
                                    </td>
                                    <td>{img.emotion}</td>
                                    <td>
                                        <select value={selectedEmotions[index]} onChange={(event) => handleEmotionChange(index, event)}>
                                            <option value="">Select Emotion</option>
                                            {imageEmotions.map((emotion, idx) => (
                                                <option key={idx} value={emotion}>{emotion}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                    <div className='button-select'>
                                        <button onClick={() => handleSubmit(img, index)}>Submit</button>
                                    </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ImageFeedback;
