import { toast } from "sonner";

// Update to point to the actual backend server
// We'll use a conditional to support both development and production environments
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function for API requests with proper error handling
async function fetchWithErrorHandling(endpoint: string, options = {}) {
  try {
    console.log(`Fetching from: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options as any).headers
      }
    });
    
    if (!response.ok) {
      const errorMsg = `API Error (${response.status}): ${response.statusText}`;
      console.error(errorMsg);
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    // Check if response is empty
    const text = await response.text();
    if (!text.trim()) {
      console.warn("Empty response received from API");
      return {};
    }
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw response:", text);
      toast.error("Error parsing API response");
      throw new Error("Invalid JSON response");
    }
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    toast.error(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

// Fallback function to directly fetch from NOAA when the backend fails
export async function fetchNOAAMagneticData() {
  try {
    console.log("Attempting direct fetch from NOAA API");
    const response = await fetch("https://services.swpc.noaa.gov/products/goes/primary/magnetometer-1-minute.json");
    
    if (!response.ok) {
      throw new Error(`NOAA API Error: ${response.status}`);
    }
    
    const rawData = await response.json();
    if (!Array.isArray(rawData)) {
      throw new Error("Unexpected data format from NOAA");
    }
    
    // Transform the data into the format our app expects
    const formattedData = rawData.slice(-30).map(entry => {
      const timestamp = entry.time_tag;
      const value = parseFloat(entry.hp || 0).toFixed(2);
      
      return {
        timestamp,
        label: timestamp ? timestamp.substring(11, 16) : "",
        value,
        decg: 0, dbhg: 0, decr: 0, dbhr: 0,
        mfig: parseFloat(value), mfir: 0, mdig: 0, mdir: 0
      };
    });
    
    return { data: formattedData };
  } catch (error) {
    console.error("Direct NOAA fetch error:", error);
    toast.error(`Failed to fetch magnetic data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { data: [] };
  }
}

export async function getDashboardSummary() {
  return fetchWithErrorHandling('/dashboard-summary');
}

export async function getMagneticData() {
  try {
    const data = await fetchWithErrorHandling('/magnetic-data');
    // Ensure we have the right structure even if the API response format changes
    if (!data.data || data.data.length === 0) {
      console.log("No data from backend API, attempting direct NOAA fetch");
      return fetchNOAAMagneticData();
    }
    return data.data ? { data: data.data } : { data: [] };
  } catch (error) {
    console.error("Error in getMagneticData:", error);
    console.log("Backend API error, attempting direct NOAA fetch");
    // Fallback to direct NOAA API
    return fetchNOAAMagneticData();
  }
}

export async function getPredictions() {
  try {
    const data = await fetchWithErrorHandling('/predictions');
    return { predictions: data.predictions || [] };
  } catch (error) {
    console.error("Error in getPredictions:", error);
    return { predictions: [] };
  }
}

export async function getModelStatus() {
  try {
    return await fetchWithErrorHandling('/model-status');
  } catch (error) {
    console.error("Error in getModelStatus:", error);
    // Return default data to prevent UI errors
    return {
      cpuUsage: 0,
      memoryUsage: 0,
      lastUpdate: new Date().toISOString(),
      modelStatus: "error",
      modelVersion: "Unknown",
      accuracy: 0,
      precision: 0,
      recall: 0
    };
  }
}

export async function getRiskAssessment() {
  try {
    return await fetchWithErrorHandling('/risk-assessment');
  } catch (error) {
    console.error("Error in getRiskAssessment:", error);
    // Return default data to prevent UI errors
    return {
      riskLevel: 0,
      trend: "unknown",
      factors: {
        magneticAnomalies: "Unknown",
        historicalPatterns: "Unknown",
        signalIntensity: "Unknown"
      }
    };
  }
}

export async function triggerPrediction() {
  try {
    return await fetchWithErrorHandling('/trigger-prediction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error("Error triggering prediction:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
