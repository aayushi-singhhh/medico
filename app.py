# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)  # allows your React dev server to call this API

# Load diabetes artifacts
DIABETES_MODEL_PATH = "diabetes_model.pkl"
DIABETES_SCALER_PATH = "diabetes_scaler.pkl"
diabetes_model = joblib.load(DIABETES_MODEL_PATH)
diabetes_scaler = joblib.load(DIABETES_SCALER_PATH)

# Load heart disease artifacts
HEART_MODEL_PATH = "heart_model.pkl"
heart_model = joblib.load(HEART_MODEL_PATH)

# Load pcos artifacts
PCOS_MODEL_PATH = "pcos_model.pkl"
PCOS_SCALER_PATH = "pcos_scaler.pkl"
pcos_model = joblib.load(PCOS_MODEL_PATH)
pcos_scaler = joblib.load(PCOS_SCALER_PATH)

# Diabetes fields based on common diabetes datasets
DIABETES_FIELDS = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
]

# Heart disease fields based on common heart disease datasets
HEART_FIELDS = [
    "Age", "Sex", "ChestPainType", "RestingBP", "Cholesterol", 
    "FastingBS", "RestingECG", "MaxHR", "ExerciseAngina", "Oldpeak",
    "ST_Slope", "Ca", "Thal"
]

# PCOS fields based on common PCOS datasets
PCOS_FIELDS = [
    "Age", "BMI", "Menstrual_Irregularity", "Testosterone_Level_ng_dL", "Antral_Follicle_Count"
]

@app.route("/health", methods=["GET"])
def health():
    return {"status": "ok", "diabetes_model": DIABETES_MODEL_PATH, "heart_model": HEART_MODEL_PATH, "pcos_model": PCOS_MODEL_PATH}, 200

@app.route("/predict/diabetes", methods=["POST"])
def predict_diabetes():
    try:
        data = request.get_json(force=True)
        values = [float(data.get(f, 0)) for f in DIABETES_FIELDS]
        X = diabetes_scaler.transform([values])
        pred = int(diabetes_model.predict(X)[0])
        proba = float(diabetes_model.predict_proba(X)[0, 1])
        return jsonify({"prediction": pred, "probability": proba, "fields": DIABETES_FIELDS})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/predict/heart", methods=["POST"])
def predict_heart():
    try:
        data = request.get_json(force=True)
        values = [float(data.get(f, 0)) for f in HEART_FIELDS]
        
        # Ensure we have exactly 13 features
        if len(values) != 13:
            return jsonify({"error": f"Expected 13 features, got {len(values)}"}), 400
        
        X = np.array([values])
        pred = int(heart_model.predict(X)[0])
        proba = float(heart_model.predict_proba(X)[0, 1])
        return jsonify({"prediction": pred, "probability": proba, "fields": HEART_FIELDS})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route("/predict/pcos", methods=["POST"])
def predict_pcos():
    try:
        data = request.get_json(force=True)
        values = [float(data.get(f, 0)) for f in PCOS_FIELDS]
        
        # Ensure we have exactly 5 features
        if len(values) != 5:
            return jsonify({"error": f"Expected 5 features, got {len(values)}"}), 400
        
        X = pcos_scaler.transform([values])
        pred = int(pcos_model.predict(X)[0])
        proba = float(pcos_model.predict_proba(X)[0, 1])
        return jsonify({"prediction": pred, "probability": proba, "fields": PCOS_FIELDS})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
