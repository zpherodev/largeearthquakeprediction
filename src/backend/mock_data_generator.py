
"""
Mock data generator for earthquake prediction model
This script creates a sample training dataset and trains a simple Random Forest model
to help with testing the application without actual EMAG2 data
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pickle
import os

def generate_mock_training_data(n_samples=1000):
    """Generate synthetic data for training the earthquake prediction model"""
    # Generate random features
    np.random.seed(42)  # For reproducibility
    
    # Generate features with some patterns that the model can learn
    decg = np.random.uniform(0, 360, n_samples)  # Declination in degrees
    dbhg = np.random.uniform(0, 100, n_samples)  # Horizontal field component
    decr = np.radians(decg)  # Convert to radians
    dbhr = np.radians(dbhg)  # Convert to radians
    mfig = np.random.uniform(50, 150, n_samples)  # Magnetic field intensity
    mfir = np.radians(mfig)  # Convert to radians
    mdig = np.random.uniform(0, 90, n_samples)  # Declination inclination in degrees
    mdir = np.radians(mdig)  # Convert to radians
    
    # Create a DataFrame
    df = pd.DataFrame({
        'decg': decg,
        'dbhg': dbhg,
        'decr': decr,
        'dbhr': dbhr,
        'mfig': mfig,
        'mfir': mfir,
        'mdig': mdig,
        'mdir': mdir
    })
    
    # Generate target variable with some patterns based on the features
    # This will create a relationship between magnetic anomalies and earthquakes
    # In a real scenario, this would come from historical earthquake data
    
    # Higher magnetic intensity and rapidly changing declination might indicate earthquakes
    earthquake_probability = (
        0.2 * np.sin(decr) + 
        0.3 * (mfig / 150) + 
        0.1 * np.random.random(n_samples) +
        0.4 * (np.abs(np.sin(mdir) * np.cos(dbhr)))
    )
    
    # Create binary target (0 = no earthquake, 1 = earthquake)
    earthquake = (earthquake_probability > 0.65).astype(int)
    df['earthquake'] = earthquake
    
    print(f"Generated dataset with {n_samples} samples, {earthquake.sum()} earthquakes ({earthquake.sum()/n_samples*100:.1f}%)")
    return df

def train_mock_model(data):
    """Train a Random Forest model on the mock data"""
    # Split features and target
    X = data.drop('earthquake', axis=1)
    y = data['earthquake']
    
    # Split into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
    
    # Train a Random Forest model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate the model
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    print(f"Model trained successfully:")
    print(f"Training accuracy: {train_score:.3f}")
    print(f"Testing accuracy: {test_score:.3f}")
    
    return model

def save_model(model, filename='earthquake_prediction_model.pkl'):
    """Save the trained model to a file"""
    with open(filename, 'wb') as file:
        pickle.dump(model, file)
    
    print(f"Model saved to {filename}")

if __name__ == "__main__":
    # Generate mock training data
    data = generate_mock_training_data(n_samples=2000)
    
    # Train a model on the mock data
    model = train_mock_model(data)
    
    # Save the model
    save_model(model)
