import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function StartScreening() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please enter both Job Title and Job Description.");
      return;
    }

    try {
      setLoading(true);
const response = await api.post("start-screening/", {
    title: title,
    description: description,
});
      console.log(response.data);

      const sessionId = response.data.screening_session_id;

      navigate(`/upload-resumes/${sessionId}`);

    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error("Backend error:", error.response.data);
      }

      alert("Screening start nahi ho saki.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      <div style={styles.container}>

        {/* Header */}

        <div style={styles.header}>
          <h1 style={styles.title}>
            AI Resume Screening
          </h1>

          <p style={styles.subtitle}>
            Find the most relevant candidates using AI-powered resume
            screening.
          </p>
        </div>


        {/* Form Card */}

        <div style={styles.card}>

          <h2 style={styles.cardTitle}>
            Create New Screening
          </h2>

          <p style={styles.cardSubtitle}>
            Enter the job details to start a new candidate screening session.
          </p>


          <form onSubmit={handleSubmit}>

            {/* Job Title */}

            <div style={styles.field}>

              <label style={styles.label}>
                Job Title
              </label>

              <input
                type="text"
                placeholder="e.g. Python Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
              />

            </div>


            {/* Job Description */}

            <div style={styles.field}>

              <label style={styles.label}>
                Job Description
              </label>

              <textarea
                placeholder="Enter required skills, experience, responsibilities..."
                rows="12"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.textarea}
              />

            </div>


            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Creating Screening..."
                : "Start Screening"}
            </button>

          </form>

        </div>


        {/* Information */}

        <div style={styles.info}>

          <div style={styles.infoItem}>
            <strong>1</strong>
            <span>Enter Job Description</span>
          </div>

          <div style={styles.arrow}>
            →
          </div>

          <div style={styles.infoItem}>
            <strong>2</strong>
            <span>Upload Multiple Resumes</span>
          </div>

          <div style={styles.arrow}>
            →
          </div>

          <div style={styles.infoItem}>
            <strong>3</strong>
            <span>Get AI Screening Results</span>
          </div>

        </div>

      </div>

    </div>
  );
}


const styles = {

  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    padding: "50px 20px",
    fontFamily: "Arial, sans-serif",
  },

  container: {
    maxWidth: "850px",
    margin: "0 auto",
  },

  header: {
    textAlign: "center",
    marginBottom: "35px",
  },

  title: {
    fontSize: "38px",
    margin: 0,
    color: "#111827",
  },

  subtitle: {
    marginTop: "12px",
    color: "#6b7280",
    fontSize: "16px",
  },

  card: {
    backgroundColor: "white",
    padding: "35px",
    borderRadius: "14px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  },

  cardTitle: {
    margin: 0,
    fontSize: "25px",
    color: "#111827",
  },

  cardSubtitle: {
    color: "#6b7280",
    marginBottom: "30px",
  },

  field: {
    marginBottom: "24px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#374151",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    resize: "vertical",
    outline: "none",
    fontFamily: "Arial, sans-serif",
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#111827",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  info: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },

  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#4b5563",
    fontSize: "14px",
  },

  arrow: {
    color: "#9ca3af",
    fontSize: "20px",
  },

};

export default StartScreening;