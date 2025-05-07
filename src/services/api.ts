const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const protocol = window.location.protocol;

/**
 * Fetches magnetic field data from the API
 * @returns Promise with magnetic field readings
 */
// api.tsx
export async function getDashboardSummary() {
  const res = await fetch(`${API_BASE_URL}/dashboard-summary`);
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
    throw error; // Re-throw the error so it can be handled elsewhere
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
    throw error; // Re-throw the error so it can be handled elsewhere
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
    throw error; // Re-throw the error so it can be handled elsewhere
  }
}
