import React, { useState, useEffect } from "react";
import API from "../api/axios";
import "../styles/skinanalysis.css";

const SkinAnalysis = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllHistory = async () => {
      try {
        setLoading(true);
        const response = await API.get("/api/skin-history/all");
        console.log("API response:", response.data);
        setHistory(response.data.history || []);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError(err.response?.data?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchAllHistory();
  }, []);

  if (loading) return <div className="history-loading">Loading analysis history...</div>;
  if (error) return <div className="history-error">{error}</div>;

  return (
    <div className="skin-analysis-container">
      {/* Your analysis form goes here (if any) */}

      <div className="skin-history-section">
        <h2>All Skin Analysis History</h2>
        {history.length === 0 ? (
          <p>No analyses yet.</p>
        ) : (
          <div className="history-grid">
            {history.map((item) => (
              <div key={item._id} className="history-card">
                <img src={item.image_url} alt="Skin analysis" className="history-img" />
                <div className="history-info">
                  <h3>{item.prediction?.disease || "Unknown"}</h3>
                  <p>Confidence: {item.prediction?.confidence || "N/A"}%</p>
                  <p className="date">{new Date(item.created_at).toLocaleDateString()}</p>
                  <details>
                    <summary>View Details</summary>
                    <p>{item.prediction?.description}</p>
                    {item.prediction?.medication_info?.has_medications && (
                      <>
                        <h4>Recommended Treatments</h4>
                        <ul>
                          {item.prediction.medication_info.medications.map((med, idx) => (
                            <li key={idx}>
                              <strong>{med.category}</strong>: {med.items.join(", ")}
                              <p>{med.description}</p>
                            </li>
                          ))}
                        </ul>
                        <h4>General Advice</h4>
                        <ul>
                          {item.prediction.medication_info.general_advice.map((adv, idx) => (
                            <li key={idx}>{adv}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </details>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkinAnalysis;