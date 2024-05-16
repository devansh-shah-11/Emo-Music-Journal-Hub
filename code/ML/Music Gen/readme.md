# Music Generation Project

## About the Model

Music Generation is a novel and unique approach that generates tunes based on predicted emotions. This project focuses on enhancing user experience through personalized and mood-enhancing musical compositions. The MusicGen model introduces:
1. Text to Music
2. Music to Music

In the paper [MusicGen](https://arxiv.org/abs/2306.05284), the authors introduced a single Language Model (LM) for conditional music generation that operates on compressed discrete music representations. It utilizes a single-stage transformer Language Model with efficient token interleaving patterns, eliminating the need for multiple models. It can generate high-quality mono and stereo music samples conditioned on textual descriptions or melodic features.

## Usage

For this project, the key focus is on Music Generation technologies to enhance user experience through personalized and mood-enhancing musical compositions. The predicted emotion, based on facial expression and text, plays a crucial role.

### Emotion Classification

Emotions are classified as either Positive or Negative:
- Positive: Love, Surprise, Happiness
- Negative: Anger, Fear, Disgust, etc.

### Scenarios

- **Both Image and Text are of the same category**: The emotion is passed ahead to the pipeline.
- **One is positive while the other is negative**: A note is sent to the user stating the conflict and asking them to resolve it via the feedback page.
- **Only text emotion / image emotion available**: The available emotion is passed ahead to the pipeline.

### Pipeline

Using various prompts from model examples, several prompts for each emotion were generated using Llama and ChatGPT (about 30 prompts per emotion). When an emotion is passed through the pipeline, a random prompt from the stored list is chosen and processed through the MusicGen Model synthesizer. The `max_tokens` parameter is modifiable and determines the length of the generated audio. The text field is the prompt, which can change depending on the predicted emotions.

Overall, the generated audio closely matches the given text prompt!

## Conclusion
The `Demo` folder has a few examples of the generated audio files. Refer to the `MusicGen_prediction_final` jupyter notebook to run your own inference on the model.