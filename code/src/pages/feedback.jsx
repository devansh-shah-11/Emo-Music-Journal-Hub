import React, { useState } from 'react';
import './feedback.css';
import ImageFeedback from './image_feedback';
import TextFeedback from './text_feedback';

function FeedbackPage() {
    const [feedbackType, setFeedbackType] = useState('image');

    return (
        <div className="feedback-container">
            <h1 className="Heading">Feedback</h1>
            <div className="feedback-buttons">
                <button onClick={() => setFeedbackType('image')}>Image Feedback</button>
                <button onClick={() => setFeedbackType('text')}>Text Feedback</button>
            </div>
            {feedbackType === 'image' ? (
                <ImageFeedback />
            ) : (
                <TextFeedback />
            )}
        </div>
    );
}

export default FeedbackPage;
