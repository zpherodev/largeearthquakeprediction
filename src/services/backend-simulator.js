/**
 * This file provides a mock backend server for local development
 * To use it, you need to install Express:
 * npm install express cors
 * 
 * Then run this file with Node:
 * node src/services/backend-simulator.js
 */

const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Global training state
let lastTrainingDate = null;
let isCurrentlyTraining = false;
let trainingProgress = 0;
let trainingLog = [];

// Generate simulated magnetic data
function generateMagneticData() {
  const now = new Date();
  const data = [];
  let value = 100;
  
  for (let i = 29; i >= 0; i--) {
    const randomChange = (Math.random() - 0.5) * 10;
    const isSpike = Math.random() < 0.05;
    const spikeAmount = isSpike ? (Math.random() * 50 - 25) : 0;
    
    value = value + randomChange + spikeAmount;
    value = Math.max(50, Math.min(150, value));
    
    const date = new Date(now);
    date.setMinutes(now.getMinutes() - i * 5);
    
    data.push({
      timestamp: date.toISOString(),
      label: `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`,
      value: value.toFixed(2),
      decg: Math.random() * 360, // Declination in degrees
      dbhg: Math.random() * 100, // Horizontal field component
      mfig: value, // Magnetic field intensity
      mdig: Math.random() * 90, // Magnetic declination inclination in degrees
    });
  }
  
  return { data };
}

// Generate simulated prediction data
function generatePredictions() {
  const locations = [
    "San Andreas Fault, CA",
    "Pacific Ring of Fire",
    "Aleutian Islands, AK",
    "New Madrid Fault Zone",
    "Cascadia Subduction Zone",
    "Himalayan Fault System",
    "Japan Trench"
  ];
  
  const timeframes = ["24 hours", "3-7 days", "1-2 weeks", "2-4 weeks"];
  const now = new Date();
  
  const predictions = Array(5).fill(null).map(() => {
    const probability = Math.random();
    let magnitude = 3 + (probability * 5);
    magnitude = Math.round(magnitude * 10) / 10;
    
    return {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: now.toISOString(),
      location: locations[Math.floor(Math.random() * locations.length)],
      magnitude: magnitude,
      probability: Math.round(probability * 100),
      timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
      confidence: Math.round(Math.random() * 100)
    };
  });
  
  return { predictions };
}

// Generate simulated model status
function generateModelStatus() {
  const baseStatus = {
    cpuUsage: Math.floor(Math.random() * 30) + 50,
    memoryUsage: Math.floor(Math.random() * 20) + 60,
    lastUpdate: new Date().toISOString(),
    modelStatus: isCurrentlyTraining ? "training" : ["analyzing", "predicting", "idle"][Math.floor(Math.random() * 3)],
    modelVersion: "LEPAM v1.0.4",
    accuracy: 76,
    precision: 71,
    recall: 68,
    lastTrainingDate: lastTrainingDate ? lastTrainingDate.toISOString() : null,
    trainingScheduled: shouldTrainThisWeek()
  };
  
  // Add training info if currently training
  if (isCurrentlyTraining) {
    return {
      ...baseStatus,
      cpuUsage: Math.floor(Math.random() * 20) + 75, // Higher CPU during training
      memoryUsage: Math.floor(Math.random() * 15) + 80, // Higher memory during training
      trainingProgress
    };
  }
  
  return baseStatus;
}

// Generate simulated risk assessment
function generateRiskAssessment() {
  const riskLevel = Math.floor(Math.random() * 70) + 15;
  let trend;
  
  if (riskLevel > 60) trend = "increasing";
  else if (riskLevel < 30) trend = "decreasing";
  else trend = "stable";
  
  return {
    riskLevel,
    trend,
    factors: {
      magneticAnomalies: "Moderate",
      historicalPatterns: "Low Correlation",
      signalIntensity: "Stable"
    }
  };
}

