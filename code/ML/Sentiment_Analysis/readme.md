## Text Sentiment Analysis

### Preprocessing Techniques

- **Tokenization**: Tokenization splits text into smaller units, such as words or subwords. For example, the word "Chatbots" can be tokenized as "Chat" and "bots". This is the 1st and very important step in preprocessing text data to ensure least out of the vocabulary words. It turns each text into a sequence of integers (where each number is the index of a token in a dictionary).

- **PoS Tagging**: PoS or Part of Speech tagging is a process of associating the corresponding part of speech (Adjective, Noun, Verb etc) to a particular word based on its context and meaning. For example, quick is an adjective while Devansh is a noun.

- **Stemming**: Stemming reduces words to their root form by removing suffixes. It is a rule based method. It is much faster than lemmatization but less accurate. For example, "Running" becomes "run" but doesn't maintain the correct part of speech, which can sometimes lead to loss of meaning.

- **Lemmatization**: Lemmatization reduces words to their base or root form. Unlike stemming, it considers the context and converts words to their meaningful base forms. For example,  "Running" becomes "run" while maintaining the meaning of the sentence, which helps in reducing dimensionality while keeping the meaning of the word same. So, while we can use any of Stemming or Lemmatization. While stemming simply involves cutting words off according to Math rules, Lemmatization ensures that the cut word is a part of the dictionary. Hence, I prefer Lemmatization.

- **Stopword Removal**: Stopwords are common words (like "and", "the", "is") that are often removed because they do not carry significant meaning for the task at hand. It ensures that model focusses on more rare words which are important for detecting emotion,

- **Label Encoding**: It converts categorical data into numerical form. Thus, the 7 emotion categories are passed through a Label Encoder. 

- **Padding**: It is the process of ensuring that all sequences in a dataset have the same length, which is required for faster training and evaluation using batch processing in neural networks.

### Model Architecture

The Sentiment Analysis is a sequential model trained from scratch using the dataset with the following layers:

1. **Embedding**: Embeddings convert the sentences into vectors of fixed size. These vectors capture the relationships between words, meaning similar words have similar vectors. For example, cat and dog will have similar vectors than cat and fruit. This helps the model understand the context and sentiment in the text. Word2Vec is an Embedding model used to provide contextual reference for proper embeddings.

2. **LSTM (Long Short-Term Memory)**: LSTMs is an upgraded recurrent neural network (RNN), considering that it is capable of learning long-term dependencies. They can remember information for long periods, which is critical considering the pronouns and nouns in a sentence. This solves the vanishing gradient problem and also helps the model understand the flow of the sentence.

3. **Dense Layer**: It is a fully connected layer where every neuron of the layer 'i+1' is connected to every neuron from layer 'i'. 

4. **Bidirectional**: A bidirectional LSTM processes the input sequence in both forward and backward directions, thus capturing information from both the previous words as well as the future words contexts.

5. **Dropout**: It involves randomly selecting a few layers and not training on those layers. Thus, this helps the model prevent overfitting. In sentiment analysis models, dropout layers are added after LSTM and dense layers to improve the generalization of the model.