

function Navbar({
  user,
  onBack,
  onProfile,
  onLogout,
  onFindTutors,
  showBack = false,
}) {
  return (
    <nav className="modern-navbar">

      <div className="navbar-brand">
        <div className="brand-icon">
          🎓
        </div>

        <div>
          <h1>StudyConnect</h1>
          <span>
            Learn. Connect. Grow.
          </span>
        </div>
      </div>

      <div className="navbar-actions">

        {user && (
          <div className="navbar-user">

            <div className="user-avatar">
              {user.name
                ?.charAt(0)
                .toUpperCase() || "U"}
            </div>

            <span className="user-name">
              {user.name}
            </span>

          </div>
        )}

        {user?.role === "student" &&
          !showBack &&
          onFindTutors && (
            <button
              type="button"
              className="navbar-find-tutor-btn"
              onClick={onFindTutors}
            >
              Find Tutors
            </button>
          )}

        {showBack && (
          <button
            type="button"
            className="navbar-back-btn"
            onClick={onBack}
          >
            Dashboard
          </button>
        )}

        {user &&
          !showBack &&
          onProfile && (
            <button
              type="button"
              className="navbar-profile-btn"
              onClick={onProfile}
            >
              Profile
            </button>
          )}

        {user && onLogout && (
          <button
            type="button"
            className="navbar-logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}

export default Navbar;