
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

// Global training and practice state
let lastTrainingDate = null;
let isCurrentlyTraining = false;
let isPracticing = false;
let trainingProgress = 0;
let practiceProgress = 0;
let trainingLog = [];
let practiceLog = [];
let lastPracticeDate = null;
let practiceCount = 0;

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
    modelStatus: isCurrentlyTraining ? "training" : isPracticing ? "practicing" : ["analyzing", "predicting", "idle"][Math.floor(Math.random() * 3)],
    modelVersion: "LEPAM v1.0.4",
    accuracy: 76,
    precision: 71,
    recall: 68,
    lastTrainingDate: lastTrainingDate ? lastTrainingDate.toISOString() : null,
    lastPracticeDate: lastPracticeDate ? lastPracticeDate.toISOString() : null,
    practiceCount: practiceCount,
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
  
  // Add practice info if currently practicing
  if (isPracticing) {
    return {
      ...baseStatus,
      cpuUsage: Math.floor(Math.random() * 15) + 60, // Moderate CPU during practice
      memoryUsage: Math.floor(Math.random() * 10) + 65, // Moderate memory during practice
      practiceProgress
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

// Check if practice should happen (multiple times per day)
function shouldPractice() {
  if (!lastPracticeDate) return true;
  
  const now = new Date();
  const hoursSinceLastPractice = (now - lastPracticeDate) / (1000 * 60 * 60);
  return hoursSinceLastPractice >= 3; // Practice every 3 hours
}

// Run weekly training simulation
function simulateTraining() {
  if (isCurrentlyTraining || isPracticing) return;
  
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

// Run practice prediction simulation
function simulatePractice() {
  if (isCurrentlyTraining || isPracticing) return;
  
  console.log("Starting prediction practice simulation...");
  isPracticing = true;
  practiceProgress = 0;
  
  // Add initial log entry
  practiceLog.push({
    timestamp: new Date().toISOString(),
    message: "Practice session started - Generating synthetic magnetic data"
  });
  
  // Simulate practice progress over ~15 seconds
  const practiceInterval = setInterval(() => {
    practiceProgress += 10;
    
    // Add log entries at specific points
    if (practiceProgress === 20) {
      practiceLog.push({
        timestamp: new Date().toISOString(),
        message: "Magnetic anomaly patterns identified"
      });
    } else if (practiceProgress === 50) {
      practiceLog.push({
        timestamp: new Date().toISOString(),
        message: "Processing region-specific correlation factors"
      });
    } else if (practiceProgress === 80) {
      practiceLog.push({
        timestamp: new Date().toISOString(),
        message: "Calculating probabilistic predictions and thresholds"
      });
    }
    
    if (practiceProgress >= 100) {
      clearInterval(practiceInterval);
      practiceProgress = 100;
      isPracticing = false;
      lastPracticeDate = new Date();
      practiceCount++;
      
      // Determine if prediction accuracy improved
      const improvement = (Math.random() < 0.7); // 70% chance of improvement
      const improvementAmount = (Math.random() * 0.2 + 0.1).toFixed(2); // 0.1% to 0.3%
      
      practiceLog.push({
        timestamp: lastPracticeDate.toISOString(),
        message: improvement 
          ? `Practice complete - Prediction accuracy improved by ${improvementAmount}%` 
          : "Practice complete - Model validated with existing parameters"
      });
      
      console.log(`Practice session #${practiceCount} completed`);
    }
  }, 300); // Updates every 300ms for a total of ~3 seconds
}

// Check for weekly training schedule
function checkTrainingSchedule() {
  if (shouldTrainThisWeek() && !isCurrentlyTraining && !isPracticing) {
    console.log("Weekly training check - training needed");
    simulateTraining();
  }
}

// Check for regular practice schedule
function checkPracticeSchedule() {
  if (shouldPractice() && !isCurrentlyTraining && !isPracticing) {
    console.log("Regular practice check - practice needed");
    simulatePractice();
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
  if (isCurrentlyTraining || isPracticing) {
    return res.json({
      success: false,
      message: isCurrentlyTraining ? "Training already in progress" : "Practice session in progress",
      progress: isCurrentlyTraining ? trainingProgress : practiceProgress
    });
  }
  
  simulateTraining();
  res.json({
    success: true,
    message: "Training started successfully"
  });
});

// New endpoint to manually trigger practice
app.post('/api/trigger-practice', (req, res) => {
  if (isCurrentlyTraining || isPracticing) {
    return res.json({
      success: false,
      message: isCurrentlyTraining ? "Training in progress" : "Practice already in progress",
      progress: isCurrentlyTraining ? trainingProgress : practiceProgress
    });
  }
  
  simulatePractice();
  res.json({
    success: true,
    message: "Practice session started successfully"
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

// New endpoint to get practice logs
app.get('/api/practice-logs', (req, res) => {
  res.json({
    logs: practiceLog,
    isPracticing: isPracticing,
    progress: practiceProgress,
    lastPracticeDate: lastPracticeDate ? lastPracticeDate.toISOString() : null,
    practiceCount: practiceCount
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Earthquake prediction simulator running at http://localhost:${port}`);
  
  // Run initial training check
  checkTrainingSchedule();
  
  // Set up recurring checks for training (every hour)
  setInterval(checkTrainingSchedule, 60 * 60 * 1000);
  
  // Set up recurring checks for practice (every 30 minutes)
  setInterval(checkPracticeSchedule, 30 * 60 * 1000);
});

// Instructions for connecting your model
console.log('\nTo connect your actual Random Forest model:');
console.log('1. Create a Python Flask/FastAPI server that loads your model');
console.log('2. Use the model to process EMAG2 data');
console.log('3. Set up routes that match these API endpoints');
console.log('4. Replace this simulator with your Python backend');
console.log('\nAutomated weekly model training is enabled');
console.log('Automated practice sessions run every 3 hours');

