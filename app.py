from flask import Flask, render_template, request, jsonify
import base64
import tensorflow as tf
import cv2
import numpy as np

app = Flask(__name__)

# Load trained model and class labels
model = tf.keras.models.load_model('cnn.h5')
model.make_predict_function()
# with open('model/class_names.txt', 'r') as file:
#     class_labels = file.read().splitlines()
with open('./model/class_names.txt', 'r') as file:
    class_labels = file.read().splitlines()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/recognize', methods=['POST'])
def recognize():
    if request.method == 'POST':
            data = request.get_json()
            imageBase64 = data['image']
            imgBytes = base64.b64decode(imageBase64)

            with open("temp.jpg", "wb") as temp:
                temp.write(imgBytes)

            image = cv2.imread('temp.jpg')

            image = cv2.resize(image, (28, 28), interpolation=cv2.INTER_AREA)
            image_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            image_prediction = np.reshape(image_gray, (28, 28, 1))

            image_prediction = (255 - image_prediction.astype('float')) / 255

            # Make predictions using the model
            predictions = model.predict(np.array([image_prediction]))
            predicted_class_index = np.argmax(predictions, axis=-1)
            predicted_class = class_labels[predicted_class_index[0]]

            # Return the predicted class and its confidence
            return jsonify({
                'prediction': predicted_class,
                'status': True
            })

if __name__ == '__main__':
	# app.run(host='0.0.0.0')
    app.run(debug = True)