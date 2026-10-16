import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL =
  `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

function FindTutor({
  user,
  onBack,
  onProfile,
  onLogout,
  onViewTutor,
}) {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [availability, setAvailability] =
    useState("All");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/tutors`,
          {
            method: "GET",
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
            data.message || "Failed to load tutors"
          );
        }

        setTutors(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(
          "Fetch tutors error:",
          err
        );

        setError(
          err.message ||
            "Unable to load tutors"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const subjects = [
    ...new Set(
      tutors
        .map((tutor) => tutor.subject)
        .filter(Boolean)
    ),
  ];

  const filteredTutors = tutors.filter(
    (tutor) => {
      const searchText =
        search.trim().toLowerCase();

      const tutorName =
        tutor.name?.toLowerCase() || "";

      const tutorSubject =
        tutor.subject?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        tutorName.includes(searchText) ||
        tutorSubject.includes(searchText);

      const matchesSubject =
        subject === "All" ||
        tutor.subject === subject;

      const matchesAvailability =
        availability === "All" ||
        (availability === "Available" &&
          tutor.isAvailable !== false) ||
        (availability === "Unavailable" &&
          tutor.isAvailable === false);

      return (
        matchesSearch &&
        matchesSubject &&
        matchesAvailability
      );
    }
  );

  const clearFilters = () => {
    setSearch("");
    setSubject("All");
    setAvailability("All");
  };

  return (
    <div className="dashboard-page">

      <Navbar
        user={user}
        onBack={onBack}
        onProfile={onProfile}
        onLogout={onLogout}
        showBack
      />

      <main className="find-tutor-main">

        <div className="find-tutor-heading">

          <p className="find-tutor-eyebrow">
            FIND YOUR TUTOR
          </p>

          <h1>
            Learn from the right tutor.
          </h1>

          <p>
            Search tutors by name or subject
            and find someone who can help
            you with your questions.
          </p>

        </div>

        <section className="find-tutor-search-card">

          <div className="find-tutor-search-box">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search by tutor name or subject..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="find-tutor-filter">

            <label>
              Subject
            </label>

            <select
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
            >
              <option value="All">
                All Subjects
              </option>

              {subjects.map((item) => (
                <option
                  value={item}
                  key={item}
                >
                  {item}
                </option>
              ))}
            </select>

          </div>

          <div className="find-tutor-filter">

            <label>
              Availability
            </label>

            <select
              value={availability}
              onChange={(e) =>
                setAvailability(e.target.value)
              }
            >
              <option value="All">
                All Tutors
              </option>

              <option value="Available">
                Available
              </option>

              <option value="Unavailable">
                Unavailable
              </option>
            </select>

          </div>

          <button
            type="button"
            className="find-tutor-clear-btn"
            onClick={clearFilters}
          >
            Clear
          </button>

        </section>

        <div className="find-tutor-result-row">

          <div>
            <h2>
              Available Tutors
            </h2>

            <p>
              {filteredTutors.length}{" "}
              {filteredTutors.length === 1
                ? "tutor"
                : "tutors"}{" "}
              found
            </p>
          </div>

        </div>

        {loading ? (

          <div className="find-tutor-empty">
            <div className="find-tutor-empty-icon">
              🔎
            </div>

            <h3>
              Finding tutors...
            </h3>

            <p>
              Please wait a moment.
            </p>
          </div>

        ) : error ? (

          <div className="find-tutor-empty">
            <div className="find-tutor-empty-icon">
              ⚠️
            </div>

            <h3>
              Unable to load tutors
            </h3>

            <p>
              {error}
            </p>
          </div>

        ) : filteredTutors.length === 0 ? (

          <div className="find-tutor-empty">

            <div className="find-tutor-empty-icon">
              📚
            </div>

            <h3>
              No tutors found
            </h3>

            <p>
              Try changing your search or
              filters.
            </p>

            <button
              type="button"
              className="find-tutor-primary-btn"
              onClick={clearFilters}
            >
              Reset Filters
            </button>

          </div>

        ) : (

          <div className="find-tutor-grid">

            {filteredTutors.map((tutor) => {

              const tutorName =
                tutor.name || "Tutor";

              const initial =
                tutorName
                  .charAt(0)
                  .toUpperCase();

              const isAvailable =
                tutor.isAvailable !== false;

              return (
                <article
                  className="find-tutor-card"
                  key={tutor._id}
                >

                  <div className="find-tutor-card-top">

                    <div className="find-tutor-avatar">
                      {initial}
                    </div>

                    <div className="find-tutor-name-box">

                      <h3>
                        {tutorName}
                      </h3>

                      <p>
                        {tutor.email ||
                          "Email not available"}
                      </p>

                    </div>

                  </div>

                  <div className="find-tutor-subject">
                    <span>📚</span>

                    <strong>
                      {tutor.subject ||
                        "Subject not added"}
                    </strong>
                  </div>

                  <div className="find-tutor-bottom">

                    <span
                      className={
                        isAvailable
                          ? "find-tutor-available"
                          : "find-tutor-unavailable"
                      }
                    >
                      <span className="find-tutor-dot">
                        ●
                      </span>

                      {isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </span>

                    <button
                      type="button"
                      className="find-tutor-view-btn"
                      onClick={() =>
                        onViewTutor(tutor._id)
                      }
                    >
                      View Profile →
                    </button>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </main>
    </div>
  );
}

export default FindTutor;