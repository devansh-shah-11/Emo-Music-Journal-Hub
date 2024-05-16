# Emotion Detection and Music Recommendation Project

## Overview

The system design for the Emotion Detection and Music Recommendation project integrates various machine learning and deep learning components to create an advanced and personalized user experience. The core functionality revolves around capturing and interpreting user emotions through facial expressions, speech, and text, and then recommending music that aligns with the detected emotions. This document details the design considerations, architecture, and components involved in the system.

## Architecture

The architecture of the system is composed of several interconnected modules, each responsible for a specific functionality. The primary components include:

1. **Front-end User Interface (UI)**
2. **Back-end Server**
3. **Machine Learning Models**
4. **Database**

### 1. Front-end User Interface (UI)

The front-end is built using React, HTML, CSS, and JavaScript to create a responsive and user-friendly interface. The main functions of the front-end include:

- **User Authentication**: Allows users to sign up, log in, and log out.
- **Emotion Capture**: Interfaces with the user's webcam to capture facial expressions.
- **Voice Input**: Captures user speech for transcription and analysis.
- **Text Input**: Allows users to journal their thoughts.
- **Feedback Mechanism**: Users can provide feedback on the predicted emotions.

### 2. Back-end Server

The back-end was originally implemented using Node.js and shifted now to FastAPI for better handling Machine Learning models, providing a robust environment to handle API requests and manage data flow between the front-end, database, and machine learning models. The key responsibilities of the back-end include:

- Handling user authentication and session management.
- Managing API requests and responses.
- Orchestrating data flow between different modules.
- Ensuring security and data privacy.

### 3. Machine Learning Models

The system employs multiple machine learning models to perform various tasks:

- **Facial Emotion Recognition**: A ResNet50 model is used to analyze facial expressions captured by the webcam and classify them into different emotional states.
- **Speech-to-Text Conversion**: OpenAI Whisper, is used to transcribe spoken words into text.
- **Text-based Emotion Analysis**: A custom sequential model using Bidirectional LSTMs is used to analyze the emotional content of user-generated text.
- **Music Recommendation**: Facebook MusicGen model is used to generate music based on the predicted emotions.

### 4. Database

The system uses MongoDB to store user data, including user profiles, journal entries, feedback, and music preferences. The database is responsible for:

- Storing user information securely.
- Managing user-generated content.
- Storing feedback and emotion predictions.

