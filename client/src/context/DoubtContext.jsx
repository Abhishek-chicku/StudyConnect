import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DoubtContext = createContext(null);

const API_URL =
  `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

export function DoubtProvider({ children }) {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDoubts = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setDoubts([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/doubts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch doubts"
        );
      }

      setDoubts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch doubts error:", err);

      setError(
        err.message || "Unable to fetch doubts"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoubts();
  }, [fetchDoubts]);

  const addDoubt = async (newDoubt) => {
    const token = localStorage.getItem("token");

    try {
      setError("");

      const response = await fetch(`${API_URL}/doubts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDoubt),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit doubt"
        );
      }

      if (data.doubt) {
        setDoubts((previousDoubts) => [
          data.doubt,
          ...previousDoubts,
        ]);
      }

      return {
        success: true,
        data: data.doubt || data,
      };
    } catch (err) {
      console.error("Add doubt error:", err);

      setError(
        err.message || "Unable to submit doubt"
      );

      return {
        success: false,
        message: err.message,
      };
    }
  };

  const refreshDoubts = () => {
    fetchDoubts();
  };

  return (
    <DoubtContext.Provider
      value={{
        doubts,
        loading,
        error,
        addDoubt,
        fetchDoubts,
        refreshDoubts,
      }}
    >
      {children}
    </DoubtContext.Provider>
  );
}

export function useDoubts() {
  const context = useContext(DoubtContext);

  if (!context) {
    throw new Error(
      "useDoubts must be used inside DoubtProvider"
    );
  }

  return context;
}
