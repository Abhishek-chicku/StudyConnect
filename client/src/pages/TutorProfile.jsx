import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function TutorProfile({
  user,
  tutorId,
  onBack,
  onLogout,
}) {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [qualification, setQualification] =
    useState("");

  const [experience, setExperience] =
    useState("");

  const [subjects, setSubjects] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [isAvailable, setIsAvailable] =
    useState(true);

  const [availabilitySlots, setAvailabilitySlots] =
    useState([]);

  const [selectedDay, setSelectedDay] =
    useState("Monday");

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const isViewingTutor =
    Boolean(tutorId);

  /* =========================
     GET PROFILE
  ========================= */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        const profileUrl = tutorId
          ? `${API_URL}/api/tutors/${tutorId}`
          : `${API_URL}/api/tutors/profile`;

        const response = await fetch(
          profileUrl,
          {
            headers: {
              Authorization: token
                ? `Bearer ${token}`
                : "",
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load profile"
          );
        }

        setTutor(data);
      } catch (err) {
        console.error(
          "Profile error:",
          err
        );

        setError(
          err.message ||
            "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [tutorId]);

  /* =========================
     LOAD FORM DATA
  ========================= */

  useEffect(() => {
    const profile =
      tutor || user;

    if (!profile) {
      return;
    }

    setQualification(
      profile.qualification || ""
    );

    setExperience(
      profile.experience !== undefined
        ? String(profile.experience)
        : ""
    );

    setSubjects(
      profile.subjects?.length
        ? profile.subjects.join(", ")
        : profile.subject || ""
    );

    setBio(
      profile.bio || ""
    );

    setIsAvailable(
      profile.isAvailable !== false
    );

    setAvailabilitySlots(
      Array.isArray(
        profile.availabilitySlots
      )
        ? profile.availabilitySlots
        : []
    );
  }, [tutor, user]);

  const profileData =
    tutor || user;

  const tutorName =
    profileData?.name || "Tutor";

  const tutorEmail =
    profileData?.email ||
    "Not available";

  const tutorSubject =
    profileData?.subject ||
    "Subject not added";

  const tutorSubjects =
    profileData?.subjects?.length
      ? profileData.subjects
      : tutorSubject !==
          "Subject not added"
      ? [tutorSubject]
      : [];

  const available =
    profileData?.isAvailable !== false;

  const completedSessions =
    profileData?.completedSessions ??
    0;

  const isVerified =
    profileData?.isVerified === true;

  /* =========================
     ADD SLOT
  ========================= */

  const addSlot = () => {
    if (!startTime || !endTime) {
      setMessage(
        "Please select start and end time."
      );
      return;
    }

    if (startTime >= endTime) {
      setMessage(
        "Start time must be before end time."
      );
      return;
    }

    const alreadyExists =
      availabilitySlots.some(
        (slot) =>
          slot.day === selectedDay &&
          slot.startTime === startTime &&
          slot.endTime === endTime
      );

    if (alreadyExists) {
      setMessage(
        "This time slot is already added."
      );
      return;
    }

    const newSlot = {
      day: selectedDay,
      startTime: startTime,
      endTime: endTime,
    };

    setAvailabilitySlots([
      ...availabilitySlots,
      newSlot,
    ]);

    setStartTime("");
    setEndTime("");
    setMessage("");
  };

  /* =========================
     REMOVE SLOT
  ========================= */

  const removeSlot = (index) => {
    const updatedSlots =
      availabilitySlots.filter(
        (_, slotIndex) =>
          slotIndex !== index
      );

    setAvailabilitySlots(
      updatedSlots
    );
  };

  /* =========================
     SAVE PROFILE
  ========================= */

  const saveProfile = async () => {
    if (!qualification.trim()) {
      setMessage(
        "Please enter your qualification."
      );
      return;
    }

    if (!experience.trim()) {
      setMessage(
        "Please enter your experience."
      );
      return;
    }

    if (!subjects.trim()) {
      setMessage(
        "Please enter at least one subject."
      );
      return;
    }

    if (
      isAvailable &&
      availabilitySlots.length === 0
    ) {
      setMessage(
        "Add at least one available time slot."
      );
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const token =
        localStorage.getItem("token");

      const subjectList =
        subjects
          .split(",")
          .map((item) =>
            item.trim()
          )
          .filter((item) => item);

      const response =
        await fetch(
          `${API_URL}/api/tutors/profile`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Authorization: token
                ? `Bearer ${token}`
                : "",
            },

            body: JSON.stringify({
              qualification:
                qualification.trim(),

              experience:
                experience.trim(),

              subjects:
                subjectList,

              bio:
                bio.trim(),

              isAvailable:
                isAvailable,

              availabilitySlots:
                availabilitySlots,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update profile"
        );
      }

      setTutor(data.tutor);

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Update profile error:",
        err
      );

      setMessage(
        err.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tutor-page">

      <Navbar
        user={user}
        onBack={onBack}
        onLogout={onLogout}
        showBack
      />

      <main className="profile-container">

        <div className="profile-heading">

          <p className="profile-kicker">
            {isViewingTutor
              ? "TUTOR PROFILE"
              : "MY ACCOUNT"}
          </p>

          <h1>
            {isViewingTutor
              ? "Tutor Profile"
              : "My Profile"}
          </h1>

          <p>
            {isViewingTutor
              ? "View tutor information, teaching details and available time."
              : "Manage your teaching profile and availability."}
          </p>

        </div>

        {loading ? (

          <section className="profile-card">

            <div className="profile-loading">
              Loading profile...
            </div>

          </section>

        ) : error ? (

          <section className="profile-card">

            <div className="profile-loading">

              <h3>
                Unable to load profile
              </h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                className="profile-back-btn"
                onClick={onBack}
              >
                ← Back
              </button>

            </div>

          </section>

        ) : (

          <>

            {/* MAIN PROFILE */}

            <section className="profile-card">

              <div className="profile-main">

                <div className="profile-avatar">
                  {tutorName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="profile-intro">

                  <h2>
                    {tutorName}
                  </h2>

                  <p>
                    {tutorEmail}
                  </p>

                  <span className="profile-role">
                    🧑‍🏫 Tutor
                  </span>

                  {isVerified && (
                    <span className="profile-role">
                      ✓ Verified Tutor
                    </span>
                  )}

                </div>

              </div>

              <div className="profile-details">

                <div className="detail-item">

                  <span className="detail-label">
                    Full Name
                  </span>

                  <strong>
                    {tutorName}
                  </strong>

                </div>

                <div className="detail-item">

                  <span className="detail-label">
                    Email Address
                  </span>

                  <strong>
                    {tutorEmail}
                  </strong>

                </div>

                <div className="detail-item">

                  <span className="detail-label">
                    Qualification
                  </span>

                  <strong>
                    {profileData?.qualification ||
                      "Not added"}
                  </strong>

                </div>

                <div className="detail-item">

                  <span className="detail-label">
                    Experience
                  </span>

                  <strong>
                    {profileData?.experience ||
                      "Not added"}
                  </strong>

                </div>

                <div className="detail-item">

                  <span className="detail-label">
                    Subjects Taught
                  </span>

                  <strong>
                    {tutorSubjects.length
                      ? tutorSubjects.join(", ")
                      : "Not added"}
                  </strong>

                </div>

                <div className="detail-item">

                  <span className="detail-label">
                    Completed Sessions
                  </span>

                  <strong>
                    {completedSessions}
                  </strong>

                </div>

                <div className="detail-item">

                  <span className="detail-label">
                    Availability
                  </span>

                  <strong
                    className={
                      available
                        ? "available-text"
                        : ""
                    }
                  >
                    {available
                      ? "● Available"
                      : "● Unavailable"}
                  </strong>

                </div>

                <div className="detail-item">

                  <span className="detail-label">
                    Verification
                  </span>

                  <strong>
                    {isVerified
                      ? "✓ Verified"
                      : "Not Verified"}
                  </strong>

                </div>

                <div className="detail-item">

                  <span className="detail-label">
                    Bio
                  </span>

                  <strong>
                    {profileData?.bio ||
                      "No bio added"}
                  </strong>

                </div>

              </div>

              {/* AVAILABLE SLOTS */}

              <div className="availability-section">

                <div className="availability-heading">

                  <div>

                    <h3>
                      Available Time Slots
                    </h3>

                    <p>
                      {available
                        ? "Students can use these timings to request a session."
                        : "This tutor is currently unavailable."}
                    </p>

                  </div>

                </div>

                {available &&
                availabilitySlots.length > 0 ? (

                  <div className="availability-slot-list">

                    {availabilitySlots.map(
                      (slot, index) => (

                        <div
                          className="availability-slot"
                          key={`${slot.day}-${slot.startTime}-${slot.endTime}-${index}`}
                        >

                          <div>
                            <strong>
                              {slot.day}
                            </strong>

                            <span>
                              {slot.startTime}
                              {" - "}
                              {slot.endTime}
                            </span>
                          </div>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <div className="no-slots">

                    <span>
                      🕒
                    </span>

                    <p>
                      No time slots available.
                    </p>

                  </div>

                )}

              </div>

              <div className="profile-footer">

                <button
                  type="button"
                  className="profile-back-btn"
                  onClick={onBack}
                >
                  ← Back
                </button>

              </div>

            </section>


            {/* EDIT PROFILE */}

            {!isViewingTutor && (

              <section className="profile-card profile-edit-card">

                <div className="profile-heading">

                  <h2>
                    Teaching Information
                  </h2>

                  <p>
                    Update the information students see on your profile.
                  </p>

                </div>


                <div className="profile-details">

                  <div className="detail-item">

                    <span className="detail-label">
                      Qualification
                    </span>

                    <input
                      type="text"
                      value={
                        qualification
                      }
                      onChange={(e) =>
                        setQualification(
                          e.target.value
                        )
                      }
                      placeholder="Example: B.Tech CSE"
                    />

                  </div>


                  <div className="detail-item">

                    <span className="detail-label">
                      Experience
                    </span>

                    <input
                      type="text"
                      value={
                        experience
                      }
                      onChange={(e) =>
                        setExperience(
                          e.target.value
                        )
                      }
                      placeholder="Example: 3 years"
                    />

                  </div>


                  <div className="detail-item">

                    <span className="detail-label">
                      Subjects
                    </span>

                    <input
                      type="text"
                      value={
                        subjects
                      }
                      onChange={(e) =>
                        setSubjects(
                          e.target.value
                        )
                      }
                      placeholder="Example: Mathematics, Physics"
                    />

                  </div>


                  <div className="detail-item">

                    <span className="detail-label">
                      Bio
                    </span>

                    <textarea
                      value={bio}
                      onChange={(e) =>
                        setBio(
                          e.target.value
                        )
                      }
                      placeholder="Write a short introduction about yourself"
                      rows="4"
                    />

                  </div>


                  <div className="detail-item">

                    <span className="detail-label">
                      Availability
                    </span>

                    <label>

                      <input
                        type="checkbox"
                        checked={
                          isAvailable
                        }
                        onChange={(e) =>
                          setIsAvailable(
                            e.target.checked
                          )
                        }
                      />

                      {" "}
                      Available for students

                    </label>

                  </div>

                </div>


                {/* SLOT FORM */}

                <div className="availability-editor">

                  <div className="availability-heading">

                    <div>

                      <h3>
                        Add Available Time
                      </h3>

                      <p>
                        Choose a day and the time when students can contact you.
                      </p>

                    </div>

                  </div>


                  <div className="slot-form">

                    <div className="slot-field">

                      <label>
                        Day
                      </label>

                      <select
                        value={
                          selectedDay
                        }
                        onChange={(e) =>
                          setSelectedDay(
                            e.target.value
                          )
                        }
                      >
                        <option>
                          Monday
                        </option>

                        <option>
                          Tuesday
                        </option>

                        <option>
                          Wednesday
                        </option>

                        <option>
                          Thursday
                        </option>

                        <option>
                          Friday
                        </option>

                      </select>

                    </div>


                    <div className="slot-field">

                      <label>
                        Start Time
                      </label>

                      <input
                        type="time"
                        value={
                          startTime
                        }
                        onChange={(e) =>
                          setStartTime(
                            e.target.value
                          )
                        }
                      />

                    </div>


                    <div className="slot-field">

                      <label>
                        End Time
                      </label>

                      <input
                        type="time"
                        value={
                          endTime
                        }
                        onChange={(e) =>
                          setEndTime(
                            e.target.value
                          )
                        }
                      />

                    </div>


                    <button
                      type="button"
                      className="add-slot-btn"
                      onClick={
                        addSlot
                      }
                    >
                      + Add Slot
                    </button>

                  </div>


                  {availabilitySlots.length > 0 && (

                    <div className="availability-slot-list edit-slots">

                      {availabilitySlots.map(
                        (slot, index) => (

                          <div
                            className="availability-slot"
                            key={`${slot.day}-${slot.startTime}-${slot.endTime}-${index}`}
                          >

                            <div>

                              <strong>
                                {slot.day}
                              </strong>

                              <span>
                                {slot.startTime}
                                {" - "}
                                {slot.endTime}
                              </span>

                            </div>

                            <button
                              type="button"
                              className="remove-slot-btn"
                              onClick={() =>
                                removeSlot(
                                  index
                                )
                              }
                            >
                              Remove
                            </button>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </div>


                {message && (

                  <p className="profile-message">
                    {message}
                  </p>

                )}


                <div className="profile-footer">

                  <button
                    type="button"
                    className="profile-back-btn"
                    onClick={
                      saveProfile
                    }
                    disabled={
                      saving
                    }
                  >
                    {saving
                      ? "Saving..."
                      : "Save Profile"}
                  </button>

                </div>

              </section>

            )}

          </>

        )}

      </main>

    </div>
  );
}

export default TutorProfile;