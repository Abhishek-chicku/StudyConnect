import { useState } from "react";
import { signupUser } from "../services/api";

function Signup({ onSignup, onBackToLogin }) {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subject, setSubject] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === "tutor" && !subject) {
      setError("Tutor subject is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await signupUser({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        ...(role === "tutor" && {
          subject,
        }),
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        onSignup({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          subject: data.user.subject || subject,
          tokens:
            data.user.tokens ??
            (data.user.role === "student" ? 100 : 0),
        });
      }
    } catch (err) {
      setError(
        err.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const changeRole = (newRole) => {
    setRole(newRole);
    setError("");

    if (newRole === "student") {
      setSubject("");
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
            🚀 START YOUR LEARNING JOURNEY
          </div>

          <h2>
            Learn More.
            <br />
            <span>Grow More.</span>
          </h2>

          <p>
            Join a community where students ask,
            tutors guide and everyone keeps growing.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature">
              <div className="auth-feature-icon">💡</div>
              <div>
                <strong>Never Stay Stuck</strong>
                <span>Ask questions without hesitation.</span>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon blue">🤝</div>
              <div>
                <strong>Learn From Others</strong>
                <span>Connect with helpful tutors.</span>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon green">🎓</div>
              <div>
                <strong>Build Your Future</strong>
                <span>Turn every doubt into knowledge.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-books">
          <div>Ask Better</div>
          <div>Learn Deeper</div>
          <div>Grow Faster</div>
          <span>✨</span>
        </div>

        <div className="auth-quote quote-one">
          “Every question
          <br />
          starts a journey.”
        </div>

        <div className="auth-quote quote-two">
          “Keep learning.
          <br />
          Keep growing.”
        </div>

        <div className="auth-quote quote-three">
          “Your future
          <br />
          starts here.”
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
        <form
          className="auth-modern-card signup-modern-card"
          onSubmit={handleSubmit}
        >

          <div className="auth-mobile-logo">
            <div className="auth-logo-icon">🎓</div>

            <div>
              <h2>StudyConnect</h2>
              <span>Learn. Connect. Grow.</span>
            </div>
          </div>

          <div className="auth-form-heading">
            <h2>Create Your Account ✨</h2>
            <p>
              Start your learning journey with StudyConnect.
            </p>
          </div>

          <div className="auth-role-switch">
            <button
              type="button"
              className={role === "student" ? "active" : ""}
              onClick={() => changeRole("student")}
              disabled={loading}
            >
              👨‍🎓 Student
            </button>

            <button
              type="button"
              className={role === "tutor" ? "active" : ""}
              onClick={() => changeRole("tutor")}
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
            <label>Full Name</label>

            <div className="auth-input-box">
              <span>👤</span>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

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

          {role === "tutor" && (
            <div className="auth-input-group">
              <label>Subject</label>

              <div className="auth-input-box">
                <span>📚</span>

                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="">
                    Select your subject
                  </option>

                  <option value="Mathematics">
                    Mathematics
                  </option>

                  <option value="Physics">
                    Physics
                  </option>

                  <option value="Chemistry">
                    Chemistry
                  </option>

                  <option value="Biology">
                    Biology
                  </option>

                  <option value="Computer Science">
                    Computer Science
                  </option>

                  <option value="English">
                    English
                  </option>
                </select>
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label>Password</label>

            <div className="auth-input-box">
              <span>🔒</span>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            className="auth-main-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account →"}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="auth-switch-text">
            Already have an account?{" "}

            <button
              type="button"
              onClick={onBackToLogin}
              disabled={loading}
            >
              Login
            </button>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Signup;
