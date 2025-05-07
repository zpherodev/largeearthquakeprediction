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

// Function to directly fetch from NOAA API - Updated with correct URL
export async function fetchNOAAMagneticData() {
  try {
    console.log("Directly fetching from NOAA API");
    // Using the correct NOAA API endpoint
    const response = await fetch("https://services.swpc.noaa.gov/json/goes/primary/magnetometers-1-day.json", {
      method: "GET"
    });
    
    if (!response.ok) {
      throw new Error(`NOAA API Error: ${response.status}`);
    }
    
    // Parse the JSON data
    const rawData = await response.json();
    console.log("NOAA Raw Data:", rawData);
    
    if (!Array.isArray(rawData)) {
      console.error("Unexpected data format from NOAA:", rawData);
      throw new Error("Unexpected data format from NOAA");
    }
    
    // Transform the data into the format our app expects
    // Take last 30 data points (or fewer if less available)
    const startIndex = Math.max(0, rawData.length - 30);
    const formattedData = rawData.slice(startIndex).map((entry: any) => {
      const timestamp = entry.time_tag || "";
      // The structure of this data may be different from the previous endpoint
      // Using the 'hp' field or equivalent field based on actual data structure
      const hpValue = entry.hp || entry.bt || entry.total || 0;
      
      return {
        timestamp,
        label: timestamp ? timestamp.substring(11, 16) : "",
        value: typeof hpValue === 'number' ? hpValue.toFixed(2) : "0.00",
        decg: 0, dbhg: 0, decr: 0, dbhr: 0,
        mfig: parseFloat(hpValue) || 0, mfir: 0, mdig: 0, mdir: 0
      };
    });
    
    console.log("Formatted NOAA Data:", formattedData);
    return { data: formattedData };
  } catch (error) {
    console.error("Direct NOAA fetch error:", error);
    toast.error(`Failed to fetch magnetic data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    // Return empty data array to prevent UI errors
    return { data: [] };
  }
}

export async function getDashboardSummary() {
  return fetchWithErrorHandling('/dashboard-summary');
}

export async function getMagneticData() {
  try {
    // Try direct NOAA API first for reliable data
    console.log("Trying direct NOAA fetch first for reliability");
    return await fetchNOAAMagneticData();
  } catch (error) {
    console.error("NOAA API fetch failed, falling back to backend:", error);
    try {
      const data = await fetchWithErrorHandling('/magnetic-data');
      return data.data ? { data: data.data } : { data: [] };
    } catch (backendError) {
      console.error("Backend API error:", backendError);
      return { data: [] };
    }
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
