import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useDoubts } from "../context/DoubtContext";

const TOKEN_COST = {
  Normal: 10,
  High: 20,
  Urgent: 30,
};

const PRIORITY_DESCRIPTION = {
  Normal: "Response within a reasonable time",
  High: "Get help with higher priority",
  Urgent: "Get immediate tutor attention",
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function AskDoubt({ user, onBack }) {
  const { addDoubt } = useDoubts();

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableTokens =
    user?.availableTokens ?? user?.tokens ?? 100;

  const studentId = user?._id || user?.id;
  const selectedCost = TOKEN_COST[priority];

  const remainingTokens = Math.max(
    0,
    availableTokens - selectedCost
  );

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (event) => {
    const selectedImage = event.target.files?.[0];

    if (!selectedImage) return;

    setError("");

    if (!selectedImage.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (selectedImage.size > MAX_IMAGE_SIZE) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(selectedImage);
    setImagePreview(URL.createObjectURL(selectedImage));
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview("");
  };

  const validateForm = () => {
    if (!studentId) {
      return "User information is missing. Please login again.";
    }

    if (!subject) {
      return "Please select a subject.";
    }

    if (!description.trim()) {
      return "Please describe your doubt.";
    }

    if (description.trim().length < 10) {
      return "Please describe your doubt in at least 10 characters.";
    }

    if (availableTokens < selectedCost) {
      return "Insufficient tokens!";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const doubtData = {
        studentId,
        studentName: user?.name || "Student",
        studentEmail: user?.email || "",
        subject,
        question: description.trim(),
        description: description.trim(),
        priority,
        tokenCost: selectedCost,
        imageName: image?.name || null,
      };

      const result = await addDoubt(doubtData);

      if (!result?.success) {
        throw new Error(
          result?.message || "Failed to submit doubt"
        );
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Submit doubt error:", err);

      setError(
        err.message || "Failed to submit doubt. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="dashboard-page">
        <Navbar user={user} onBack={onBack} showBack />

        <main className="doubt-main">
          <div className="success-card">
            <div className="success-icon">✓</div>

            <h2>Doubt Submitted Successfully!</h2>

            <p>
              Your doubt has been saved successfully. We will try
              to connect you with an available tutor.
            </p>

            <button
              type="button"
              className="doubt-btn"
              onClick={onBack}
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar user={user} onBack={onBack} showBack />

      <main className="doubt-main">
        <div className="doubt-heading">
          <p className="profile-kicker">ASK FOR HELP</p>

          <h2>Submit Your Doubt</h2>

          <p>
            Share your question and connect with the right tutor.
          </p>
        </div>

        <form className="doubt-form-card" onSubmit={handleSubmit}>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-group">
            <label htmlFor="subject">Select Subject</label>

            <select
              id="subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              required
              disabled={loading}
            >
              <option value="">Choose a subject</option>
              <option value="Mathematics">📐 Mathematics</option>
              <option value="Physics">⚛️ Physics</option>
              <option value="Chemistry">🧪 Chemistry</option>
              <option value="Biology">🧬 Biology</option>
              <option value="Computer Science">
                💻 Computer Science
              </option>
              <option value="English">📖 English</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Describe Your Doubt</label>

            <textarea
              id="description"
              rows={6}
              maxLength={1000}
              required
              placeholder="Explain your question in detail..."
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              disabled={loading}
            />

            <div className="character-count">
              {description.length}/1000 characters
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">
              Upload Image{" "}
              <span className="optional-text">(Optional)</span>
            </label>

            <label className="upload-box" htmlFor="image">
              <span className="upload-icon">📎</span>

              <span>
                {image
                  ? image.name
                  : "Click to upload an image"}
              </span>

              <small>PNG, JPG or JPEG — Max 5 MB</small>
            </label>

            <input
              id="image"
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleImageChange}
              hidden
              disabled={loading}
            />

            {imagePreview && (
              <div className="image-preview-container">
                <img
                  src={imagePreview}
                  alt="Selected doubt"
                  className="image-preview"
                />

                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={removeImage}
                  disabled={loading}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Choose Priority</label>

            <div className="priority-grid">
              {Object.keys(TOKEN_COST).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`priority-btn ${
                    priority === item ? "selected" : ""
                  } ${item.toLowerCase()}`}
                  onClick={() => setPriority(item)}
                  disabled={loading}
                >
                  <strong>{item}</strong>
                  <span>{TOKEN_COST[item]} Tokens</span>
                </button>
              ))}
            </div>

            <div
              className={`priority-info ${priority.toLowerCase()}`}
            >
              <strong>{priority}</strong>

              <span>
                {PRIORITY_DESCRIPTION[priority]}
              </span>
            </div>
          </div>

          <div className="token-summary">
            <div>
              <span>Available Tokens</span>
              <strong>{availableTokens}</strong>
            </div>

            <div>
              <span>Request Cost</span>
              <strong>{selectedCost}</strong>
            </div>

            <div>
              <span>Remaining Tokens</span>
              <strong className="remaining-tokens">
                {remainingTokens}
              </strong>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onBack}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-doubt-btn"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Doubt →"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AskDoubt;