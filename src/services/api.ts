
import { toast } from "sonner";

// Update to point to the actual backend server
// We'll use a conditional to support both development and production environments
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function for API requests with proper error handling
async function fetchWithErrorHandling(endpoint: string, options = {}) {
  try {
    console.log(`Fetching from: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const errorMsg = `API Error (${response.status}): ${response.statusText}`;
      console.error(errorMsg);
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    toast.error(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

export async function getDashboardSummary() {
  return fetchWithErrorHandling('/dashboard-summary');
}

export async function getMagneticData() {
  try {
    const data = await fetchWithErrorHandling('/magnetic-data');
    // Ensure we have the right structure even if the API response format changes
    return data.data ? { data: data.data } : { data: [] };
  } catch (error) {
    console.error("Error in getMagneticData:", error);
    // Return empty array to prevent UI errors
    return { data: [] };
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
