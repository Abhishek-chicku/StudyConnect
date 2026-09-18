import Navbar from "../components/Navbar";
import { useDoubts } from "../context/DoubtContext";
import { useState } from "react";

function MyDoubts({ user, onBack, onLogout, onProfile }) {
  const { doubts = [] } = useDoubts();

  const [activeTab, setActiveTab] = useState("all");

  const studentDoubts = doubts;

  const getStatusClass = (status = "") => {
    return `status-badge status-${status
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  };

  const getSubjectIconClass = (subject = "") => {
    const value = subject.toLowerCase();

    if (value.includes("math")) return "math-icon";
    if (value.includes("physics")) return "physics-icon";
    if (value.includes("chem")) return "chemistry-icon";

    return "general-icon";
  };

  const formatDate = (doubt) => {
    if (doubt.date) return doubt.date;

    if (doubt.createdAt) {
      return new Date(doubt.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return "Date not available";
  };

  const joinVideoCall = (doubt) => {
    const roomId =
      doubt.roomId || `studyconnect-${doubt._id || doubt.id}`;

    if (!doubt._id && !doubt.id) {
      alert("Video session is not available.");
      return;
    }

    const meetingUrl =
      `https://meet.jit.si/${encodeURIComponent(roomId)}`;

    window.open(meetingUrl, "_blank");
  };

  const allDoubts = studentDoubts;

  const pendingDoubts = studentDoubts.filter(
    (doubt) => doubt.status?.toLowerCase() === "pending"
  );

  const acceptedDoubts = studentDoubts.filter(
    (doubt) => doubt.status?.toLowerCase() === "accepted"
  );

  const solvedDoubts = studentDoubts.filter(
    (doubt) =>
      doubt.status?.toLowerCase() === "solved" ||
      doubt.status?.toLowerCase() === "completed"
  );

  const rejectedDoubts = studentDoubts.filter(
    (doubt) => doubt.status?.toLowerCase() === "rejected"
  );

  let visibleDoubts = allDoubts;

  if (activeTab === "pending") visibleDoubts = pendingDoubts;
  if (activeTab === "accepted") visibleDoubts = acceptedDoubts;
  if (activeTab === "solved") visibleDoubts = solvedDoubts;
  if (activeTab === "rejected") visibleDoubts = rejectedDoubts;

  return (
    <div className="doubts-page">
      <Navbar
        user={user}
        onBack={onBack}
        onProfile={onProfile}
        onLogout={onLogout}
      />

      <main className="reference-doubts-container">

        <section className="reference-doubts-panel">

          <div className="reference-doubts-header">

            <div className="reference-title-area">
              <div className="reference-title-icon">
                ☷
              </div>

              <div>
                <h1>Recent Doubts</h1>
                <p>Track your latest learning requests</p>
              </div>
            </div>

            <div className="reference-total-box">
              <div className="reference-total-icon">
                ▥
              </div>

              <div>
                <strong>{studentDoubts.length} Doubts</strong>
                <span>Total Submitted</span>
              </div>
            </div>

          </div>

          <div className="reference-filter-row">

            <div className="reference-tabs">

              <button
                className={`reference-tab ${
                  activeTab === "all" ? "active" : ""
                }`}
                onClick={() => setActiveTab("all")}
              >
                All Doubts ({allDoubts.length})
              </button>

              <button
                className={`reference-tab pending-tab ${
                  activeTab === "pending" ? "active" : ""
                }`}
                onClick={() => setActiveTab("pending")}
              >
                <span>◷</span>
                Pending ({pendingDoubts.length})
              </button>

              <button
                className={`reference-tab accepted-tab ${
                  activeTab === "accepted" ? "active" : ""
                }`}
                onClick={() => setActiveTab("accepted")}
              >
                <span>✓</span>
                Accepted ({acceptedDoubts.length})
              </button>

              <button
                className={`reference-tab solved-tab ${
                  activeTab === "solved" ? "active" : ""
                }`}
                onClick={() => setActiveTab("solved")}
              >
                <span>✓</span>
                Solved ({solvedDoubts.length})
              </button>

              <button
                className={`reference-tab rejected-tab ${
                  activeTab === "rejected" ? "active" : ""
                }`}
                onClick={() => setActiveTab("rejected")}
              >
                <span>×</span>
                Rejected ({rejectedDoubts.length})
              </button>

            </div>

            <button className="reference-sort">
              <span>☷</span>
              Newest First
              <span>⌄</span>
            </button>

          </div>

          <div className="reference-doubts-list">

            {visibleDoubts.length === 0 ? (

              <div className="reference-empty">
                <div>💡</div>
                <h3>No doubts found</h3>
                <p>There are no doubts in this category.</p>
              </div>

            ) : (

              visibleDoubts.map((doubt, index) => {

                const status = doubt.status || "Pending";

                const subject = doubt.subject || "General";

                const question =
                  doubt.description ||
                  doubt.question ||
                  "No description available";

                return (
                  <article
                    className="reference-doubt-card"
                    key={doubt._id || doubt.id || index}
                  >

                    <div
                      className={`reference-subject-icon ${getSubjectIconClass(
                        subject
                      )}`}
                    >
                      √x
                    </div>

                    <div className="reference-doubt-info">

                      <h3>{question}</h3>

                      <div className="reference-meta">

                        <span>
                          ♧ {subject}
                        </span>

                        <span>
                          ▣ {formatDate(doubt)}
                        </span>

                      </div>

                    </div>

                    <div className="reference-doubt-actions">

                      <span className={getStatusClass(status)}>
                        ✓ {status}
                      </span>

                      {status.toLowerCase() === "accepted" && (
                        <button
                          type="button"
                          className="reference-video-btn"
                          onClick={() => joinVideoCall(doubt)}
                        >
                          ▣ &nbsp; Join Video Call
                        </button>
                      )}

                      {status.toLowerCase() === "pending" && (
                        <span className="reference-waiting">
                          Waiting for tutor
                        </span>
                      )}

                      {(status.toLowerCase() === "solved" ||
                        status.toLowerCase() === "completed") && (
                        <span className="reference-waiting">
                          ✓ Completed
                        </span>
                      )}

                      <button
                        type="button"
                        className="reference-more-btn"
                      >
                        ⋮
                      </button>

                    </div>

                  </article>
                );
              })

            )}

          </div>

        </section>

      </main>
    </div>
  );
}

export default MyDoubts;