import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get("sessionId");

  const [results, setResults] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get(
          `screenings/${sessionId}/results/`
        );

        console.log(response.data);

        setResults(response.data.candidates);
        setJobTitle(response.data.job_title);

     } catch (error) {
  console.error(error);

  setError(
    error.response?.data?.error ||
    "Results load nahi ho sake. Please try again."
  );
} finally {
        setLoading(false);
      }
    };
if (sessionId) {
  fetchResults();
} else {
  setError("Screening session not found.");
  setLoading(false);
}
  }, [sessionId]);

  if (loading) {

    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <h2>Analyzing Candidates...</h2>
          <p>
            Please wait while the screening results are loaded.
          </p>
        </div>
      </div>
    );
  }
  if (error) {
  return (
    <div style={styles.loadingPage}>
      <div style={styles.loadingCard}>
        <h2>Something went wrong</h2>

        <p>{error}</p>

        <button
          onClick={() => navigate("/")}
          style={styles.newButton}
        >
          Go to New Screening
        </button>
      </div>
    </div>
  );
}

  const shortlistedCount = results.filter(
    (candidate) => candidate.shortlisted
  ).length;

  const averageScore =
    results.length > 0
      ? (
          results.reduce(
            (total, candidate) =>
              total + candidate.match_score,
            0
          ) / results.length
        ).toFixed(1)
      : 0;

  return (
    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.header}>

        <div>
          <h1 style={styles.mainTitle}>
            AI Resume Screening
          </h1>

          <p style={styles.subtitle}>
            Candidate Screening Dashboard
          </p>
        </div>
<div style={styles.headerActions}>

  <button
    style={styles.historyButton}
    onClick={() => navigate("/history")}
  >
    Screening History
  </button>

  <button
    style={styles.newButton}
    onClick={() => navigate("/")}
  >
    + New Screening
  </button>

