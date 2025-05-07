
# Python backend for Earthquake Prediction Model
# To run this server:
# 1. Install requirements: pip install flask flask-cors pandas scikit-learn
# 2. Run: python app.py

from flask import Flask, jsonify, request
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
import os
import logging
import time

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Path to the saved model
MODEL_PATH = os.environ.get('MODEL_PATH', 'earthquake_prediction_model.pkl')

# Model and data globals
model = None
last_data_fetch = None
magnetic_data = []
current_predictions = []
model_status = {
    "cpuUsage": 60,
    "memoryUsage": 70,
    "lastUpdate": datetime.now().isoformat(),
    "modelStatus": "idle",
    "modelVersion": "LEPAM v1.0.4",
    "accuracy": 76,
    "precision": 71,
    "recall": 68
}
risk_assessment = {
    "riskLevel": 25,
    "trend": "stable",
    "factors": {
        "magneticAnomalies": "Low",
        "historicalPatterns": "Low Correlation",
        "signalIntensity": "Stable"
    }
}

import requests

def load_model():
    """Load the trained Random Forest model from local file or GitHub"""
    global model
    try:
        if not os.path.exists(MODEL_PATH):
            logger.info("Model not found locally. Downloading from GitHub...")
            url = "https://github.com/crknftart/Large-Earthquake-Prediction-Model/raw/main/earthquake_prediction_model.pkl"
            response = requests.get(url)
            with open(MODEL_PATH, 'wb') as f:
                f.write(response.content)
            logger.info("Model downloaded and saved.")

        with open(MODEL_PATH, 'rb') as file:
            model = pickle.load(file)
        logger.info(f"Model loaded successfully from {MODEL_PATH}")
        return True
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        return False


def fetch_emag_data():
    """Fetch magnetic field data from EMAG2 dataset or similar source"""
    global last_data_fetch, magnetic_data, model_status
    
    try:
        # Set model status to analyzing during data fetch
        model_status["modelStatus"] = "analyzing"
        model_status["lastUpdate"] = datetime.now().isoformat()
        
        # TODO: Replace with actual EMAG2 data fetch
        # This is a placeholder that generates synthetic data
        # In a real implementation, you would:
        # 1. Connect to EMAG2 API or download dataset
        # 2. Process the raw data to get required features
        # 3. Return formatted data
        
        now = datetime.now()
        data = []
        value = 100
        
        for i in range(29, -1, -1):
            random_change = (np.random.random() - 0.5) * 10
            is_spike = np.random.random() < 0.05
            spike_amount = (np.random.random() * 50 - 25) if is_spike else 0
            
            value = value + random_change + spike_amount
            value = max(50, min(150, value))
            
            date = now - timedelta(minutes=i*5)
            hour = date.hour
            minute = date.minute
            
            # Create features required by the model
            decg = np.random.random() * 360  # Declination in degrees
            dbhg = np.random.random() * 100  # Horizontal field component
            decr = np.radians(decg)  # Convert to radians
            dbhr = np.radians(dbhg)  # Convert to radians
            mfig = value  # Magnetic field intensity
            mfir = np.radians(mfig)  # Convert to radians
            mdig = np.random.random() * 90  # Magnetic declination inclination
            mdir = np.radians(mdig)  # Convert to radians
            
            data.append({
                "timestamp": date.isoformat(),
                "label": f"{hour}:{minute:02d}",
                "value": f"{value:.2f}",
                "decg": decg,
                "dbhg": dbhg,
                "decr": decr,
                "dbhr": dbhr,
                "mfig": mfig,
                "mfir": mfir,
                "mdig": mdig,
                "mdir": mdir
            })
        
        magnetic_data = data
        last_data_fetch = now
        logger.info("Magnetic data fetched successfully")
        
        # Update model status to idle after data fetch
        model_status["modelStatus"] = "idle"
        model_status["lastUpdate"] = datetime.now().isoformat()
        
        return data
    except Exception as e:
        logger.error(f"Error fetching EMAG data: {e}")
        model_status["modelStatus"] = "idle"
        return []

