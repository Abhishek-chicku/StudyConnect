import { useState } from "react";
import { loginUser } from "../services/api";

function Login({ onLogin, onSignupPage }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await loginUser({
        email: email.trim(),
        password,
      });

      const loggedInUser = data.user;

      if (loggedInUser.role !== role) {
        setError(
          `This account is registered as ${loggedInUser.role}.`
        );
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      onLogin({
        id: loggedInUser.id,
        name: loggedInUser.name,
        email: loggedInUser.email,
        role: loggedInUser.role,
        tokens:
          loggedInUser.tokens ??
          (loggedInUser.role === "student" ? 100 : 0),
      });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modern-page">
      <div className="auth-brand-side">

        <div className="auth-background-word">
          StudyConnect
        </div>

        <div className="auth-brand-logo">
          <div className="auth-logo-icon">🎓</div>

          <div>
            <h1>StudyConnect</h1>
            <span>Learn. Connect. Grow.</span>
          </div>
        </div>

        <div className="auth-brand-content">
          <div className="auth-small-badge">
            ✨ YOUR SMARTER WAY TO LEARN
          </div>

          <h2>
            A Brighter
            <br />
            You, <span>Every Day.</span>
          </h2>

          <p>
            Ask doubts, connect with the right tutors
            and learn through personalized sessions.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature">
              <div className="auth-feature-icon">💬</div>
              <div>
                <strong>Ask Your Doubts</strong>
                <span>Get help whenever you're stuck.</span>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon blue">👥</div>
              <div>
                <strong>Connect With Tutors</strong>
                <span>Learn from people who can help.</span>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon green">🎥</div>
              <div>
                <strong>Learn Together</strong>
                <span>Solve doubts in private sessions.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-books">
          <div>Better Questions</div>
          <div>Deeper Understanding</div>
          <div>Brighter Future</div>
          <span>🎓</span>
        </div>

        <div className="auth-quote quote-one">
          “Small Steps.
          <br />
          Big Progress.”
        </div>

        <div className="auth-quote quote-two">
          “Ideas today.
          <br />
          Success tomorrow.”
        </div>

        <div className="auth-quote quote-three">
          “Learning has
          <br />
          no limits.”
        </div>

        <div className="auth-stats">
          <div>
            <strong>100+</strong>
            <span>Students</span>
          </div>

          <div>
            <strong>50+</strong>
            <span>Tutors</span>
          </div>

          <div>
            <strong>500+</strong>
            <span>Doubts Solved</span>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <form className="auth-modern-card" onSubmit={handleSubmit}>

          <div className="auth-mobile-logo">
            <div className="auth-logo-icon">🎓</div>
            <div>
              <h2>StudyConnect</h2>
              <span>Learn. Connect. Grow.</span>
            </div>
          </div>

          <div className="auth-form-heading">
            <h2>Welcome Back 👋</h2>
            <p>Login to continue your learning journey.</p>
          </div>

          <div className="auth-role-switch">
            <button
              type="button"
              className={role === "student" ? "active" : ""}
              onClick={() => {
                setRole("student");
                setError("");
              }}
              disabled={loading}
            >
              👨‍🎓 Student
            </button>

            <button
              type="button"
              className={role === "tutor" ? "active" : ""}
              onClick={() => {
                setRole("tutor");
                setError("");
              }}
              disabled={loading}
            >
              👨‍🏫 Tutor
            </button>
          </div>

          {error && (
            <p className="auth-modern-error">
              {error}
            </p>
          )}

          <div className="auth-input-group">
            <label>Email Address</label>

            <div className="auth-input-box">
              <span>✉</span>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Password</label>

            <div className="auth-input-box">
              <span>🔒</span>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="auth-options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <button type="button">
              Forgot password?
            </button>
          </div>

          <button
            className="auth-main-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login →"}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="auth-switch-text">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSignupPage}
              disabled={loading}
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;