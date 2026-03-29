import { Link, Routes, Route } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import ProjectsPage from "./pages/ProjectsPage";
import ServicesPage from "./pages/ServicesPage";
import ReferencesPage from "./pages/ReferencesPage";

function App() {
  return (
    <div>
      <h1>Portfolio Frontend</h1>

      <nav>
        <Link to="/">Users</Link> |{" "}
        <Link to="/projects">Projects</Link> |{" "}
        <Link to="/services">Services</Link> |{" "}
        <Link to="/references">References</Link>
      </nav>

      <hr />

      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/references" element={<ReferencesPage />} />
      </Routes>
    </div>
  );
}

export default App;