  // function Navbar({
  //   user,
  //   onBack,
  //   onProfile,
  //   onLogout,
  //   showBack = false,
  // }) {
  //   return (
  //     <nav className="modern-navbar">
  //       <div className="navbar-brand">
  //         <div className="brand-icon">🎓</div>

  //         <div>
  //           <h1>StudyConnect</h1>
  //           <span>Learn. Connect. Grow.</span>
  //         </div>
  //       </div>

  //       <div className="navbar-actions">
  //         {user && (
  //           <div className="navbar-user">
  //             <div className="user-avatar">
  //               {user.name?.charAt(0).toUpperCase() || "U"}
  //             </div>

  //             <span className="user-name">{user.name}</span>
  //           </div>
  //         )}

  //         {showBack && (
  //           <button
  //             type="button"
  //             className="navbar-back-btn"
  //             onClick={onBack}
  //           >
  //             ← Dashboard
  //           </button>
  //         )}

  //         {user && !showBack && onProfile && (
  //           <button
  //             type="button"
  //             className="navbar-profile-btn"
  //             onClick={onProfile}
  //           >
  //             Profile
  //           </button>
  //         )}

  //         {user && onLogout && (
  //           <button
  //             type="button"
  //             className="navbar-logout-btn"
  //             onClick={onLogout}
  //           >
  //             Logout
  //           </button>
  //         )}
  //       </div>
  //     </nav>
  //   );
  // }

  // export default Navbar;

  function Navbar({
  user,
  onBack,
  onProfile,
  onLogout,
  showBack = false,
}) {
  return (
    <nav className="modern-navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <div className="brand-icon">🎓</div>

        <div>
          <h1>StudyConnect</h1>
          <span>Learn. Connect. Grow.</span>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="navbar-actions">
        {/* User Information */}
        {user && (
          <div className="navbar-user">
            <div className="user-avatar">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <span className="user-name">
              {user.name}
            </span>
          </div>
        )}

        {/* Back to Dashboard Button */}
        {showBack && (
          <button
            type="button"
            className="navbar-back-btn"
            onClick={onBack}
          >
            ← Dashboard
          </button>
        )}

        {/* Profile Button - Dashboard par visible */}
        {user && !showBack && onProfile && (
          <button
            type="button"
            className="navbar-profile-btn"
            onClick={onProfile}
          >
            Profile
          </button>
        )}

        {/* Logout Button */}
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