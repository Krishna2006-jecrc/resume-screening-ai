import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function UploadResumes() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const { sessionId } = useParams();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    setFiles((previousFiles) => [
      ...previousFiles,
      ...selectedFiles,
    ]);

    // Same file ko dobara select karne ki permission
    e.target.value = "";
  };

  const removeFile = (indexToRemove) => {
    setFiles((previousFiles) =>
      previousFiles.filter(
        (_, index) => index !== indexToRemove
      )
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please select at least one PDF resume.");
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("resumes", file);
    });

    try {
      setLoading(true);

      const response = await api.post(
        `screenings/${sessionId}/upload-resumes/`,
        formData
      );

      console.log(response.data);

      navigate(`/results?sessionId=${sessionId}`);

    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(
          "Backend error:",
          error.response.data
        );
      }

      alert("Resume upload nahi ho saka.");

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
            Upload Resumes
          </h1>

          <p style={styles.subtitle}>
            Upload candidate resumes to screen them against
            the job description.
          </p>

        </div>


        {/* Main Card */}

        <div style={styles.card}>

          <h2 style={styles.cardTitle}>
            Candidate Resumes
          </h2>

          <p style={styles.cardSubtitle}>
            Select one or multiple PDF resumes.
          </p>


          {/* Upload Area */}

          <label style={styles.uploadArea}>

            <div style={styles.uploadIcon}>
              📄
            </div>

            <h3 style={styles.uploadTitle}>
              Select Resume PDFs
            </h3>

            <p style={styles.uploadText}>
              Click here to browse your computer
            </p>

            <span style={styles.uploadButton}>
              Choose Files
            </span>

            <input
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={handleFileChange}
              style={styles.fileInput}
            />

          </label>


          {/* Selected Files */}

          {files.length > 0 && (

            <div style={styles.filesSection}>

              <div style={styles.filesHeader}>

                <h3 style={styles.filesTitle}>
                  Selected Resumes
                </h3>

                <span style={styles.countBadge}>
                  {files.length}{" "}
                  {files.length === 1
                    ? "Resume"
                    : "Resumes"}
                </span>

              </div>


              <div style={styles.fileList}>

                {files.map((file, index) => (

                  <div
                    key={`${file.name}-${index}`}
                    style={styles.fileCard}
                  >

                    <div style={styles.fileLeft}>

                      <div style={styles.pdfIcon}>
                        PDF
                      </div>

                      <div>

                        <p style={styles.fileName}>
                          {file.name}
                        </p>

                        <p style={styles.fileSize}>
                          {formatFileSize(file.size)}
                        </p>

                      </div>

                    </div>


                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>

                  </div>

                ))}

              </div>

            </div>

          )}


          {/* Upload Button */}

          <button
            type="button"
            onClick={handleUpload}
            disabled={loading || files.length === 0}
            style={{
              ...styles.screenButton,
              opacity:
                loading || files.length === 0
                  ? 0.6
                  : 1,
              cursor:
                loading || files.length === 0
                  ? "not-allowed"
                  : "pointer",
            }}
          >

            {loading
              ? "Screening Resumes..."
              : `Upload & Screen ${
                  files.length > 0
                    ? `${files.length} Resume${
                        files.length > 1 ? "s" : ""
                      }`
                    : "Resumes"
                }`}

          </button>

        </div>


        {/* Process Info */}

        <div style={styles.info}>

          <div style={styles.infoItem}>
            <span style={styles.number}>1</span>
            <span>Select Resumes</span>
          </div>

          <span style={styles.arrow}>→</span>

          <div style={styles.infoItem}>
            <span style={styles.number}>2</span>
            <span>AI Screening</span>
          </div>

          <span style={styles.arrow}>→</span>

          <div style={styles.infoItem}>
            <span style={styles.number}>3</span>
            <span>View Results</span>
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
    marginBottom: "25px",
  },

  uploadArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "2px dashed #d1d5db",
    borderRadius: "12px",
    padding: "35px 20px",
    cursor: "pointer",
    backgroundColor: "#fafafa",
  },

  uploadIcon: {
    fontSize: "42px",
    marginBottom: "10px",
  },

  uploadTitle: {
    margin: "5px 0",
    color: "#111827",
    fontSize: "18px",
  },

  uploadText: {
    color: "#6b7280",
    margin: "5px 0 18px",
    fontSize: "14px",
  },

  uploadButton: {
    backgroundColor: "#111827",
    color: "white",
    padding: "10px 18px",
    borderRadius: "7px",
    fontSize: "14px",
    fontWeight: "bold",
  },

  fileInput: {
    display: "none",
  },

  filesSection: {
    marginTop: "30px",
  },

  filesHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  filesTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#374151",
  },

  countBadge: {
    backgroundColor: "#eef2ff",
    color: "#3730a3",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "bold",
  },

  fileList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  fileCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    padding: "14px",
    border: "1px solid #e5e7eb",
    borderRadius: "9px",
    backgroundColor: "#fafafa",
  },

  fileLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },

  pdfIcon: {
    backgroundColor: "#111827",
    color: "white",
    padding: "8px 7px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "bold",
  },

  fileName: {
    margin: 0,
    color: "#111827",
    fontWeight: "bold",
    fontSize: "14px",
    wordBreak: "break-word",
  },

  fileSize: {
    margin: "4px 0 0",
    color: "#9ca3af",
    fontSize: "12px",
  },

  removeButton: {
    border: "none",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "7px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
    flexShrink: 0,
  },

  screenButton: {
    width: "100%",
    marginTop: "30px",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#111827",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
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

  number: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: "#111827",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "bold",
  },

  arrow: {
    color: "#9ca3af",
    fontSize: "20px",
  },
};


export default UploadResumes;