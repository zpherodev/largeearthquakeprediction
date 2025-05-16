
# Earthquake Prediction Backend

This is a Flask-based backend service that connects to the Random Forest earthquake prediction model.

## Setup Instructions

1. Install the required Python packages:

```bash
pip install -r requirements.txt
```

2. Ensure the following files are present in the `src/backend/` directory:
   - `random_forest_model_full_updated.pkl` - The trained ML model
   - `scaler_full_updated.pkl` - The data scaler for preprocessing

3. Start the server:

```bash
python app.py
```

The server will run on port 5000 by default and will serve the following API endpoints:

- `/api/magnetic-data` - Get current magnetic field readings
- `/api/predictions` - Get current earthquake predictions
- `/api/model-status` - Check the status of the prediction model
- `/api/risk-assessment` - Get the current risk assessment
- `/api/trigger-prediction` - Manually trigger a new prediction
- `/api/health` - Health check endpoint (now includes model and scaler status)

## Integration with the Frontend

The frontend React application is configured to connect to this backend service. Make sure the environment variable `VITE_API_BASE_URL` in the frontend project is set to `http://localhost:5000/api` (or the appropriate URL if deployed elsewhere).

## Using the Local Model Files

The backend is configured to use the following local files:
1. `random_forest_model_full_updated.pkl` - Trained Random Forest model
2. `scaler_full_updated.pkl` - Data scaler used to normalize input features

The application will automatically look for these files in the current directory (`src/backend/`).

## Using the Actual Model

The current implementation uses real model files but still generates simulated data for various features:

1. To use real data sources, update the `fetch_emag_data()` function to connect to your actual EMAG2 data source.
2. Make sure the data is properly formatted with all required features:
   - `decg`: Declination in degrees
   - `dbhg`: Horizontal field component
   - `decr`: Declination in radians
   - `dbhr`: Horizontal field component in radians
   - `mfig`: Magnetic field intensity
   - `mfir`: Magnetic field intensity in radians
   - `mdig`: Magnetic declination inclination in degrees
   - `mdir`: Magnetic declination inclination in radians

## Deployment

For production deployment, consider using a WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

You may also want to set up a reverse proxy (like Nginx) and configure appropriate security measures for a production environment.
