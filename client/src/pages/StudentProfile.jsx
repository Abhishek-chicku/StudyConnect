import Navbar from "../components/Navbar";
import { useDoubts } from "../context/DoubtContext";

function StudentProfile({ user, onBack, onLogout }) {
  const { doubts = [] } = useDoubts();

  const studentName = user?.name?.trim() || "Student";
  const studentEmail = user?.email || "student@example.com";

  const studentTokens =
    user?.availableTokens ?? user?.tokens ?? 100;

  const questionsAsked = doubts.length;

  const sessionsCompleted = doubts.filter((doubt) => {
    const status = doubt.status?.toLowerCase();

    return (
      status === "solved" ||
      status === "completed"
    );
  }).length;

  const learningPoints = sessionsCompleted * 10;

  const avatarLetter = studentName.charAt(0).toUpperCase();

  return (
    <div className="profile-page">

      <Navbar
        user={user}
        onBack={onBack}
        onLogout={onLogout}
        showBack
      />

      <main className="profile-container">

        <div className="profile-heading">
          <p className="profile-kicker">
            MY ACCOUNT
          </p>

          <h1>Student Profile</h1>

          <p>
            View your account details and learning information.
          </p>
        </div>

        <section className="profile-card">

          <div className="profile-main">

            <div className="profile-avatar">
              {avatarLetter}
            </div>

            <div className="profile-intro">

              <h2>{studentName}</h2>

              <p>{studentEmail}</p>

              <span className="profile-role">
                🎓 Student Account
              </span>

            </div>

          </div>

          <div className="profile-details">

            <div className="detail-item">
              <span className="detail-label">
                Full Name
              </span>

              <strong>
                {studentName}
              </strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                Email Address
              </span>

              <strong>
                {studentEmail}
              </strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                Account Type
              </span>

              <strong>
                Student
              </strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                Available Tokens
              </span>

              <strong>
                🪙 {studentTokens}
              </strong>
            </div>

          </div>

          <div className="profile-stats">

            <div className="profile-stat-card">
              <span>
                Questions Asked
              </span>

              <strong>
                {questionsAsked}
              </strong>
            </div>

            <div className="profile-stat-card">
              <span>
                Sessions Completed
              </span>

              <strong>
                {sessionsCompleted}
              </strong>
            </div>

            <div className="profile-stat-card">
              <span>
                Learning Points
              </span>

              <strong>
                {learningPoints}
              </strong>
            </div>

          </div>

          <button
            type="button"
            className="profile-back-btn"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>

        </section>

      </main>

    </div>
  );
}

export default StudentProfile;