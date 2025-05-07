import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://preview--quake-watch-magnetic-eye.lovable.app/api';

export async function getDashboardSummary() {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard-summary`);
    if (!res.ok) {
      const error = new Error(res.status === 404 ? "Dashboard summary endpoint not found" : "Failed to fetch dashboard summary");
      toast.error(error.message);
      throw error;
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    toast.error(error.message);
    throw error;
  }
}

export async function getMagneticData() {
  try {
    const response = await fetch(`${API_BASE_URL}/magnetic-data`);
    if (!response.ok) {
      const error = new Error(response.status === 404 ? "NOAA API not found, serving cached data or empty" : `Failed to fetch magnetic data: ${response.statusText}`);
      toast.error(error.message);
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching magnetic data:", error);
    toast.error(error.message);
    throw error;
  }
}

export async function getPredictions() {
  try {
    const response = await fetch(`${API_BASE_URL}/predictions`);
    if (!response.ok) {
      const error = new Error(response.status === 404 ? "Predictions endpoint not found" : `Failed to fetch predictions: ${response.statusText}`);
      toast.error(error.message);
      throw error;
    }
    const data = await response.json();
    const filteredPredictions = data.predictions.filter((prediction) => prediction.magnitude >= 6.0);
    return { predictions: filteredPredictions };
  } catch (error) {
    console.error("Error fetching predictions:", error);
    toast.error(error.message);
    throw error;
  }
}

export async function getModelStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/model-status`);
    if (!response.ok) {
      const error = new Error(response.status === 404 ? "Model status endpoint not found" : `Failed to fetch model status: ${response.statusText}`);
      toast.error(error.message);
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching model status:", error);
    toast.error(error.message);
    throw error;
  }
}

export async function getRiskAssessment() {
  try {
    const response = await fetch(`${API_BASE_URL}/risk-assessment`);
    if (!response.ok) {
      const error = new Error(response.status === 404 ? "Risk assessment endpoint not found" : `Failed to fetch risk assessment: ${response.statusText}`);
      toast.error(error.message);
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching risk assessment:", error);
    toast.error(error.message);
    throw error;
  }
}
