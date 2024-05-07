import React, { useEffect, useState } from 'react';
import './feedback.css';

function ImageFeedback() {
    const [images, setImages] = useState([]);

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

    return (
        <div className="feedback-container">
            <h1>Image Predictions</h1>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Prediction</th>
                    </tr>
                </thead>
                <tbody>
                    {images.map((img, index) => (
                        <tr key={index}>
                            <td>
                                <img src={`data:image/jpeg;base64,${img.data}`} alt="Prediction" />
                            </td>
                            <td>{img.emotion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ImageFeedback;