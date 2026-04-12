import { Link, Routes, Route, useNavigate } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import ProjectsPage from "./pages/ProjectsPage";
import ServicesPage from "./pages/ServicesPage";
import ReferencesPage from "./pages/ReferencesPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import DashboardPage from "./pages/DashboardPage";

function AppContent() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  function handleSignOut() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div>
      <h1>Portfolio Frontend</h1>

      <nav>
        <Link to="/">Users</Link> |{" "}
        <Link to="/projects">Projects</Link> |{" "}
        <Link to="/services">Services</Link> |{" "}
        <Link to="/references">References</Link> |{" "}
        <Link to="/signup">Sign Up</Link> |{" "}
        <Link to="/signin">Sign In</Link>
        {token && (
          <>
            {" | "}
            <Link to="/dashboard">Dashboard</Link>
            {" | "}
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        )}
      </nav>

      <hr />

      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/references" element={<ReferencesPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route
          path="/dashboard"
          element={token ? <DashboardPage /> : <SignInPage />}
        />
      </Routes>
    </div>
  );
}

export default AppContent;