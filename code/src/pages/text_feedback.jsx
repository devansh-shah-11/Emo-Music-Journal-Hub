import React, { useEffect, useState } from 'react';
import './feedback.css';

function TextFeedback() {
    const [text, setText] = useState([]);
    const [selectedTextEmotions, setSelectedTextEmotions] = useState(new Array(text.length).fill(''));
    const imageEmotions = ["anger", "contempt", "disgust", "fear", "happy", "sadness", "surprise"];
    const textEmotions = ['Sadness', 'Anger', 'Love', 'Surprise', 'Fear', 'Happy'];
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRAZDEuY29tIn0.H8wlcotJ3Sa3MTnbW9utGnmBUhhqZL3IG07I8oN0eDU';

    useEffect(() => {
        
        const websocket = new WebSocket('ws://localhost:8000/ws/text');
    
        websocket.onopen = () => {
            websocket.send(token);
        };
    
        websocket.onmessage = (event) => {
            const new_text = JSON.parse(event.data);
            setText(prevText => [...prevText, new_text]);
            setSelectedTextEmotions(prevSelectedEmotions => [...prevSelectedEmotions, new_text.emotion]);
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
        const updatedSelectedEmotions = [...selectedTextEmotions];
        updatedSelectedEmotions[index] = event.target.value;
        setSelectedTextEmotions(updatedSelectedEmotions);
    };

    const handleSubmit = (txt, index) => {
        const updatedText = text.filter((_, i) => i !== index);
        setText(updatedText);
        setSelectedTextEmotions(prevSelectedEmotions => {
            const updatedSelectedEmotions = [...prevSelectedEmotions];
            updatedSelectedEmotions.splice(index, 1);
            return updatedSelectedEmotions;
        });
        console.log('Text:', txt);
        const formData = new FormData();
        formData.append('text', txt.text);
        if (selectedTextEmotions[index]) {
            formData.append('emotion', selectedTextEmotions[index]);
        } else {
            formData.append('emotion', txt.emotion);
        }
        formData.append('session_token', token); 
        console.log('Form Data:', formData);
        fetch('http://localhost:8000/text_feedback', {
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
            <h1 className="Heading">Text Predictions</h1>
            {text.length === 0 ? (
                <h1 className="emptyText">No pending text for feedback</h1>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Text</th>
                            <th>Model Prediction</th>
                            <th>Actual Emotion</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {text.map((txt, index) => (
                            <tr key={index}>
                                <td>
                                    {txt.text}
                                </td>
                                <td>{txt.emotion}</td>
                                <td>
                                    <select value={selectedTextEmotions[index]} onChange={(event) => handleEmotionChange(index, event)}>
                                        <option value="">Select Emotion</option>
                                        {textEmotions.map((emotion, idx) => (
                                            <option key={idx} value={emotion}>{emotion}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                <div className='button-select'>
                                    <button onClick={() => handleSubmit(txt, index)}>Submit</button>
                                </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TextFeedback;
