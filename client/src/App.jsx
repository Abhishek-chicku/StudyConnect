// import { useState } from "react";

// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import StudentDashboard from "./pages/StudentDashboard";
// import TutorDashboard from "./pages/TutorDashboard";
// import AskDoubt from "./pages/AskDoubt";
// import StudentProfile from "./pages/StudentProfile";
// import MyDoubts from "./pages/MyDoubts";
// import TutorProfile from "./pages/TutorProfile";

// function App() {
//   const [user, setUser] = useState(null);
//   const [page, setPage] = useState("landing");

//   const handleLogin = (userData) => {
//     setUser(userData);
//     setPage("dashboard");
//   };

//   const handleSignup = (userData) => {
//     setUser(userData);
//     setPage("dashboard");
//   };

//   const handleLogout = () => {
//     setUser(null);
//     setPage("landing");
//   };

//   // Landing page
//   if (!user && page === "landing") {
//     return (
//       <Landing
//         onLogin={() => setPage("login")}
//         onSignup={() => setPage("signup")}
//       />
//     );
//   }

//   // Login and Signup
//   if (!user) {
//     if (page === "signup") {
//       return (
//         <Signup
//           onSignup={handleSignup}
//           onBackToLogin={() => setPage("login")}
//         />
//       );
//     }

//     return (
//       <Login
//         onLogin={handleLogin}
//         onSignupPage={() => setPage("signup")}
//       />
//     );
//   }

//   // Student profile
//   if (page === "profile" && user.role === "student") {
//     return (
//       <StudentProfile
//         user={user}
//         onBack={() => setPage("dashboard")}
//         onLogout={handleLogout}
//       />
//     );
//   }

//   // Tutor profile
//   if (page === "tutor-profile" && user.role === "tutor") {
//     return (
//       <TutorProfile
//         user={user}
//         onBack={() => setPage("dashboard")}
//         onLogout={handleLogout}
//       />
//     );
//   }

//   // Ask doubt
//   if (page === "ask-doubt") {
//     return (
//       <AskDoubt
//         user={user}
//         onBack={() => setPage("dashboard")}
//       />
//     );
//   }

//   // My doubts
//   if (page === "myDoubts") {
//     return (
//       <MyDoubts
//         user={user}
//         onBack={() => setPage("dashboard")}
//         onProfile={() => setPage("profile")}
//         onLogout={handleLogout}
//       />
//     );
//   }

//   // Student dashboard
//   if (user.role === "student") {
//     return (
//       <StudentDashboard
//         user={user}
//         onLogout={handleLogout}
//         onAskDoubt={() => setPage("ask-doubt")}
//         onProfile={() => setPage("profile")}
//         onMyDoubts={() => setPage("myDoubts")}
//       />
//     );
//   }

//   // Tutor dashboard
//   if (user.role === "tutor") {
//     return (
//       <TutorDashboard
//         user={user}
//         onLogout={handleLogout}
//         onProfile={() => setPage("tutor-profile")}
//       />
//     );
//   }

//   return null;
// }

// export default App;


import { useState } from "react";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import AskDoubt from "./pages/AskDoubt";
import StudentProfile from "./pages/StudentProfile";
import MyDoubts from "./pages/MyDoubts";
import TutorProfile from "./pages/TutorProfile";
import FindTutor from "./pages/FindTutor";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("landing");
  const [selectedTutorId, setSelectedTutorId] =
    useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage("dashboard");
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setPage("landing");
    setSelectedTutorId(null);
  };

  const openTutorProfile = (tutorId) => {
    setSelectedTutorId(tutorId);
    setPage("tutor-profile-view");
  };

  const goToDashboard = () => {
    setPage("dashboard");
  };

  if (!user && page === "landing") {
    return (
      <Landing
        onLogin={() => setPage("login")}
        onSignup={() => setPage("signup")}
      />
    );
  }

  if (!user) {
    if (page === "signup") {
      return (
        <Signup
          onSignup={handleSignup}
          onBackToLogin={() => setPage("login")}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onSignupPage={() => setPage("signup")}
      />
    );
  }

  if (
    page === "find-tutor" &&
    user.role === "student"
  ) {
    return (
      <FindTutor
        user={user}
        onBack={goToDashboard}
        onLogout={handleLogout}
        onViewTutor={openTutorProfile}
      />
    );
  }

  if (
    page === "tutor-profile-view" &&
    user.role === "student" &&
    selectedTutorId
  ) {
    return (
      <TutorProfile
        user={user}
        tutorId={selectedTutorId}
        onBack={() => setPage("find-tutor")}
        onLogout={handleLogout}
        isStudentView
      />
    );
  }


  if (
    page === "profile" &&
    user.role === "student"
  ) {
    return (
      <StudentProfile
        user={user}
        onBack={goToDashboard}
        onLogout={handleLogout}
      />
    );
  }


  if (
    page === "tutor-profile" &&
    user.role === "tutor"
  ) {
    return (
      <TutorProfile
        user={user}
        onBack={goToDashboard}
        onLogout={handleLogout}
      />
    );
  }


  if (page === "ask-doubt") {
    return (
      <AskDoubt
        user={user}
        onBack={goToDashboard}
      />
    );
  }

  if (page === "myDoubts") {
    return (
      <MyDoubts
        user={user}
        onBack={goToDashboard}
        onProfile={() => setPage("profile")}
        onLogout={handleLogout}
      />
    );
  }

  if (user.role === "student") {
    return (
      <StudentDashboard
        user={user}
        onLogout={handleLogout}
        onAskDoubt={() => setPage("ask-doubt")}
        onProfile={() => setPage("profile")}
        onMyDoubts={() => setPage("myDoubts")}
        onFindTutors={() => setPage("find-tutor")}
      />
    );
  }

  if (user.role === "tutor") {
    return (
      <TutorDashboard
        user={user}
        onLogout={handleLogout}
        onProfile={() => setPage("tutor-profile")}
      />
    );
  }

  return null;
}

export default App;