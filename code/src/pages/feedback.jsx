import React, { useEffect, useState } from 'react';
import './feedback.css';

function ImageFeedback() {
    const [images, setImages] = useState([]);
    const [selectedEmotions, setSelectedEmotions] = useState(new Array(images.length).fill(''));
    const Emotions = ["anger", "contempt", "disgust", "fear", "happy", "sadness", "surprise"];
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRAZDEuY29tIn0.H8wlcotJ3Sa3MTnbW9utGnmBUhhqZL3IG07I8oN0eDU';

    useEffect(() => {
        
        const websocket = new WebSocket('ws://localhost:8000/ws');
    
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
            <h1 className="Heading">Image Predictions</h1>
            {images.length === 0 ? (
                <h1 className="emptyText">No pending images for feedback</h1>
            ) : (
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
                                        {Emotions.map((emotion, idx) => (
                                            <option key={idx} value={emotion}>{emotion}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => handleSubmit(img, index)}>Submit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ImageFeedback;
