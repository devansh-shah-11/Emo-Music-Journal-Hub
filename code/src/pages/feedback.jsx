import React, { useEffect, useState } from 'react';
import './feedback.css';

function ImageFeedback() {
    const [images, setImages] = useState([]);
    const selectedEmotions = ["anger", "contempt", "disgust", "fear", "happy", "sadness", "surprise"];

    useEffect(() => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRAZDEuY29tIn0.H8wlcotJ3Sa3MTnbW9utGnmBUhhqZL3IG07I8oN0eDU';
        const websocket = new WebSocket('ws://localhost:8000/ws');
    
        websocket.onopen = () => {
            // Send session token to server
            websocket.send(token);
        };
    
        websocket.onmessage = (event) => {
            const image = JSON.parse(event.data);
            setImages(prevImages => [...prevImages, image]);
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
        const updatedImages = [...images];
        updatedImages[index].actualEmotion = event.target.value;
        setImages(updatedImages);
    };

    const handleSubmit = () => {
        const updatedImages = images.filter(img => !img.actualEmotion);
        setImages(updatedImages);
    
        const formData = new FormData();
        formData.append('file', file);
        formData.append('emotion', selectedEmotions); 
        formData.append('session_token', token); 
    
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
            <h1>Image Predictions</h1>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Model Prediction</th>
                        <th>Actual Emotion</th>
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
                                <select value={img.actualEmotion || ''} onChange={(event) => handleEmotionChange(index, event)}>
                                    <option value="">Select Emotion</option>
                                    {selectedEmotions.map((emotion, idx) => (
                                        <option key={idx} value={emotion}>{emotion}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default ImageFeedback;
