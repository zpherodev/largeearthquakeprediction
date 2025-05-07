
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
  return {
    cpuUsage: Math.floor(Math.random() * 30) + 50,
    memoryUsage: Math.floor(Math.random() * 20) + 60,
    lastUpdate: new Date().toISOString(),
    modelStatus: ["training", "analyzing", "predicting", "idle"][Math.floor(Math.random() * 4)],
    modelVersion: "LEPAM v1.0.4",
    accuracy: 76,
    precision: 71,
    recall: 68
  };
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

// Start the server
app.listen(port, () => {
  console.log(`Earthquake prediction simulator running at http://localhost:${port}`);
});

// Instructions for connecting your model
console.log('\nTo connect your actual Random Forest model:');
console.log('1. Create a Python Flask/FastAPI server that loads your model');
console.log('2. Use the model to process EMAG2 data');
console.log('3. Set up routes that match these API endpoints');
console.log('4. Replace this simulator with your Python backend');
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

