# SmartLyricsJournal

SmartLyricsJournal is a web application that allows users to write journal notes, convert speech to text, save their notes, view past journal entries on a calendar, perform sentiment analysis to classify their mood, and use video stream to detect emotions.

## Features

### 1. Journal Notes

Users can write their journal notes using the provided text editor. Additionally, they can also use speech-to-text functionality to convert their spoken words into text.

### 2. Save Button

The application provides a save button that allows users to save their journal notes. This ensures that their entries are securely stored and can be accessed later.

### 3. Sentiment Analysis

The application utilizes sentiment analysis to analyze the mood of the user based on their journal entries. This feature provides insights into the user's emotional state over time.

### 4. Emotion Detection

SmartLyricsJournal incorporates a video stream functionality that detects the user's emotions in real-time. This feature uses computer vision techniques to analyze facial expressions and provide feedback on the user's emotional state.

### 5. Speech to Text
SmartLyricsJournal provides a speech-to-text feature that allows users to convert their spoken words into text. This functionality enables users to dictate their journal entries instead of typing them manually. And this feature is happening real-time.


## Installation

To run the application locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/devansh-shah-11/SmartLyricJournal
    ```

2. Install the required dependencies:

    a. **Frontend**
        - Navigate to the `code` directory
        
        - Run:
          ```
          npm install
          ```

    b. **Backend**
        - Navigate to the `code/Backend` directory

        - Run:
          ```
          pip install -r requirements.txt
          ```

3. Run the application:

    a. **Frontend**
        - Navigate to the `code` directory

        - Run:
          ```
          npm run dev
          ```

    b. **Backend**
        - Navigate to the `code/Backend` directory

        - Run:
          ```
          uvicorn main:app --reload
          ```

4. Open the application in your web browser:
    ```bash
    http://localhost:5173/
    ```


## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## Authors

- Devansh Shah [@devansh-shah-11](https://github.com/devansh-shah-11)
