
// API service for earthquake prediction system

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Fetches magnetic field data from the API
 * @returns Promise with magnetic field readings
 */export async function getDashboardSummary() {
  const res = await fetch("http://localhost:5000/api/dashboard-summary");
  if (!res.ok) throw new Error("Failed to fetch dashboard summary");
  return res.json();
}

export async function getMagneticData() {
  try {
    const response = await fetch(`${API_BASE_URL}/magnetic-data`);
    if (!response.ok) {
      throw new Error(`Failed to fetch magnetic data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching magnetic data:", error);
    // Return mock data as fallback
    return generateMockMagneticData();
  }
}

/**
 * Fetches current earthquake predictions
 * @returns Promise with prediction data
 */
export async function getPredictions() {
  try {
    const response = await fetch(`${API_BASE_URL}/predictions`);
    if (!response.ok) {
      throw new Error(`Failed to fetch predictions: ${response.statusText}`);
    }
    const data = await response.json();

    // Filter out predictions with a magnitude below 6.0
    const filteredPredictions = data.predictions.filter((prediction) => prediction.magnitude >= 6.0);

    return { predictions: filteredPredictions };
  } catch (error) {
    console.error("Error fetching predictions:", error);
    // No fallback data, only log the error
    throw error; // Re-throw the error so it can be handled elsewhere
  }
}

/**
 * Fetches model status information
 * @returns Promise with model status data
 */
export async function getModelStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/model-status`);
    if (!response.ok) {
      throw new Error(`Failed to fetch model status: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching model status:", error);
    // Return mock data as fallback
    return generateMockModelStatus();
  }
}

/**
 * Fetches risk assessment data
 * @returns Promise with risk assessment information
 */
export async function getRiskAssessment() {
  try {
    const response = await fetch(`${API_BASE_URL}/risk-assessment`);
    if (!response.ok) {
      throw new Error(`Failed to fetch risk assessment: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching risk assessment:", error);
    // Return mock data as fallback
    return generateMockRiskAssessment();
  }
}

// Mock data generators for fallback when API is unavailable
// These use the same logic as the original components to ensure backward compatibility

function generateMockMagneticData() {
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

function generateMockPredictions() {
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

function generateMockModelStatus() {
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

function generateMockRiskAssessment() {
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