</div>

      </div>


      {/* JOB INFORMATION */}

      <div style={styles.jobBox}>

        <div>
          <p style={styles.smallLabel}>
            SCREENING FOR
          </p>

          <h2 style={styles.jobTitle}>
            {jobTitle}
          </h2>
        </div>

      </div>


      {/* SUMMARY CARDS */}

      <div style={styles.summaryGrid}>

        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>
            Total Candidates
          </p>

          <h2 style={styles.summaryNumber}>
            {results.length}
          </h2>
        </div>


        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>
            Shortlisted
          </p>

          <h2 style={styles.summaryNumber}>
            {shortlistedCount}
          </h2>
        </div>


        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>
            Average Match
          </p>

          <h2 style={styles.summaryNumber}>
            {averageScore}%
          </h2>
        </div>

      </div>


      {/* CANDIDATES */}

      <div style={styles.resultsHeader}>

        <div>
          <h2 style={styles.resultsTitle}>
            Candidate Results
          </h2>

          <p style={styles.resultsSubtitle}>
            Candidates are ranked by their match score.
          </p>
        </div>

      </div>


      {results.length === 0 ? (

        <div style={styles.empty}>

          <h2>
            No candidates found
          </h2>

          <p>
            No resumes have been screened for this job.
          </p>

        </div>

      ) : (

        <div style={styles.resultsContainer}>

          {results.map((candidate, index) => (

            <div
              key={candidate.resume_id}
              style={styles.card}
            >

              {/* CARD HEADER */}

              <div style={styles.cardHeader}>

                <div style={styles.candidateInfo}>

                  <div style={styles.rankCircle}>
                    {index + 1}
                  </div>

                  <div>

                    <p style={styles.rankText}>
                      Rank #{index + 1}
                    </p>

                    <h2 style={styles.candidateName}>
                      {candidate.candidate_name}
                    </h2>

                  </div>

                </div>


                <div style={styles.actions}>

  <div
    style={{
      ...styles.status,
      ...(candidate.shortlisted
        ? styles.shortlisted
        : styles.notShortlisted),
    }}
  >
    {candidate.shortlisted
      ? "✓ Shortlisted"
      : "Not Shortlisted"}
  </div>

  <button
    type="button"
    onClick={() => window.open(candidate.resume_url, "_blank")}
    style={styles.viewResumeButton}
  >
    View Resume
  </button>

</div>

              </div>


              {/* SCORE */}

              <div style={styles.scoreSection}>

                <div style={styles.scoreHeader}>

                  <div>

                    <p style={styles.scoreLabel}>
                      Resume Match Score
                    </p>

                    <p style={styles.score}>
                      {candidate.match_score}%
                    </p>

                  </div>

                </div>


                <div style={styles.scoreBarBackground}>

                  <div
                    style={{
                      ...styles.scoreBar,
                      width: `${Math.min(
                        candidate.match_score,
                        100
                      )}%`,
                    }}
                  />

                </div>

              </div>


              {/* SKILLS */}

              <div style={styles.skillsSection}>

                {/* MATCHED */}

                <div>

                  <h3 style={styles.skillTitle}>
                    ✓ Matched Skills
                  </h3>

                  <div style={styles.skills}>

                    {candidate.matched_skills.length > 0 ? (

                      candidate.matched_skills.map((skill) => (

                        <span
                          key={skill}
                          style={styles.matchedSkill}
                        >
                          {skill}
                        </span>

                      ))

                    ) : (

                      <span style={styles.noSkill}>
                        No matched skills
                      </span>

                    )}

                  </div>

                </div>


                {/* MISSING */}

                <div>

                  <h3 style={styles.skillTitle}>
                    ⚠ Missing Skills
                  </h3>

                  <div style={styles.skills}>

                    {candidate.missing_skills.length > 0 ? (

                      candidate.missing_skills.map((skill) => (

                        <span
                          key={skill}
                          style={styles.missingSkill}
                        >
                          {skill}
                        </span>

                      ))

                    ) : (

                      <span style={styles.noSkill}>
                        No missing skills
                      </span>

                    )}

                  </div>

                </div>

              </div>

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
    margin: "0 auto 25px",
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
  headerActions: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
},

historyButton: {
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "12px 20px",
  backgroundColor: "white",
  color: "#111827",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "bold",
},

  jobBox: {
    maxWidth: "1100px",
    margin: "0 auto 20px",
    backgroundColor: "white",
    padding: "22px 25px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
  },

  smallLabel: {
    margin: 0,
    color: "#9ca3af",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },

  jobTitle: {
    margin: "7px 0 0",
    color: "#111827",
    fontSize: "24px",
  },

  summaryGrid: {
    maxWidth: "1100px",
    margin: "0 auto 30px",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
  },

  summaryCard: {
    backgroundColor: "white",
    padding: "22px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
  },

  summaryLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },

  summaryNumber: {
    margin: "8px 0 0",
    color: "#111827",
    fontSize: "30px",
  },

  resultsHeader: {
    maxWidth: "1100px",
    margin: "0 auto 18px",
  },

  resultsTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "24px",
  },

  resultsSubtitle: {
    marginTop: "6px",
    color: "#6b7280",
    fontSize: "14px",
  },

  resultsContainer: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  candidateInfo: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  rankCircle: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#111827",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  rankText: {
    margin: 0,
    color: "#9ca3af",
    fontSize: "12px",
  },

  candidateName: {
    margin: "4px 0 0",
    color: "#111827",
    fontSize: "21px",
  },

  status: {
    padding: "8px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "bold",
  },

  shortlisted: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },

  notShortlisted: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  actions: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
},
  viewResumeButton: {
  border: "1px solid #d1d5db",
  backgroundColor: "white",
  color: "#111827",
  padding: "8px 14px",
  borderRadius: "7px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "bold",
},

  scoreSection: {
    marginTop: "25px",
  },

  scoreHeader: {
    display: "flex",
    justifyContent: "space-between",
  },

  scoreLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },

  score: {
    margin: "5px 0 12px",
    color: "#111827",
    fontSize: "30px",
    fontWeight: "bold",
  },

  scoreBarBackground: {
    width: "100%",
    height: "10px",
    backgroundColor: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
  },

  scoreBar: {
    height: "100%",
    backgroundColor: "#111827",
    borderRadius: "10px",
  },

  skillsSection: {
    marginTop: "25px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
  },

  skillTitle: {
    margin: "0 0 12px",
    fontSize: "15px",
    color: "#374151",
  },

  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  matchedSkill: {
    padding: "6px 10px",
    borderRadius: "6px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: "bold",
  },

  missingSkill: {
    padding: "6px 10px",
    borderRadius: "6px",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    fontSize: "12px",
    fontWeight: "bold",
  },

  noSkill: {
    color: "#9ca3af",
    fontSize: "13px",
  },

  empty: {
    maxWidth: "1100px",
    margin: "0 auto",
    backgroundColor: "white",
    padding: "50px",
    textAlign: "center",
    borderRadius: "12px",
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


export default Results;