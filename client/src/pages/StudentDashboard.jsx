import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function StudentDashboard({
  user,
  onLogout,
  onAskDoubt,
  onProfile,
  onMyDoubts,
}) {
  const availableTokens =
    user?.availableTokens ?? user?.tokens ?? 100;

  const studentId = user?._id || user?.id;
  const token = localStorage.getItem("token");

  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      setError("Student information not found.");
      return;
    }

    let firstLoad = true;

    const fetchDoubts = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/doubts/student/${studentId}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch doubts."
          );
        }

        const doubtsData = Array.isArray(data)
          ? data
          : data.doubts || [];

        setDoubts(doubtsData);
        setError("");

        if (firstLoad) {
          setLoading(false);
          firstLoad = false;
          return;
        }

        const acceptedDoubt = doubtsData.find(
          (doubt) => doubt.status?.toLowerCase() === "accepted"
        );

        if (acceptedDoubt) {
          const notificationKey =
            `accepted-doubt-${acceptedDoubt._id}`;

          const alreadyShown =
            localStorage.getItem(notificationKey);

          if (!alreadyShown) {
            setNotification({
              _id: acceptedDoubt._id,
              subject: acceptedDoubt.subject,
              question: acceptedDoubt.question,
              roomId:
                acceptedDoubt.roomId ||
                `studyconnect-${acceptedDoubt._id}`,
            });

            localStorage.setItem(
              notificationKey,
              "true"
            );
          }
        }
      } catch (err) {
        console.error("Error fetching doubts:", err);

        if (firstLoad) {
          setError("Unable to load your doubts.");
          setLoading(false);
        }
      }
    };

    fetchDoubts();

    const interval = setInterval(fetchDoubts, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [studentId, token]);

  const completedSessions = doubts.filter((doubt) => {
    const status = doubt.status?.toLowerCase();

    return (
      status === "solved" ||
      status === "completed"
    );
  }).length;

  const acceptedDoubts = doubts.filter(
    (doubt) => doubt.status?.toLowerCase() === "accepted"
  );

  const pendingDoubts = doubts.filter(
    (doubt) => doubt.status?.toLowerCase() === "pending"
  );

  const joinVideoCall = (doubt) => {
    const roomId =
      doubt.roomId ||
      `studyconnect-${doubt._id}`;

    const meetingUrl =
      `https://meet.jit.si/${encodeURIComponent(roomId)}`;

    window.open(meetingUrl, "_blank");
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const getIconClass = (subject = "") => {
    const value = subject.toLowerCase();

    if (value.includes("math")) {
      return "dashboard-math-icon";
    }

    if (value.includes("physics")) {
      return "dashboard-physics-icon";
    }

    if (value.includes("chem")) {
      return "dashboard-chemistry-icon";
    }

    return "dashboard-general-icon";
  };

  const formatDate = (doubt) => {
    if (doubt.date) {
      return doubt.date;
    }

    if (doubt.createdAt) {
      return new Date(doubt.createdAt).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    }

    return "Date not available";
  };

  return (
    <div className="dashboard-page">

      <Navbar
        user={user}
        onProfile={onProfile}
        onLogout={onLogout}
      />

      {notification && (
        <div className="student-notification">
          <div className="notification-icon">
            🎉
          </div>

          <div className="notification-content">
            <h3>
              Your doubt has been accepted!
            </h3>

            <p>
              Tutor has accepted your{" "}
              <strong>
                {notification.subject}
              </strong>{" "}
              doubt.
            </p>

            <button
              type="button"
              className="notification-join-btn"
              onClick={() =>
                joinVideoCall(notification)
              }
            >
              🎥 Join Video Call
            </button>
          </div>

          <button
            type="button"
            className="notification-close"
            onClick={closeNotification}
          >
            ✕
          </button>
        </div>
      )}

      <main className="student-dashboard-main">

        {/* TOP HEADING */}

        <div className="student-dashboard-heading">
          <p>
            Welcome back, {user?.name || "Student"} 👋
          </p>

          <h1>
            What do you want to learn today?
          </h1>
        </div>

        {/* STATS */}

        <div className="student-dashboard-stats">

          <div className="student-stat-card">
            <div className="student-stat-top">
              <div>
                <p>Available Tokens</p>
                <h2>{availableTokens}</h2>
                <span>
                  Use tokens to request tutors
                </span>
              </div>

              <div className="student-stat-icon token-icon">
                🪙
              </div>
            </div>
          </div>

          <div className="student-stat-card">
            <div className="student-stat-top">
              <div>
                <p>Total Doubts</p>
                <h2>{doubts.length}</h2>
                <span>
                  Your submitted doubts
                </span>
              </div>

              <div className="student-stat-icon doubt-icon">
                ▤
              </div>
            </div>
          </div>

          <div className="student-stat-card">
            <div className="student-stat-top">
              <div>
                <p>Completed Sessions</p>
                <h2>{completedSessions}</h2>
                <span>
                  Your learning history
                </span>
              </div>

              <div className="student-stat-icon session-icon">
                ✓
              </div>
            </div>
          </div>

        </div>

        {/* ASK DOUBT HERO */}

        <section className="student-help-card">

          <div className="student-help-content">

            <span className="student-help-small">
              💡
            </span>

            <h2>
              Need help with a doubt?
            </h2>

            <p>
              Connect with an available tutor and
              solve your academic questions.
            </p>

            <button
              type="button"
              onClick={onAskDoubt}
              className="student-ask-btn"
            >
              <span>💬</span>
              Ask a New Doubt
              <span>→</span>
            </button>

          </div>

          <div className="student-help-decoration">
            🎓
          </div>

        </section>

        {/* RECENT DOUBTS */}

        <section className="student-recent-card">

          <div className="student-recent-header">

            <div className="student-recent-title">

              <div className="student-recent-icon">
                ▤
              </div>

              <div>
                <h2>Recent Doubts</h2>

                <p>
                  Track your latest learning requests
                </p>
              </div>

            </div>

            <div className="student-recent-count">
              <strong>
                {doubts.length} Doubts
              </strong>

              <span>
                Total Submitted
              </span>
            </div>

          </div>

          {/* SMALL STATUS ROW */}

          <div className="student-dashboard-filters">

            <div className="student-filter active">
              All Doubts ({doubts.length})
            </div>

            <div className="student-filter pending">
              ◷ Pending ({pendingDoubts.length})
            </div>

            <div className="student-filter accepted">
              ✓ Accepted ({acceptedDoubts.length})
            </div>

            <div className="student-filter solved">
              ✓ Solved ({completedSessions})
            </div>

          </div>

          {loading ? (

            <div className="student-dashboard-empty">
              <h3>
                Loading your doubts...
              </h3>
            </div>

          ) : error ? (

            <div className="student-dashboard-empty">
              <div className="empty-icon">
                ⚠️
              </div>

              <h3>{error}</h3>

              <p>
                Please refresh and try again.
              </p>
            </div>

          ) : doubts.length === 0 ? (

            <div className="student-dashboard-empty">

              <div className="empty-icon">
                📚
              </div>

              <h3>
                No doubts submitted yet
              </h3>

              <p>
                Ask your first doubt to get started.
              </p>

              <button
                type="button"
                className="student-ask-btn"
                onClick={onAskDoubt}
              >
                💡 Ask Your First Doubt →
              </button>

            </div>

          ) : (

            <div className="student-dashboard-doubts">

              {doubts.slice(0, 5).map((doubt) => {

                const status =
                  doubt.status || "Pending";

                const currentStatus =
                  status.toLowerCase();

                return (
                  <article
                    className="student-dashboard-doubt"
                    key={doubt._id}
                  >

                    <div
                      className={`dashboard-subject-icon ${getIconClass(
                        doubt.subject
                      )}`}
                    >
                      √x
                    </div>

                    <div className="student-dashboard-doubt-info">

                      <h3>
                        {doubt.question ||
                          doubt.description ||
                          "No question available"}
                      </h3>

                      <div className="student-dashboard-meta">

                        <span>
                          ♧ {doubt.subject || "General"}
                        </span>

                        <span>
                          ▣ {formatDate(doubt)}
                        </span>

                      </div>

                    </div>

                    <div className="student-dashboard-doubt-actions">

                      <span
                        className={`dashboard-status dashboard-status-${currentStatus}`}
                      >
                        ✓ {status}
                      </span>

                      {currentStatus === "accepted" && (
                        <button
                          type="button"
                          className="dashboard-video-btn"
                          onClick={() =>
                            joinVideoCall(doubt)
                          }
                        >
                          🎥 Join Video Call
                        </button>
                      )}

                      {currentStatus === "pending" && (
                        <span className="dashboard-waiting">
                          Waiting for tutor
                        </span>
                      )}

                      {(currentStatus === "solved" ||
                        currentStatus === "completed") && (
                        <span className="dashboard-waiting">
                          ✓ Completed
                        </span>
                      )}

                      <button
                        type="button"
                        className="dashboard-more-btn"
                      >
                        ⋮
                      </button>

                    </div>

                  </article>
                );
              })}

              <button
                type="button"
                className="dashboard-view-all"
                onClick={onMyDoubts}
              >
                View All Doubts →
              </button>

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default StudentDashboard;