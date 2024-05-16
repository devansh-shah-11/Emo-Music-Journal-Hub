# Facial Emotion Recognition Module

Basically, there are 2 ways to approach any Machine Learning problems.
1. To train the model from scratch
2. Use a pretrained model and finetune it

Given my dataset distribution,
- Training Dataset - 768 Images
- Testing Dataset - 218 Images

And this dataset too divided among 7 classes, there was a clear lack of adequate data for training from scratch. Thus, the best approach to choose was finetuning a pretrained model on the available dataset.

Now, the 2nd question that arised was which model because there are several models performing well in the domain of image recognition and classification. After evaluating several key parameters, I chose Resnet50 architecture.

## Resnet50

ResNet which stands for Residual Networks, is a revolutionary deep learning architecture that is well-known for its capacity to efficiently train very deep neural networks. The main new idea introduced by this paper was the skip connections or residual connections. Because of this, the information flow was more effective across several layers. This solved a major problem of Vanishing Gradient issue.

## Model Architecture

The model architecture is based on the Convolutional Neural Network (CNN) model architecture. The main components of the architecture include:

1. Conv2D: Convolutional layers that extract features from the input images. This was a revolutionary technique introduced by the AlexNet Paper which reduced the dimensionality of the Neural Networks and also made the size dynamic which previously had to be specifically defined.
2. MaxPooling2D: Pooling layers are of 2 types - Averaging and Max. Max pooling involves identifying and storing only the max value from a particular filter-range defined. This helps the model in reducing the dimensionality because we are reducing the size of the filters!
3. BatchNormalization: At each batch, the activations of the previous layer are normalized to ensure the standard deviation remains 0.
4. Dropout: It involves randomly selecting a few layers and not training on those layers. Thus, this helps the model prevent overfitting. It is extremely useful for me considering my dataset size.
5. Flatten: A layer that flattens the previous layer to be given as input to the dense layer. Does not affect the batch size.
6. Dense: It is a fully connected layer. Dense layers are connected with each other. Thus, the neural network is then used as an input with the ”Softmax” layer (which contains n neurons, where n is the number of classes) - Accordingly, the classification is done and predictions take place.

I have used the Adam Optimizer and Categorical CrossEntropy loss function which is generally used for multi-class classification tasks. In my finetuned model, the Resnet50 architecture is used as base model and then, the following layers are added as shown in 4.2