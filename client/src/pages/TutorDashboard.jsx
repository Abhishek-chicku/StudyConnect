import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function TutorDashboard({ user, onProfile, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [notification, setNotification] = useState(null);

  const tutorId = user?._id || user?.id;
  const token = localStorage.getItem("token");

  const fetchDoubts = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await fetch(
        `${API_URL}/doubts`,
        {
          headers: {
            Authorization: token
              ? `Bearer ${token}`
              : "",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch doubts"
        );
      }

      const doubts = Array.isArray(data)
        ? data
        : [];

      setRequests(doubts);
      setError("");

      const newDoubt = doubts.find((doubt) => {
        if (
          doubt.status?.toLowerCase() !==
          "pending"
        ) {
          return false;
        }

        const key =
          `tutor-doubt-${doubt._id}`;

        return !localStorage.getItem(key);
      });

      if (newDoubt) {
        setNotification({
          id: newDoubt._id,
          subject: newDoubt.subject,
          question: newDoubt.question,
        });

        localStorage.setItem(
          `tutor-doubt-${newDoubt._id}`,
          "true"
        );
      }
    } catch (err) {
      console.error(
        "Fetch doubts error:",
        err
      );

      if (showLoading) {
        setError(
          err.message ||
            "Unable to load requests"
        );
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!tutorId) {
      setLoading(false);
      setError(
        "Tutor information not found."
      );
      return;
    }

    fetchDoubts(true);

    const interval = setInterval(() => {
      fetchDoubts();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [tutorId]);

  const pendingRequests = requests.filter(
    (request) =>
      request.status?.toLowerCase() ===
      "pending"
  );

  const completedSessions = requests.filter(
    (request) => {
      const status =
        request.status?.toLowerCase();

      return (
        status === "solved" ||
        status === "completed"
      );
    }
  ).length;

  const acceptedRequests = requests.filter(
    (request) =>
      request.status?.toLowerCase() ===
      "accepted"
  );

  const getStatusClass = (status = "") => {
    return `status-badge status-${status
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  };

  const acceptRequest = async (doubtId) => {
    if (!tutorId) {
      alert(
        "Tutor ID not found. Please login again."
      );
      return;
    }

    try {
      setActionLoading(doubtId);

      const response = await fetch(
        `${API_URL}/doubts/${doubtId}/accept`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
              ? `Bearer ${token}`
              : "",
          },
          body: JSON.stringify({
            tutorId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to accept request"
        );
      }

      const roomId =
        data.doubt?.roomId ||
        data.session?.roomId ||
        `studyconnect-${doubtId}`;

      setRequests((oldRequests) =>
        oldRequests.map((request) => {
          if (request._id === doubtId) {
            return {
              ...request,
              status: "Accepted",
              roomId: roomId,
              tutorId: tutorId,
            };
          }

          return request;
        })
      );

      setNotification(null);

      alert(
        "Request accepted successfully!"
      );
    } catch (err) {
      console.error(
        "Accept request error:",
        err
      );

      alert(
        err.message ||
          "Server error while accepting request"
      );
    } finally {
      setActionLoading("");
    }
  };

  const rejectRequest = async (doubtId) => {
    if (!tutorId) {
      alert(
        "Tutor ID not found. Please login again."
      );
      return;
    }

    const confirmReject = window.confirm(
      "Are you sure you want to reject this request?"
    );

    if (!confirmReject) {
      return;
    }

    try {
      setActionLoading(doubtId);

      const response = await fetch(
        `${API_URL}/doubts/${doubtId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
              ? `Bearer ${token}`
              : "",
          },
          body: JSON.stringify({
            tutorId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to reject request"
        );
      }

      setRequests((oldRequests) =>
        oldRequests.map((request) => {
          if (request._id === doubtId) {
            return {
              ...request,
              status: "Rejected",
            };
          }

          return request;
        })
      );

      setNotification(null);

      alert(
        "Request rejected successfully!"
      );
    } catch (err) {
      console.error(
        "Reject request error:",
        err
      );

      alert(
        err.message ||
          "Server error while rejecting request"
      );
    } finally {
      setActionLoading("");
    }
  };

  const joinVideoCall = (request) => {
    const roomId =
      request.roomId ||
      `studyconnect-${request._id}`;

    const meetingUrl =
      `https://meet.jit.si/${encodeURIComponent(
        roomId
      )}`;

    window.open(
      meetingUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="tutor-page">

      <Navbar
        user={user}
        onProfile={onProfile}
        onLogout={onLogout}
      />

      {notification && (
        <div className="student-notification">

          <div className="notification-icon">
            🔔
          </div>

          <div className="notification-content">

            <h3>
              New Student Doubt!
            </h3>

            <p>
              A student has submitted a{" "}
              <strong>
                {notification.subject}
              </strong>{" "}
              doubt.
            </p>

            <button
              type="button"
              className="notification-join-btn"
              onClick={() => {
                setNotification(null);

                document
                  .getElementById(
                    "incoming-requests"
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
            >
              View Request →
            </button>

          </div>

          <button
            type="button"
            className="notification-close"
            onClick={closeNotification}
            aria-label="Close notification"
          >
            ✕
          </button>

        </div>
      )}

      <main className="dashboard-main">

        <div className="dashboard-heading">

          <p>
            Welcome back,{" "}
            {user?.name || "Tutor"} 👋
          </p>

          <h2>
            Help students learn something new.
          </h2>

        </div>

        <div className="stats-grid">

          <div className="stat-card tutor-stat-card">

            <p>Availability</p>

            <h3>Available</h3>

            <div className="availability-badge">
              <span className="availability-dot"></span>
              Ready to teach
            </div>

          </div>

          <div className="stat-card tutor-stat-card">

            <p>Pending Requests</p>

            <h3>
              {pendingRequests.length}
            </h3>

            <span>
              Student requests waiting
            </span>

          </div>

          <div className="stat-card tutor-stat-card">

            <p>Completed Sessions</p>

            <h3>
              {completedSessions}
            </h3>

            <span>
              Your teaching history
            </span>

          </div>

        </div>

        <div className="hero-card tutor-hero">

          <div className="hero-icon">
            🧑‍🏫
          </div>

          <h2>
            Ready to help a student?
          </h2>

          <p>
            Accept student doubts, start private
            video sessions, and share your knowledge.
          </p>

          <button
            type="button"
            className="request-btn"
            onClick={() =>
              document
                .getElementById(
                  "incoming-requests"
                )
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
            }
          >
            View Student Requests →
          </button>

        </div>

        <section
          className="recent-card"
          id="incoming-requests"
        >

          <div className="recent-card-heading">

            <div>

              <h2>
                Incoming Requests
              </h2>

              <p>
                Review student doubts and start sessions.
              </p>

            </div>

            <span className="recent-badge">
              {requests.length}{" "}
              {requests.length === 1
                ? "Request"
                : "Requests"}
            </span>

          </div>

          {loading ? (

            <div className="empty-state">

              <h3>
                Loading requests...
              </h3>

              <p>
                Please wait a moment.
              </p>

            </div>

          ) : error ? (

            <div className="empty-state error-state">

              <h3>
                Unable to load requests
              </h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                className="request-btn"
                onClick={() =>
                  fetchDoubts(true)
                }
              >
                Try Again
              </button>

            </div>

          ) : requests.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                🧑‍🏫
              </div>

              <h3>
                No incoming requests yet
              </h3>

              <p>
                New student doubts will appear here.
              </p>

            </div>

          ) : (

            <div className="tutor-request-list">

              {requests.map((request) => {

                const status =
                  request.status || "Pending";

                const currentStatus =
                  status.toLowerCase();

                const isActionLoading =
                  actionLoading === request._id;

                return (
                  <article
                    className="tutor-request-card"
                    key={request._id}
                  >

                    <div className="request-top">

                      <div>

                        <h3>
                          {request.subject ||
                            "General Doubt"}
                        </h3>

                        <p className="request-student">
                          Requested by{" "}
                          {request.studentName ||
                            request.studentId?.name ||
                            "Student"}
                        </p>

                      </div>

                      <span
                        className={getStatusClass(
                          status
                        )}
                      >
                        {status}
                      </span>

                    </div>

                    <p className="request-description">

                      <strong>
                        Question:
                      </strong>{" "}

                      {request.question ||
                        request.description ||
                        "No question provided"}

                    </p>

                    {request.description &&
                      request.question &&
                      request.description !==
                        request.question && (
                        <p className="request-description">
                          {request.description}
                        </p>
                      )}

                    <div className="request-actions">

                      {currentStatus ===
                        "pending" && (
                        <>
                          <button
                            type="button"
                            className="accept-btn"
                            disabled={
                              isActionLoading
                            }
                            onClick={() =>
                              acceptRequest(
                                request._id
                              )
                            }
                          >
                            {isActionLoading
                              ? "Processing..."
                              : "✓ Accept"}
                          </button>

                          <button
                            type="button"
                            className="reject-btn"
                            disabled={
                              isActionLoading
                            }
                            onClick={() =>
                              rejectRequest(
                                request._id
                              )
                            }
                          >
                            ✕ Reject
                          </button>
                        </>
                      )}

                      {currentStatus ===
                        "accepted" && (
                        <button
                          type="button"
                          className="video-call-btn"
                          onClick={() =>
                            joinVideoCall(
                              request
                            )
                          }
                        >
                          🎥 Join Video Call
                        </button>
                      )}

                      {currentStatus ===
                        "solved" && (
                        <span className="solved-label">
                          ✓ Session Completed
                        </span>
                      )}

                      {currentStatus ===
                        "completed" && (
                        <span className="solved-label">
                          ✓ Session Completed
                        </span>
                      )}

                      {currentStatus ===
                        "rejected" && (
                        <span className="solved-label">
                          Request Rejected
                        </span>
                      )}

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default TutorDashboard;