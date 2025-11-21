# app.py
from flask import Flask, request, jsonify
import joblib
import numpy as np
import cv2
import tensorflow as tf
import urllib.request
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  
artifact = joblib.load('stress_classifier.joblib')
clf = artifact['model']
scaler = artifact['scaler']
le = artifact['label_encoder']

# ------------------------------
# Load Emotion Model (Mini Xception)
# ------------------------------
MODEL_URL = "https://github.com/oarriaga/face_classification/raw/master/trained_models/emotion_models/fer2013_mini_XCEPTION.102-0.66.hdf5"
MODEL_PATH = "emotion_model.h5"

if not os.path.exists(MODEL_PATH):
    print("Downloading emotion model...")
    urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)

model = tf.keras.models.load_model(MODEL_PATH, compile=False)

# ------------------------------
# Load Haarcascade for Face Detection
# ------------------------------
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

emotion_labels = ['Angry','Disgust','Fear','Happy','Sad','Surprise','Neutral']


# map mood names to ints (must match training)
mood_map = {'happy':0,'neutral':1,'sad':2,'angry':3,'surprised':4}


# ------------------------------
# API Endpoint
# ------------------------------
@app.route("/face_predict", methods=["POST"])
def predict_face():
    try:
        # Read uploaded file
        file = request.files["file"]
        img_bytes = np.frombuffer(file.read(), np.uint8)

        # Decode
        img = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Detect faces
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            return jsonify({"error": "No face detected"}), 400

        # Use first detected face
        x, y, w, h = faces[0]
        face = gray[y:y + h, x:x + w]

        # Preprocess for model
        face = cv2.resize(face, (64, 64))
        face = face.astype("float") / 255.0
        face = np.expand_dims(face, axis=0)
        face = np.expand_dims(face, axis=-1)

        prediction = model.predict(face)
        emotion_index = np.argmax(prediction)
        emotion = emotion_labels[emotion_index]
        confidence = float(np.max(prediction))

        return jsonify({
            "emotion": emotion,
            "confidence": confidence
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    """
    Expects JSON:
    {
      "face_mood": "happy",
      "messages_sent": 12,
      "messages_received": 13,
      "calls_incoming": 0,
      "calls_outgoing": 1,
      "sleep_hours": 7.5
    }
    """
    data = request.json
    try:
        fm = data.get('face_mood')
        face_mood_i = mood_map.get(fm, 1)  # default neutral if unknown
        feat = np.array([[face_mood_i,
                          float(data.get('messages_sent',0)),
                          float(data.get('messages_received',0)),
                          float(data.get('calls_incoming',0)),
                          float(data.get('calls_outgoing',0)),
                          float(data.get('sleep_hours',7))]])
        feat_s = scaler.transform(feat)
        pred_idx = clf.predict(feat_s)[0]
        pred_label = le.inverse_transform([pred_idx])[0]
        probs = clf.predict_proba(feat_s).tolist()[0]
        return jsonify({
            'predicted_label': pred_label,
            'probabilities': dict(zip(le.classes_, probs))
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
