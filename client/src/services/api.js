const API_URL =
  `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

// =========================
// Auth APIs
// =========================

export async function signupUser(userData) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Signup failed");
  }

  return data;
}

export async function loginUser(userData) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

// =========================
// Doubt APIs
// =========================

export async function createDoubt(doubtData) {
  const response = await fetch(`${API_URL}/doubts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doubtData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit doubt");
  }

  return data;
}

export async function getStudentDoubts(studentId) {
  const response = await fetch(
    `${API_URL}/doubts/student/${studentId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch doubts");
  }

  return data;
}

export async function getAllDoubts() {
  const response = await fetch(`${API_URL}/doubts`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch doubts");
  }

  return data;
}
