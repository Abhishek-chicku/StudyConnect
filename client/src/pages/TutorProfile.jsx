import Navbar from "../components/Navbar";

function TutorProfile({ user, onBack, onLogout }) {
  const tutorName = user?.name || "Tutor";
  const tutorEmail = user?.email || "Not available";

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
          <p className="profile-kicker">TUTOR ACCOUNT</p>
          <h1>My Profile</h1>
          <p>View your profile and teaching information.</p>
        </div>

        <section className="profile-card">
          <div className="profile-main">
            <div className="profile-avatar">
              {tutorName.charAt(0).toUpperCase()}
            </div>

            <div className="profile-intro">
              <h2>{tutorName}</h2>
              <p>{tutorEmail}</p>
              <span className="profile-role">🧑‍🏫 Tutor</span>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">Full Name</span>
              <strong>{tutorName}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Email Address</span>
              <strong>{tutorEmail}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Teaching Role</span>
              <strong>Subject Matter Tutor</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Subject Expertise</span>
              <strong>Mathematics, Physics & Chemistry</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Experience</span>
              <strong>Experienced Tutor</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Availability</span>
              <strong className="available-text">
                ● Available
              </strong>
            </div>
          </div>

          <div className="profile-footer">
            <button
              type="button"
              className="profile-back-btn"
              onClick={onBack}
            >
              ← Back to Dashboard
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default TutorProfile;