def run_prediction():
    """Run the earthquake prediction model on the latest magnetic data"""
    global model, magnetic_data, current_predictions, model_status, risk_assessment
    
    if not model:
        logger.error("Model not loaded. Cannot run predictions.")
        return
    
    try:
        # Set model status to predicting during prediction
        model_status["modelStatus"] = "predicting"
        model_status["lastUpdate"] = datetime.now().isoformat()
        
        # Extract features needed for the model
        features = ['decg', 'dbhg', 'decr', 'dbhr', 'mfig', 'mfir', 'mdig', 'mdir']
        df = pd.DataFrame([{k: float(d[k]) for k in features} for d in magnetic_data if all(k in d for k in features)])
        
        if df.empty:
            logger.error("No valid data for prediction")
            return
        
        # Make predictions
        pred_probabilities = model.predict_proba(df)[:, 1]  # Assuming binary classification
        
        # Generate predictions based on highest probabilities
        locations = [
            "San Andreas Fault, CA",
            "Pacific Ring of Fire",
            "Aleutian Islands, AK",
            "New Madrid Fault Zone",
            "Cascadia Subduction Zone",
            "Himalayan Fault System",
            "Japan Trench"
        ]
        timeframes = ["24 hours", "3-7 days", "1-2 weeks", "2-4 weeks"]
        now = datetime.now()
        
        predictions = []
        # Take top 5 probability points 
        for i in range(min(5, len(pred_probabilities))):
            probability = float(pred_probabilities[i] * 100)  # Convert to percentage
            # Magnitude correlated with probability
            magnitude = 3 + (probability / 100 * 5)
            magnitude = round(magnitude * 10) / 10
            
            predictions.append({
                "id": f"pred-{int(time.time())}-{i}",
                "timestamp": now.isoformat(),
                "location": np.random.choice(locations),  # In real model, this would be determined by data
                "magnitude": magnitude,
                "probability": int(probability),
                "timeframe": np.random.choice(timeframes),  # In real model, this would be determined by data
                "confidence": int(np.random.random() * 20 + probability - 10)  # Related to but not same as probability
            })
        
        current_predictions = predictions
        
        # Update risk assessment based on predictions
        max_prob = max([p["probability"] for p in predictions]) if predictions else 0
        risk_assessment["riskLevel"] = int(max_prob)
        if max_prob > 60:
            risk_assessment["trend"] = "increasing"
            risk_assessment["factors"]["magneticAnomalies"] = "High"
        elif max_prob < 30:
            risk_assessment["trend"] = "decreasing"
            risk_assessment["factors"]["magneticAnomalies"] = "Low"
        else:
            risk_assessment["trend"] = "stable"
            risk_assessment["factors"]["magneticAnomalies"] = "Moderate"
        
        logger.info(f"Generated {len(predictions)} predictions")
        
        # Update model status
        model_status["modelStatus"] = "idle"
        model_status["lastUpdate"] = datetime.now().isoformat()
        
        return predictions
    except Exception as e:
        logger.error(f"Error running prediction: {e}")
        model_status["modelStatus"] = "idle"
        return []

# API Routes
@app.route('/api/magnetic-data', methods=['GET'])
def get_magnetic_data():
    """API endpoint to get magnetic field data"""
    global magnetic_data, last_data_fetch
    
    # Fetch new data if it's the first request or data is too old (> 5 minutes)
    if not last_data_fetch or (datetime.now() - last_data_fetch).total_seconds() > 300:
        fetch_emag_data()
    
    return jsonify({"data": magnetic_data})

@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    """API endpoint to get earthquake predictions"""
    global current_predictions
    
    # Generate new predictions if none exist
    if not current_predictions:
        run_prediction()
    
    return jsonify({"predictions": current_predictions})

@app.route('/api/model-status', methods=['GET'])
def get_model_status():
    """API endpoint to get model status"""
    global model_status
    return jsonify(model_status)

@app.route('/api/risk-assessment', methods=['GET'])
def get_risk_assessment():
    """API endpoint to get risk assessment"""
    global risk_assessment
    return jsonify(risk_assessment)

@app.route('/api/trigger-prediction', methods=['POST'])
def trigger_prediction():
    """API endpoint to manually trigger a new prediction"""
    fetch_emag_data()  # Get fresh data
    predictions = run_prediction()  # Run prediction on new data
    return jsonify({"success": True, "predictionCount": len(predictions) if predictions else 0})

@app.route('/api/health', methods=['GET'])
def health_check():
    """API endpoint to check if the service is running"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

if __name__ == "__main__":
    # Try to load model at startup
    load_model()
    
    # Initial data fetch
    fetch_emag_data()
    
    # Initial prediction
    run_prediction()
    
    # Start background thread for periodic updates
    app.run(host='0.0.0.0', port=5000, debug=True)
