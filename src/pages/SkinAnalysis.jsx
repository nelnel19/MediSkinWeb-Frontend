import React, { useState, useEffect } from "react";
import API from "../api/axios";
import "../styles/skinanalysis.css"; // optional styles

const SkinAnalysis = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  // Get logged-in user from localStorage (adjust based on your auth)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setUserId(user._id);
    } else {
      setError("Please log in to view your skin analysis history.");
      setLoading(false);
    }
  }, []);

  // Fetch history when userId changes
  useEffect(() => {
    if (!userId) return;
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/api/skin-history/${userId}`);
        setHistory(response.data.history);
      } catch (err) {
        console.error("Error fetching skin history:", err);
        setError(err.response?.data?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  if (loading) return <div className="history-loading">Loading your analysis history...</div>;
  if (error) return <div className="history-error">{error}</div>;

  return (
    <div className="skin-analysis-container">
      {/* Analysis form goes here – your existing analysis UI */}

      {/* History section */}
      <div className="skin-history-section">
        <h2>Your Skin Analysis History</h2>
        {history.length === 0 ? (
          <p>No analyses yet. Try scanning your skin!</p>
        ) : (
          <div className="history-grid">
            {history.map((item) => (
              <div key={item._id} className="history-card">
                <img src={item.image_url} alt="Skin analysis" className="history-img" />
                <div className="history-info">
                  <h3>{item.prediction.disease}</h3>
                  <p>Confidence: {item.prediction.confidence}%</p>
                  <p className="date">{new Date(item.created_at).toLocaleDateString()}</p>
                  <details>
                    <summary>View Details</summary>
                    <p>{item.prediction.description}</p>
                    {item.prediction.medication_info?.has_medications && (
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