// Check if training should happen this week (once every 7 days)
function shouldTrainThisWeek() {
  if (!lastTrainingDate) return true;
  
  const now = new Date();
  const daysSinceLastTraining = (now - lastTrainingDate) / (1000 * 60 * 60 * 24);
  return daysSinceLastTraining >= 7;
}

// Run weekly training simulation
function simulateTraining() {
  if (isCurrentlyTraining) return;
  
  console.log("Starting weekly model training simulation...");
  isCurrentlyTraining = true;
  trainingProgress = 0;
  
  // Add initial log entry
  trainingLog.push({
    timestamp: new Date().toISOString(),
    message: "Training started - Loading historical M6.0+ event data"
  });
  
  // Simulate training progress over 2 minutes
  const trainingInterval = setInterval(() => {
    trainingProgress += 5;
    
    // Add log entries at specific points
    if (trainingProgress === 20) {
      trainingLog.push({
        timestamp: new Date().toISOString(),
        message: "Feature extraction from magnetic field data complete"
      });
    } else if (trainingProgress === 50) {
      trainingLog.push({
        timestamp: new Date().toISOString(),
        message: "Random Forest model building in progress - optimizing hyperparameters"
      });
    } else if (trainingProgress === 80) {
      trainingLog.push({
        timestamp: new Date().toISOString(),
        message: "Cross-validation complete - Accuracy improved by 1.2%"
      });
    }
    
    if (trainingProgress >= 100) {
      clearInterval(trainingInterval);
      trainingProgress = 100;
      isCurrentlyTraining = false;
      lastTrainingDate = new Date();
      
      trainingLog.push({
        timestamp: lastTrainingDate.toISOString(),
        message: "Training complete - Model updated successfully"
      });
      
      console.log("Training simulation completed");
    }
  }, 1200); // Updates every 1.2 seconds for a total of ~24 seconds
}

// Check for weekly training schedule
function checkTrainingSchedule() {
  if (shouldTrainThisWeek() && !isCurrentlyTraining) {
    console.log("Weekly training check - training needed");
    simulateTraining();
  }
}

// API Routes
app.get('/api/magnetic-data', (req, res) => {
  res.json(generateMagneticData());
});

app.get('/api/predictions', (req, res) => {
  res.json(generatePredictions());
});

app.get('/api/model-status', (req, res) => {
  res.json(generateModelStatus());
});

app.get('/api/risk-assessment', (req, res) => {
  res.json(generateRiskAssessment());
});

app.get('/api/dashboard-summary', (req, res) => {
  const magnetic = generateMagneticData();
  const modelStatus = generateModelStatus();
  const risk = generateRiskAssessment();
  const predictions = generatePredictions();

  const latestMag = magnetic.data[magnetic.data.length - 1];

  res.json({
    currentReading: latestMag,
    modelStatus,
    riskAssessment: risk,
    predictions,
  });
});

// New endpoint to manually trigger training
app.post('/api/trigger-training', (req, res) => {
  if (isCurrentlyTraining) {
    return res.json({
      success: false,
      message: "Training already in progress",
      progress: trainingProgress
    });
  }
  
  simulateTraining();
  res.json({
    success: true,
    message: "Training started successfully"
  });
});

// New endpoint to get training logs
app.get('/api/training-logs', (req, res) => {
  res.json({
    logs: trainingLog,
    isTraining: isCurrentlyTraining,
    progress: trainingProgress,
    lastTrainingDate: lastTrainingDate ? lastTrainingDate.toISOString() : null
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Earthquake prediction simulator running at http://localhost:${port}`);
  
  // Run initial training check
  checkTrainingSchedule();
  
  // Set up recurring checks (every hour)
  setInterval(checkTrainingSchedule, 60 * 60 * 1000);
});

// Instructions for connecting your model
console.log('\nTo connect your actual Random Forest model:');
console.log('1. Create a Python Flask/FastAPI server that loads your model');
console.log('2. Use the model to process EMAG2 data');
console.log('3. Set up routes that match these API endpoints');
console.log('4. Replace this simulator with your Python backend');
console.log('\nAutomated weekly model training is now enabled');
