
# Earthquake Prediction Backend

This is a Flask-based backend service that connects to the Random Forest earthquake prediction model.

## Setup Instructions

1. Install the required Python packages:

```bash
pip install -r requirements.txt
```

2. Place your trained Random Forest model (`earthquake_prediction_model.pkl`) in this directory or update the `MODEL_PATH` environment variable to point to its location.

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
- `/api/health` - Health check endpoint

## Integration with the Frontend

The frontend React application is configured to connect to this backend service. Make sure the environment variable `VITE_API_BASE_URL` in the frontend project is set to `http://localhost:5000/api` (or the appropriate URL if deployed elsewhere).

## Local Model Setup

When using a locally stored model:

1. Place the `earthquake_prediction_model.pkl` file directly in the `src/backend/` directory
2. The application will automatically use the local model file
3. No need to download it from external repositories

## Using the Actual Model

The current implementation includes placeholder code for generating synthetic data. To use your actual earthquake prediction model:

1. Update the `fetch_emag_data()` function to connect to your actual EMAG2 data source.
2. Make sure the data is properly formatted with all required features:
   - `decg`: Declination in degrees
   - `dbhg`: Horizontal field component
   - `decr`: Declination in radians
   - `dbhr`: Horizontal field component in radians
   - `mfig`: Magnetic field intensity
   - `mfir`: Magnetic field intensity in radians
   - `mdig`: Magnetic declination inclination in degrees
   - `mdir`: Magnetic declination inclination in radians
3. Ensure the model is loaded correctly from the `.pkl` file.

## Deployment

For production deployment, consider using a WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

You may also want to set up a reverse proxy (like Nginx) and configure appropriate security measures for a production environment.
