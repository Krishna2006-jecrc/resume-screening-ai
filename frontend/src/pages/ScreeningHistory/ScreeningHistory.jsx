import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function ScreeningHistory() {
  const navigate = useNavigate();

  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScreenings = async () => {
      try {
        const response = await api.get("sessions/");

        setScreenings(response.data);
      } catch (error) {
        console.error(error);
        alert("Screening history load nahi ho saki.");
      } finally {
        setLoading(false);
      }
    };

    fetchScreenings();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>

          <h2>Loading Screening History...</h2>

          <p>
            Please wait while previous screenings are loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* Header */}

      <div style={styles.header}>

        <div>
          <h1 style={styles.mainTitle}>
            Screening History
          </h1>

          <p style={styles.subtitle}>
            View your previous resume screening sessions
          </p>
        </div>

        <button
          style={styles.newButton}
          onClick={() => navigate("/")}
        >
          + New Screening
        </button>

      </div>


      {/* Empty State */}

      {screenings.length === 0 ? (

        <div style={styles.empty}>

          <h2>
            No screenings found
          </h2>

          <p>
            Start your first resume screening to see it here.
          </p>

          <button
            style={styles.startButton}
            onClick={() => navigate("/")}
          >
            Start Screening
          </button>

        </div>

      ) : (

        <div style={styles.container}>

          {screenings.map((screening) => (

            <div
              key={screening.id}
              style={styles.card}
            >

              <div>

                <p style={styles.label}>
                  SCREENING
                </p>

                <h2 style={styles.jobTitle}>
                  {screening.job_title}
                </h2>

                <p style={styles.date}>
                  Created: {formatDate(screening.created_at)}
                </p>

              </div>


              <button
                style={styles.viewButton}
                onClick={() =>
                  navigate(
                    `/results?sessionId=${screening.id}`
                  )
                }
              >
                View Results
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}


const styles = {

  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    padding: "40px 25px",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    maxWidth: "1100px",
    margin: "0 auto 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  mainTitle: {
    margin: 0,
    fontSize: "36px",
    color: "#111827",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
    fontSize: "16px",
  },

  newButton: {
    border: "none",
    borderRadius: "8px",
    padding: "12px 20px",
    backgroundColor: "#111827",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "22px 25px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  label: {
    margin: 0,
    color: "#9ca3af",
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },

  jobTitle: {
    margin: "6px 0",
    color: "#111827",
    fontSize: "21px",
  },

  date: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },

  viewButton: {
    border: "none",
    borderRadius: "7px",
    padding: "10px 16px",
    backgroundColor: "#111827",
    color: "white",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },

  empty: {
    maxWidth: "700px",
    margin: "50px auto",
    backgroundColor: "white",
    padding: "50px",
    textAlign: "center",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
  },

  startButton: {
    marginTop: "15px",
    border: "none",
    borderRadius: "7px",
    padding: "11px 18px",
    backgroundColor: "#111827",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  loadingPage: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
  },

  loadingCard: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  spinner: {
    width: "35px",
    height: "35px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #111827",
    borderRadius: "50%",
    margin: "0 auto 20px",
  },

};

export default ScreeningHistory;