# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)  # allows your React dev server to call this API

# Load artifacts
MODEL_PATH = "diabetes_model.pkl"
SCALER_PATH = "diabetes_scaler.pkl"
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

FIELDS = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
]

@app.route("/health", methods=["GET"])
def health():
    return {"status": "ok", "model": MODEL_PATH}, 200

@app.route("/predict/diabetes", methods=["POST"])
def predict_diabetes():
    try:
        data = request.get_json(force=True)
        values = [float(data.get(f, 0)) for f in FIELDS]
        X = scaler.transform([values])
        pred = int(model.predict(X)[0])
        proba = float(model.predict_proba(X)[0, 1])
        return jsonify({"prediction": pred, "probability": proba, "fields": FIELDS})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
