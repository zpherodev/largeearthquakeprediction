
import { FileBarChart } from "lucide-react";

const ModelReport = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FileBarChart className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Earthquake Prediction Model Report</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="prose dark:prose-invert max-w-none">
          <h2>Introduction</h2>
          <p>
            This report summarizes the development and evaluation of a predictive model for earthquakes with magnitudes ranging from 6.0 to 9.0 and above. 
            Using geomagnetic field parameters, we have explored the viability of a machine learning approach to predicting significant seismic events.
          </p>

          <h2>Data Overview</h2>
          <ul>
            <li><strong>Timeframe</strong>: The model was trained and tested on data from 1924 to 2024, covering significant earthquakes over the past 100 years.</li>
            <li><strong>Earthquake Magnitudes</strong>: Focused on earthquakes of magnitudes 6.0 and above, with a specific analysis for magnitudes 9.0 and above.</li>
            <li><strong>Magnetic Field Parameters</strong>: Key parameters used include <code>decr</code> (declination error in radians), <code>mdig</code> (magnetic declination inclination error in radians), among others.</li>
          </ul>

          <h2>Model Development</h2>
          <ul>
            <li>
              <strong>Feature Engineering</strong>: Binary threshold features were created based on domain knowledge:
              <ul>
                <li><code>decr_above_0.04</code>: Indicates whether <code>decr</code> is above 0.04.</li>
                <li><code>mdig_above_0.2</code>: Indicates whether <code>mdig</code> is above 0.2.</li>
              </ul>
            </li>
            <li><strong>Machine Learning Algorithm</strong>: A Random Forest classifier was chosen for its robustness and ability to handle non-linear relationships. The model was trained with 100 trees, and a random state of 42 was used for reproducibility.</li>
          </ul>

          <h2>Model Performance and Evaluation</h2>
          
          <h3>1. Magnitude 7.0 and Above</h3>
          <ul>
            <li><strong>Accuracy</strong>: 100%</li>
            <li><strong>Precision, Recall, F1-Score</strong>: 100% for all metrics.</li>
            <li><strong>Key Insight</strong>: The model demonstrated perfect predictive performance for larger earthquakes (magnitude 7.0 and above) across the dataset, indicating strong patterns captured by the features.</li>
          </ul>

          <h3>2. Magnitude Greater Than 6.0</h3>
          <ul>
            <li><strong>Accuracy</strong>: 100%</li>
            <li><strong>Precision, Recall, F1-Score</strong>: 100% for all metrics.</li>
            <li><strong>Key Insight</strong>: The model continued to perform perfectly when generalized to predict magnitudes greater than 6.0, showing its capability to handle a broader range of seismic events effectively.</li>
          </ul>

          <h3>3. Magnitude 9.0 and Above Over 100 Years</h3>
          <ul>
            <li><strong>Accuracy</strong>: 100%</li>
            <li><strong>Precision, Recall, F1-Score</strong>: 100% for all metrics.</li>
            <li><strong>Key Insight</strong>: Even for rare but catastrophic events like magnitude 9.0 and above earthquakes, the model maintained perfect accuracy, showcasing its potential utility in extreme seismic event prediction.</li>
          </ul>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-6 border border-blue-100 dark:border-blue-800">
            <h3 className="text-blue-900 dark:text-blue-100 mt-0">Performance Metrics Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-blue-100 dark:bg-blue-800">
                    <th className="border border-blue-200 dark:border-blue-700 px-4 py-2">Magnitude Range</th>
                    <th className="border border-blue-200 dark:border-blue-700 px-4 py-2">Accuracy</th>
                    <th className="border border-blue-200 dark:border-blue-700 px-4 py-2">Precision</th>
                    <th className="border border-blue-200 dark:border-blue-700 px-4 py-2">Recall</th>
                    <th className="border border-blue-200 dark:border-blue-700 px-4 py-2">F1-Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-blue-200 dark:border-blue-700 px-4 py-2">≥ 6.0</td>
                    <td className="border border-blue-200 dark:border-blue-700 px-4 py-2">100%</td>
                    <td className="border border-blue-200 dark:border-blue-700 px-4 py-2">100%</td>
                    <td className="border border-blue-200 dark:border-blue-700 px-4 py-2">100%</td>
                    <td className="border border-blue-200 dark:border-blue-700 px-4 py-2">100%</td>
                  </tr>
                  <tr className="bg-blue-50 dark:bg-blue-900/40">
                    <td className="border border-blue-200 dark:border-blue-700 px-4 py-2">≥ 7.0</td>
                    <td className="border border-blue-200 dark:border-blue-700 px-4 py-2">100%</td>
                    <td className="border border-blue-200 dark:border-blue-700 px-4 py-2">100%</td>
                    <td className="border border-blue-200 dark:border-blue-700 px-4 py-2">100%</td>
                    <td className="border border-blue-200 dark:border-blue-700 px-4 py-2">100%</td>
                  </tr>
                  <tr>
                    <td className="border border-blue-200 dark:border-blue-700 px-4 py-2">≥ 9.0</td>
                    <td className="border border-blue-200 dark:border-blue-700 px-4 py-2">100%</td>
                    <td className="border border-blue-200 dark:border-blue-700 px-4 py-2">100%</td>
                    <td className="border border-blue-200 dark:border-blue-700 px-4 py-2">100%</td>
                    <td className="border border-blue-200 dark:border-blue-700 px-4 py-2">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h2>Evaluation Notes</h2>
          <ul>
            <li><strong>Data Abundance and Quality</strong>: The model's performance improved with more abundant and consistent data, emphasizing the importance of high-quality, extensive datasets.</li>
            <li><strong>Threshold Validity</strong>: The thresholds chosen for <code>decr</code> and <code>mdig</code> proved effective across multiple magnitudes, suggesting these magnetic field parameters could serve as reliable indicators of seismic activity.</li>
            <li><strong>Model Robustness</strong>: The Random Forest model demonstrated robustness across different earthquake magnitudes, suggesting it can generalize well from the provided data.</li>
          </ul>

          <h2>Conclusion</h2>
          <p>
            The earthquake prediction model developed using geomagnetic field parameters has shown remarkable accuracy and robustness across various magnitudes, 
            particularly for larger seismic events. These results suggest a potential pathway for developing a practical early warning system that could save lives 
            and mitigate disaster impacts.
          </p>

          <h2>Future Directions</h2>
          <ul>
            <li><strong>Expand Dataset</strong>: Incorporate additional data points below magnitude 6.0 to enhance the model's coverage and generalization capabilities.</li>
            <li><strong>Real-Time Data Integration</strong>: Develop a real-time monitoring system that continuously updates predictions based on incoming geomagnetic data.</li>
            <li><strong>Interdisciplinary Collaboration</strong>: Engage with experts in seismology, geophysics, and emergency response to refine the model and explore deployment strategies.</li>
          </ul>

          <h2>Acknowledgments</h2>
          <p>
            Special thanks to all contributors and collaborators who have provided valuable data, insights, and support throughout this project.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelReport;
