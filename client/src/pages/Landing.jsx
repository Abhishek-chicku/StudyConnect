import { useEffect, useState } from "react";

function Landing({ onLogin, onSignup }) {
  const quotes = [
    "Every doubt you solve is one step closer to your goal.",
    "The more you learn, the more you grow.",
    "Don't stop learning just because something feels difficult.",
    "Small progress every day leads to big results.",
    "Your questions are the beginning of your learning.",
    "Learn today. Improve tomorrow. Grow every day.",
    "Every expert was once a beginner who kept learning."
  ];

  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomQuote =
      quotes[Math.floor(Math.random() * quotes.length)];

    setQuote(randomQuote);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="landing-home">

      {/* NAVBAR */}

      <nav className="landing-navbar">

        <div
          className="landing-logo"
          onClick={() => window.scrollTo({
            top: 0,
            behavior: "smooth",
          })}
        >
          <div className="landing-logo-icon">
            🎓
          </div>

          <div>
            <h2>StudyConnect</h2>
            <span>Learn. Connect. Grow.</span>
          </div>
        </div>

        <div className="landing-nav-links">

          <button
            onClick={() => scrollToSection("home")}
          >
            Home
          </button>

          <button
            onClick={() => scrollToSection("how-it-works")}
          >
            How It Works
          </button>

          <button
            onClick={() => scrollToSection("features")}
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection("tutors")}
          >
            For Tutors
          </button>

        </div>

        <div className="landing-nav-actions">

          <button
            className="landing-login-link"
            onClick={onLogin}
          >
            Login
          </button>

          <button
            className="landing-signup-link"
            onClick={onSignup}
          >
            Sign Up →
          </button>

        </div>

      </nav>


      {/* HERO */}

      <section
        className="landing-hero"
        id="home"
      >

        <div className="hero-left">

          <div className="hero-badge">
            ✨ Your smarter way to learn
          </div>

          <h1>
            Learn without
            <br />
            <span>getting stuck.</span>
          </h1>

          <p>
            Ask your doubts, connect with the right
            tutor and learn through personalized
            one-to-one sessions.
          </p>

          <div className="hero-buttons">

            <button
              className="hero-primary-btn"
              onClick={onSignup}
            >
              Get Started
              <span>→</span>
            </button>

            <button
              className="hero-secondary-btn"
              onClick={() =>
                scrollToSection("how-it-works")
              }
            >
              How It Works
              <span>↓</span>
            </button>

          </div>

          <div className="hero-trust">

            <div className="trust-avatars">
              <span>👨‍🎓</span>
              <span>👩‍🎓</span>
              <span>👨‍🏫</span>
              <span>👩‍🏫</span>
            </div>

            <div>
              <strong>Learn together</strong>
              <p>
                Students & tutors connected
              </p>
            </div>

          </div>

        </div>


        {/* HERO RIGHT */}

        <div className="hero-right">

          <div className="hero-glow"></div>

          <div className="motivation-card">

            <div className="motivation-top">
              <span>✨</span>
              <small>DAILY MOTIVATION</small>
            </div>

            <div className="quote-mark">
              “
            </div>

            <h3>
              {quote}
            </h3>

            <div className="quote-line"></div>

            <p>
              — StudyConnect
            </p>

          </div>


          <div className="floating-card student-float">

            <div className="float-icon">
              💬
            </div>

            <div>
              <strong>Doubt Submitted</strong>
              <span>Mathematics</span>
            </div>

            <b>✓</b>

          </div>


          <div className="floating-card tutor-float">

            <div className="float-icon tutor">
              👨‍🏫
            </div>

            <div>
              <strong>Tutor Accepted</strong>
              <span>Session ready</span>
            </div>

            <b>✓</b>

          </div>


          <div className="floating-card video-float">

            <div className="float-icon video">
              🎥
            </div>

            <div>
              <strong>Video Session</strong>
              <span>Learn together</span>
            </div>

            <b>→</b>

          </div>

        </div>

      </section>


      {/* STATS */}

      <section className="landing-stats-section">

        <div className="landing-stat">
          <strong>100+</strong>
          <span>Students</span>
        </div>

        <div className="stat-divider"></div>

        <div className="landing-stat">
          <strong>50+</strong>
          <span>Tutors</span>
        </div>

        <div className="stat-divider"></div>

        <div className="landing-stat">
          <strong>500+</strong>
          <span>Doubts Solved</span>
        </div>

        <div className="stat-divider"></div>

        <div className="landing-stat">
          <strong>24/7</strong>
          <span>Learning Support</span>
        </div>

      </section>


      {/* HOW IT WORKS */}

      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="section-heading">

          <span>
            SIMPLE & EFFECTIVE
          </span>

          <h2>
            How StudyConnect works
          </h2>

          <p>
            From a simple question to a solved doubt,
            everything happens in a few easy steps.
          </p>

        </div>


        <div className="workflow">

          <div className="workflow-card">

            <div className="workflow-number">
              01
            </div>

            <div className="workflow-icon blue">
              💬
            </div>

            <h3>
              Ask a Doubt
            </h3>

            <p>
              Submit your academic question
              with the subject and priority.
            </p>

          </div>


          <div className="workflow-arrow">
            →
          </div>


          <div className="workflow-card">

            <div className="workflow-number">
              02
            </div>

            <div className="workflow-icon purple">
              👨‍🏫
            </div>

            <h3>
              Tutor Accepts
            </h3>

            <p>
              An available tutor reviews
              and accepts your request.
            </p>

          </div>


          <div className="workflow-arrow">
            →
          </div>


          <div className="workflow-card">

            <div className="workflow-number">
              03
            </div>

            <div className="workflow-icon green">
              🎥
            </div>

            <h3>
              Join Video Call
            </h3>

            <p>
              Student and tutor join the
              same private video session.
            </p>

          </div>


          <div className="workflow-arrow">
            →
          </div>


          <div className="workflow-card">

            <div className="workflow-number">
              04
            </div>

            <div className="workflow-icon orange">
              ✓
            </div>

            <h3>
              Solve & Learn
            </h3>

            <p>
              Discuss the problem, understand
              it and complete your session.
            </p>

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <span>
            EVERYTHING YOU NEED
          </span>

          <h2>
            Learning made simple
          </h2>

          <p>
            StudyConnect brings students and tutors
            together in one simple platform.
          </p>

        </div>


        <div className="features-grid">

          <div className="feature-card">

            <div className="big-feature-icon blue">
              💬
            </div>

            <h3>
              Ask Academic Doubts
            </h3>

            <p>
              Stuck on a concept? Submit your
              question and get personalized help.
            </p>

            <span>
              Learn without hesitation →
            </span>

          </div>


          <div className="feature-card">

            <div className="big-feature-icon purple">
              👨‍🏫
            </div>

            <h3>
              Connect With Tutors
            </h3>

            <p>
              Find tutors who are ready to
              explain concepts and guide you.
            </p>

            <span>
              Learn from others →
            </span>

          </div>


          <div className="feature-card">

            <div className="big-feature-icon green">
              🎥
            </div>

            <h3>
              One-to-One Sessions
            </h3>

            <p>
              Join a private video session and
              solve your doubt together.
            </p>

            <span>
              Learn together →
            </span>

          </div>

        </div>

      </section>


      {/* TUTOR SECTION */}

      <section
        className="tutor-section"
        id="tutors"
      >

        <div className="tutor-content">

          <span className="section-small-title">
            FOR TUTORS
          </span>

          <h2>
            Share your knowledge.
            <br />
            <span>Help someone grow.</span>
          </h2>

          <p>
            Become a StudyConnect tutor and help
            students understand the concepts they
            are struggling with.
          </p>

          <button
            onClick={onSignup}
            className="tutor-cta"
          >
            Become a Tutor →
          </button>

        </div>


        <div className="tutor-visual">

          <div className="tutor-circle">
            👨‍🏫
          </div>

          <div className="tutor-mini-card card-one">
            💡 Help students
          </div>

          <div className="tutor-mini-card card-two">
            ⭐ Share knowledge
          </div>

          <div className="tutor-mini-card card-three">
            🎓 Make an impact
          </div>

        </div>

      </section>


      {/* FINAL CTA */}

      <section className="final-cta">

        <div>

          <span>
            READY TO START?
          </span>

          <h2>
            Don't let a doubt stop you.
          </h2>

          <p>
            Ask your question. Find your tutor.
            Start learning.
          </p>

          <button
            onClick={onSignup}
          >
            Start Learning →
          </button>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="landing-footer">

        <div className="footer-brand">

          <div className="landing-logo-icon">
            🎓
          </div>

          <div>
            <strong>
              StudyConnect
            </strong>

            <span>
              Learn. Connect. Grow.
            </span>
          </div>

        </div>

        <p>
          © 2026 StudyConnect. Learn together,
          grow together.
        </p>

      </footer>

    </div>
  );
}

export default Landing;